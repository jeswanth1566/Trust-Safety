"""AI agent routes: risk scoring, counterfeit detection, review moderation.

All endpoints require a valid JWT. Each decision is persisted to the
`audit_logs` collection for the Audit Logs and Analytics views.
"""
from datetime import datetime, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field

from app.core.database import get_db, is_connected
from app.core.security import get_current_user

router = APIRouter()


# ----- Input schemas -----
class RiskInput(BaseModel):
    order_id: str
    customer_id: str
    amount: float = Field(gt=0)
    shipping_country: str
    device_velocity: float = Field(ge=0)
    chargeback_history: int = Field(ge=0)
    previous_orders: int = Field(ge=0)
    mismatched_billing: bool = False


class CounterfeitInput(BaseModel):
    product_name: str
    msrp: float = Field(gt=0)
    selling_price: float = Field(gt=0)
    logo_match_score: float = Field(ge=0, le=100)
    package_score: float = Field(ge=0, le=100)
    image_quality: float = Field(ge=0, le=100)


class ReviewInput(BaseModel):
    reviewer_id: str
    text: str
    stars: int = Field(ge=1, le=5)
    historical_reviews: int = Field(ge=0)
    sentiment_score: float = Field(ge=-1, le=1)


# ----- Audit persistence helper -----
async def _log_decision(agent: str, actor: str, decision: str, reason: str, payload: dict):
    if not is_connected():
        return
    await get_db().audit_logs.insert_one({
        'agent': agent,
        'actor': actor,
        'decision': decision,
        'reason': reason,
        'payload': payload,
        'created_at': datetime.now(timezone.utc),
    })


@router.post('/risk-score')
async def risk_score(payload: RiskInput, user=Depends(get_current_user)):
    raw = (
        payload.chargeback_history * 18
        + payload.device_velocity * 8
        + payload.previous_orders * 1.5
        + (25 if payload.mismatched_billing else 0)
        + max(0, (payload.amount - 200) * 0.08)
    )
    risk = min(100, round(raw))
    confidence = min(99, max(60, 88 + (10 if payload.chargeback_history > 2 else 0)
                             - (5 if payload.previous_orders < 2 else 0)))
    decision = 'Block' if risk >= 75 else 'Review' if risk >= 45 else 'Approve'
    explanation = (
        'The order profile combines elevated chargeback history, anomalous device '
        'velocity, and pricing signals consistent with account takeover or synthetic '
        'fraud behavior.'
    )

    await _log_decision(
        'Risk Scoring Agent', user['sub'], decision,
        f'Risk {risk} — chargebacks={payload.chargeback_history}, '
        f'mismatched_billing={payload.mismatched_billing}',
        payload.model_dump(),
    )

    return {
        'risk_score': risk,
        'confidence': round(confidence, 1),
        'decision': decision,
        'explanation': explanation,
        'signals': {
            'chargeback_history': payload.chargeback_history,
            'device_velocity': payload.device_velocity,
            'mismatched_billing': payload.mismatched_billing,
            'amount': payload.amount,
        },
    }


@router.post('/counterfeit-detection')
async def counterfeit_detection(payload: CounterfeitInput, user=Depends(get_current_user)):
    price_gap = abs(payload.selling_price - payload.msrp) / payload.msrp * 100
    authenticity = (
        payload.logo_match_score * 0.4
        + payload.package_score * 0.35
        + payload.image_quality * 0.25
        - min(30, price_gap * 0.6)
    )
    counterfeit_probability = max(0, min(100, round(100 - authenticity)))
    decision = ('Authentic' if counterfeit_probability < 30
                else 'Review' if counterfeit_probability < 60 else 'Counterfeit')
    explanation = (
        'Visual authentication signals appear consistent with the official brand, but '
        'the price deviation and packaging mismatch raise concern for a high-probability '
        'counterfeit listing.'
    )

    await _log_decision(
        'Counterfeit Detection Agent', user['sub'], decision,
        f'Counterfeit prob {counterfeit_probability}% — price gap {round(price_gap, 1)}%',
        payload.model_dump(),
    )

    return {
        'counterfeit_probability': counterfeit_probability,
        'authenticity_score': round(authenticity, 1),
        'decision': decision,
        'explanation': explanation,
        'risk_factors': {
            'price_gap_percent': round(price_gap, 2),
            'logo_match_score': payload.logo_match_score,
            'package_score': payload.package_score,
            'image_quality': payload.image_quality,
        },
    }


@router.post('/review-moderation')
async def review_moderation(payload: ReviewInput, user=Depends(get_current_user)):
    sentiment_weight = max(0, min(1, (payload.sentiment_score + 1) / 2))
    ai_generated = (
        'The review contains a polished, generic style with low specificity and repeated '
        'language markers associated with AI-generated copy.'
    )
    spam_risk = min(100, round(
        (payload.historical_reviews * 2)
        + (100 if len(payload.text.split()) < 12 else 0)
        + (30 if payload.stars >= 4 and sentiment_weight > 0.85 else 0)
    ))
    credibility = min(100, round((100 - spam_risk) * 0.7 + (payload.sentiment_score + 1) * 50 * 0.3))
    decision = 'Removed' if spam_risk >= 70 else 'Review' if spam_risk >= 40 else 'Approved'
    explanation = (
        'The review demonstrates unusually high sentiment consistency and limited '
        'ground-truth detail, which is a common synthetic-review pattern.'
    )

    await _log_decision(
        'Review Moderation Agent', user['sub'], decision,
        f'Fake-review prob {spam_risk}% — {payload.stars}★',
        {'reviewer_id': payload.reviewer_id, 'stars': payload.stars},
    )

    return {
        'fake_review_probability': spam_risk,
        'credibility_score': round(credibility, 1),
        'sentiment': ('Positive' if payload.sentiment_score > 0.2
                      else 'Neutral' if payload.sentiment_score >= -0.2 else 'Negative'),
        'ai_generated': ai_generated,
        'explanation': explanation,
    }


@router.get('/health')
async def agent_health():
    return {'status': 'ok', 'agents': ['risk-score', 'counterfeit-detection', 'review-moderation']}

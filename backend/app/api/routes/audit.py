"""Audit log & analytics routes — serve persisted AI decisions to the UI."""
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query

from app.core.database import get_db
from app.core.security import get_current_user, require_role

router = APIRouter()


def _serialize(doc: dict) -> dict:
    created = doc.get('created_at')
    return {
        'id': str(doc.get('_id')),
        'agent': doc.get('agent'),
        'decision': doc.get('decision'),
        'reason': doc.get('reason'),
        'actor': doc.get('actor'),
        'time': created.isoformat() if isinstance(created, datetime) else created,
    }


@router.get('/logs')
async def list_logs(
    q: str | None = Query(default=None),
    limit: int = Query(default=50, le=200),
    user=Depends(get_current_user),
):
    db = get_db()
    query: dict = {}
    if q:
        query = {'$or': [
            {'agent': {'$regex': q, '$options': 'i'}},
            {'reason': {'$regex': q, '$options': 'i'}},
            {'actor': {'$regex': q, '$options': 'i'}},
        ]}
    cursor = db.audit_logs.find(query).sort('created_at', -1).limit(limit)
    return {'records': [_serialize(d) async for d in cursor]}


@router.get('/analytics')
async def analytics(user=Depends(get_current_user)):
    """Aggregate decision counts + a 6-month trend from persisted logs."""
    db = get_db()
    by_decision: dict[str, int] = {}
    async for row in db.audit_logs.aggregate([
        {'$group': {'_id': '$decision', 'count': {'$sum': 1}}}
    ]):
        by_decision[row['_id'] or 'Unknown'] = row['count']

    since = datetime.now(timezone.utc) - timedelta(days=180)
    trend: dict[str, int] = {}
    async for row in db.audit_logs.aggregate([
        {'$match': {'created_at': {'$gte': since}}},
        {'$group': {
            '_id': {'$dateToString': {'format': '%Y-%m', 'date': '$created_at'}},
            'count': {'$sum': 1},
        }},
        {'$sort': {'_id': 1}},
    ]):
        trend[row['_id']] = row['count']

    total = await db.audit_logs.count_documents({})
    return {'total': total, 'by_decision': by_decision, 'trend': trend}


@router.get('/dashboard')
async def dashboard(user=Depends(get_current_user)):
    """KPI cards, 6-month trend, and recent alerts for the dashboard."""
    db = get_db()

    total = await db.audit_logs.count_documents({})
    blocked = await db.audit_logs.count_documents(
        {'decision': {'$in': ['Block', 'Blocked', 'Counterfeit', 'Removed']}}
    )
    counterfeit = await db.audit_logs.count_documents({'decision': 'Counterfeit'})
    fake_reviews = await db.audit_logs.count_documents({'decision': 'Removed'})

    # Rough "revenue saved" proxy: $180 per blocked/removed decision.
    revenue_saved = blocked * 180

    since = datetime.now(timezone.utc) - timedelta(days=180)
    trend_map: dict[str, int] = {}
    async for row in db.audit_logs.aggregate([
        {'$match': {'created_at': {'$gte': since}}},
        {'$group': {
            '_id': {'$dateToString': {'format': '%Y-%m', 'date': '$created_at'}},
            'fraud': {'$sum': 1},
            'blocked': {'$sum': {'$cond': [
                {'$in': ['$decision', ['Block', 'Blocked', 'Counterfeit', 'Removed']]}, 1, 0]}},
        }},
        {'$sort': {'_id': 1}},
    ]):
        trend_map[row['_id']] = {'month': row['_id'], 'fraud': row['fraud'], 'blocked': row['blocked']}

    # Recent decisions as "alerts".
    alerts = []
    async for d in db.audit_logs.find().sort('created_at', -1).limit(5):
        sev = ('critical' if d.get('decision') in ('Block', 'Blocked', 'Counterfeit')
               else 'high' if d.get('decision') == 'Removed'
               else 'medium' if d.get('decision') == 'Review' else 'low')
        alerts.append({
            'id': str(d.get('_id')),
            'title': d.get('agent'),
            'detail': d.get('reason'),
            'severity': sev,
        })

    return {
        'kpis': {
            'total_decisions': total,
            'revenue_saved': revenue_saved,
            'counterfeit_blocked': counterfeit,
            'fake_reviews_removed': fake_reviews,
        },
        'trend': list(trend_map.values()),
        'alerts': alerts,
    }

export const featureCards = [
  {
    title: 'AI Risk Scoring',
    description: 'Detect suspicious orders with explainable risk models and real-time policy guidance.',
    icon: 'shield',
  },
  {
    title: 'Counterfeit Defense',
    description: 'Spot unauthorized sellers, logo mismatches, and suspicious packaging in seconds.',
    icon: 'scan',
  },
  {
    title: 'Review Integrity',
    description: 'Moderate spam, synthetic reviews, and sentiment anomalies before they hit the storefront.',
    icon: 'sparkles',
  },
  {
    title: 'Policy Automation',
    description: 'Coordinate enforcement rules, escalations, and human review flows across the marketplace.',
    icon: 'bolt',
  },
]

export const aiAgents = [
  { name: 'Risk Scoring Agent', detail: 'Behavioral profiling + transaction anomaly detection' },
  { name: 'Counterfeit Detection Agent', detail: 'Image analysis + MSRP and packaging comparison' },
  { name: 'Review Moderation Agent', detail: 'Sentiment scoring + AI-content detection + spam filters' },
]

export const stats = [
  { value: '99.97%', label: 'Policy accuracy' },
  { value: '2.8M', label: 'Orders reviewed' },
  { value: '48%', label: 'Fewer chargebacks' },
  { value: '12 min', label: 'Avg. review time' },
]

export const workflowSteps = [
  'Ingest marketplace signals',
  'Run AI trust classifiers',
  'Prioritize human review',
  'Enforce actions and monitor outcomes',
]

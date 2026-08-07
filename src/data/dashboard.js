export const stats = [
  { label: 'Revenue Saved', value: '$8.4M', change: '+18.2%', trend: 'up', tone: 'emerald' },
  { label: 'Fraud Detected', value: '12.4K', change: '+9.8%', trend: 'up', tone: 'blue' },
  { label: 'Counterfeit Blocked', value: '4,826', change: '+23.1%', trend: 'up', tone: 'violet' },
  { label: 'Fake Reviews Removed', value: '2,943', change: '-4.7%', trend: 'down', tone: 'amber' },
]

export const alerts = [
  { id: 1, title: 'High-risk order cluster', time: '2 min ago', severity: 'critical', detail: '24 suspicious orders matched chargeback history.' },
  { id: 2, title: 'Brand impersonation', time: '12 min ago', severity: 'high', detail: '3 listings matched counterfeit packaging patterns.' },
  { id: 3, title: 'Review spam wave', time: '31 min ago', severity: 'medium', detail: '141 AI-generated review signals identified.' },
]

export const modelMetrics = [
  { name: 'Risk Scoring', value: 92, color: '#7c3aed' },
  { name: 'Counterfeit AI', value: 88, color: '#22c55e' },
  { name: 'Review Moderation', value: 94, color: '#3b82f6' },
]

export const trendData = [
  { month: 'Jan', fraud: 45, blocked: 30, reviews: 52 },
  { month: 'Feb', fraud: 52, blocked: 38, reviews: 61 },
  { month: 'Mar', fraud: 60, blocked: 44, reviews: 66 },
  { month: 'Apr', fraud: 56, blocked: 48, reviews: 74 },
  { month: 'May', fraud: 68, blocked: 56, reviews: 82 },
  { month: 'Jun', fraud: 74, blocked: 63, reviews: 90 },
]

export const sellers = [
  { name: 'Northline Tech', fraud: 18, score: 71 },
  { name: 'Aster Goods', fraud: 12, score: 82 },
  { name: 'Luma Retail', fraud: 9, score: 89 },
  { name: 'Harbor Market', fraud: 15, score: 77 },
]

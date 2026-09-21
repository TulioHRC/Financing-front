export type AnalysisCategory =
  | 'PROFITABILITY'
  | 'DEBT'
  | 'GROWTH'
  | 'GOVERNANCE'
  | 'PRICE'
  | 'DIVIDENDS';

export const ANALYSIS_CATEGORIES: { key: AnalysisCategory; label: string }[] = [
  { key: 'PROFITABILITY', label: 'Profitability' },
  { key: 'DEBT', label: 'Debt' },
  { key: 'GROWTH', label: 'Growth' },
  { key: 'GOVERNANCE', label: 'Governance' },
  { key: 'PRICE', label: 'Price' },
  { key: 'DIVIDENDS', label: 'Dividends' },
];

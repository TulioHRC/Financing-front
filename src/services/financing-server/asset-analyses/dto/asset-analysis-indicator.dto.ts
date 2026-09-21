export interface AssetAnalysisIndicatorInputDTO {
  name: string;
  value: number;
  unit?: string;
}

export interface AssetAnalysisIndicatorDTO {
  id: string;
  name: string;
  value: number;
  unit: string | null;
}

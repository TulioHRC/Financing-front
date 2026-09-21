export type AssetVerdict = "BUY" | "WAIT" | "AVOID";

export const ASSET_VERDICTS: { key: AssetVerdict; label: string }[] = [
  { key: "BUY", label: "Buy" },
  { key: "WAIT", label: "Wait" },
  { key: "AVOID", label: "Avoid" },
];

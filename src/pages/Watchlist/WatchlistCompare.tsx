import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { financingApi } from "../../services/financing-server/financing-api";
import { useWatchlistComparison } from "../../hooks/useWatchlistComparison";
import { ANALYSIS_CATEGORIES, AnalysisCategory } from "../../services/financing-server/asset-analyses/analysis-category";
import { CATEGORY_GUIDANCE } from "../../services/financing-server/asset-analyses/category-guidance";
import InfoTooltip from "../../components/tooltip/Tooltip";
import StarRating from "../../components/star-rating/StarRating";
import {
  Container,
  HeaderSection,
  TitleContainer,
  Title,
  Subtitle,
  PrimaryButton,
  SectionCard,
  CompareAssetPicker,
  CompareAssetChip,
  CompareTable,
  CompareTh,
  CompareTd,
} from "./styles/styled-components";

const RADAR_COLORS = ["#4060E3", "#2A7E39", "#F03E3E", "#F76707"];
const MAX_COMPARED_ASSETS = 4;

const WatchlistCompare: React.FC = () => {
  const { data, isLoading } = useWatchlistComparison();
  const navigate = useNavigate();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  // Edits made in-place here are applied immediately (optimistic) so clicking a
  // star feels instant, independent of the save request's round trip.
  const [scoreOverrides, setScoreOverrides] = useState<Record<string, Partial<Record<AnalysisCategory, number>>>>(
    {}
  );

  const comparableAssets = useMemo(
    () => (data ?? []).filter((asset) => asset.categories.length > 0),
    [data]
  );

  const selectedAssets = useMemo(
    () => comparableAssets.filter((asset) => selectedIds.includes(asset.id)),
    [comparableAssets, selectedIds]
  );

  const getScore = (assetId: string, category: AnalysisCategory): number => {
    const override = scoreOverrides[assetId]?.[category];
    if (override !== undefined) return override;
    const asset = comparableAssets.find((a) => a.id === assetId);
    return asset?.categories.find((c) => c.category === category)?.score ?? 0;
  };

  const getAverage = (assetId: string): number => {
    const scores = ANALYSIS_CATEGORIES.map(({ key }) => getScore(assetId, key));
    return scores.reduce((sum, s) => sum + s, 0) / scores.length;
  };

  // Recomputed on every render (cheap: at most 6 categories x 4 assets) so it
  // always reflects the latest optimistic score edits without a memo dependency
  // on the `getScore` closure.
  const radarData = ANALYSIS_CATEGORIES.map(({ key, label }) => {
    const row: Record<string, string | number> = { category: label };
    selectedAssets.forEach((asset) => {
      row[asset.name] = getScore(asset.id, key);
    });
    return row;
  });

  if (isLoading || data === null) {
    return (
      <Container>
        <Subtitle>Loading assets...</Subtitle>
      </Container>
    );
  }

  const toggleAsset = (id: string) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) return prev.filter((assetId) => assetId !== id);
      if (prev.length >= MAX_COMPARED_ASSETS) return prev;
      return [...prev, id];
    });
  };

  const handleScoreChange = async (assetId: string, analysisId: string, category: AnalysisCategory, score: number) => {
    setScoreOverrides((prev) => ({
      ...prev,
      [assetId]: { ...prev[assetId], [category]: score },
    }));

    try {
      await financingApi.assetAnalyses.updateCategoryScore({ id: analysisId, category, score });
    } catch (error) {
      console.error("Failed to update score", error);
      setScoreOverrides((prev) => {
        const assetOverrides = { ...prev[assetId] };
        delete assetOverrides[category];
        return { ...prev, [assetId]: assetOverrides };
      });
    }
  };

  return (
    <Container>
      <HeaderSection>
        <TitleContainer>
          <Title>Compare Assets</Title>
          <Subtitle>
            Pick up to {MAX_COMPARED_ASSETS} assets to compare side by side — click a star to adjust a
            score right here
          </Subtitle>
        </TitleContainer>
        <PrimaryButton onClick={() => navigate("/watchlist")}>Back to Watchlist</PrimaryButton>
      </HeaderSection>

      <SectionCard>
        <CompareAssetPicker>
          {comparableAssets.map((asset) => (
            <CompareAssetChip
              key={asset.id}
              type="button"
              $active={selectedIds.includes(asset.id)}
              disabled={!selectedIds.includes(asset.id) && selectedIds.length >= MAX_COMPARED_ASSETS}
              onClick={() => toggleAsset(asset.id)}
            >
              {asset.name}
            </CompareAssetChip>
          ))}
        </CompareAssetPicker>
        {comparableAssets.length === 0 && (
          <Subtitle>No analyzed assets yet. Add an analysis first.</Subtitle>
        )}
      </SectionCard>

      {selectedAssets.length > 0 && (
        <>
          <SectionCard>
            <div style={{ width: "100%", height: 400 }}>
              <ResponsiveContainer>
                <RadarChart data={radarData} outerRadius={120}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="category" />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} />
                  {selectedAssets.map((asset, index) => (
                    <Radar
                      key={asset.id}
                      name={asset.name}
                      dataKey={asset.name}
                      stroke={RADAR_COLORS[index % RADAR_COLORS.length]}
                      fill={RADAR_COLORS[index % RADAR_COLORS.length]}
                      fillOpacity={0.15}
                    />
                  ))}
                  <Legend />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </SectionCard>

          <SectionCard>
            <CompareTable>
              <thead>
                <tr>
                  <CompareTh>Category</CompareTh>
                  {selectedAssets.map((asset) => (
                    <CompareTh key={asset.id}>{asset.name}</CompareTh>
                  ))}
                </tr>
              </thead>
              <tbody>
                {ANALYSIS_CATEGORIES.map(({ key, label }) => (
                  <tr key={key}>
                    <CompareTd style={{ fontWeight: "bold" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                        {label}
                        <InfoTooltip text={CATEGORY_GUIDANCE[key]} />
                      </span>
                    </CompareTd>
                    {selectedAssets.map((asset) => {
                      const found = asset.categories.find((c) => c.category === key);
                      return (
                        <CompareTd key={asset.id}>
                          {asset.latest_analysis_id ? (
                            <StarRating
                              value={getScore(asset.id, key)}
                              onChange={(score) =>
                                handleScoreChange(asset.id, asset.latest_analysis_id as string, key, score)
                              }
                            />
                          ) : (
                            "-"
                          )}
                          {found && found.indicators.length > 0 && (
                            <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "2px" }}>
                              {found.indicators
                                .map((i) => `${i.name}: ${i.value}${i.unit ?? ""}`)
                                .join(" · ")}
                            </div>
                          )}
                        </CompareTd>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  <CompareTd style={{ fontWeight: "bold" }}>Average</CompareTd>
                  {selectedAssets.map((asset) => (
                    <CompareTd key={asset.id} style={{ fontWeight: "bold" }}>
                      <StarRating value={getAverage(asset.id)} />
                    </CompareTd>
                  ))}
                </tr>
              </tbody>
            </CompareTable>
          </SectionCard>
        </>
      )}
    </Container>
  );
};

export default WatchlistCompare;

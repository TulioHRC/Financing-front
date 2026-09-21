import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from "recharts";
import { useWatchlistAssetDetail } from "../../hooks/useWatchlistAssetDetail";
import { removeWatchlistAssetById, removeAssetAnalysisById } from "../../hooks/functions/removeById";
import { ANALYSIS_CATEGORIES } from "../../services/financing-server/asset-analyses/analysis-category";
import { ASSET_VERDICTS } from "../../services/financing-server/asset-analyses/asset-verdict";
import { CATEGORY_GUIDANCE } from "../../services/financing-server/asset-analyses/category-guidance";
import RadarChartComponent from "../../components/charts/RadarChartComponent";
import InfoTooltip from "../../components/tooltip/Tooltip";
import StarRating from "../../components/star-rating/StarRating";
import {
  Container,
  HeaderSection,
  TitleContainer,
  Title,
  Subtitle,
  ActionsRow,
  PrimaryButton,
  DangerButton,
  SectionCard,
  DetailHeaderCard,
  DetailInfo,
  LinkedBadge,
  ScoreBadge,
  VerdictBadge,
  HistoryCard,
  HistoryCardHeader,
  HistoryCardActions,
  HistoryCategoryGrid,
  HistoryCategoryItem,
  HistoryCategoryTitle,
  HistoryCategoryComment,
  IndicatorSummary,
  IndicatorChip,
  ObservationsBox,
} from "./styles/styled-components";

const categoryLabel = (key: string) => ANALYSIS_CATEGORIES.find((c) => c.key === key)?.label ?? key;
const verdictLabel = (verdict: string | null) =>
  ASSET_VERDICTS.find((v) => v.key === verdict)?.label ?? "No verdict";

const WatchlistDetail: React.FC = () => {
  const { assetId } = useParams<{ assetId: string }>();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useWatchlistAssetDetail(assetId as string);

  const radarData = useMemo(() => {
    const latest = data?.analyses[0];
    if (!latest) return [];
    return latest.categories.map((c) => ({ category: categoryLabel(c.category), score: c.score }));
  }, [data]);

  const scoreOverTimeData = useMemo(() => {
    if (!data) return [];
    return [...data.analyses]
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map((analysis) => ({
        date: new Date(analysis.date).toLocaleDateString(),
        average_score:
          analysis.categories.length > 0
            ? Number(
              (
                analysis.categories.reduce((sum, c) => sum + c.score, 0) / analysis.categories.length
              ).toFixed(2)
            )
            : null,
      }));
  }, [data]);

  if (isLoading || data === null) {
    return (
      <Container>
        <Subtitle>Loading asset...</Subtitle>
      </Container>
    );
  }

  const { asset, analyses } = data;

  const handleDeleteAsset = async () => {
    if (!window.confirm("Remove this asset and all its analyses from your watchlist?")) return;
    await removeWatchlistAssetById(asset.id);
    navigate("/watchlist");
  };

  const handleDeleteAnalysis = async (analysisId: string) => {
    if (!window.confirm("Delete this analysis entry?")) return;
    await removeAssetAnalysisById(analysisId);
    refetch();
  };

  return (
    <Container>
      <HeaderSection>
        <TitleContainer>
          <Title>{asset.name}</Title>
          <Subtitle>
            {asset.asset_type}
            {asset.segment ? ` · ${asset.segment}` : ""}
          </Subtitle>
        </TitleContainer>
        <ActionsRow>
          <PrimaryButton onClick={() => navigate(`/watchlist/${asset.id}/analyses/new`)}>
            + New Analysis
          </PrimaryButton>
          <DangerButton onClick={handleDeleteAsset}>Delete Asset</DangerButton>
        </ActionsRow>
      </HeaderSection>

      <DetailHeaderCard>
        <DetailInfo>
          {asset.investiment_id && <LinkedBadge>Already in your portfolio</LinkedBadge>}
          {asset.description && <Subtitle>{asset.description}</Subtitle>}
        </DetailInfo>
      </DetailHeaderCard>

      {radarData.length > 0 && (
        <SectionCard>
          <RadarChartComponent title="Latest Analysis" data={radarData} />
        </SectionCard>
      )}

      {scoreOverTimeData.length > 1 && (
        <SectionCard>
          <h2>Average Score Over Time</h2>
          <div style={{ width: "100%", height: 260 }}>
            <ResponsiveContainer>
              <LineChart data={scoreOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 5]} />
                <RechartsTooltip />
                <Line type="monotone" dataKey="average_score" stroke="#4060E3" name="Average Score" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>
      )}

      {analyses.length === 0 ? (
        <Subtitle>No analyses yet. Click "+ New Analysis" to add the first one.</Subtitle>
      ) : (
        analyses.map((analysis) => {
          const averageScore =
            analysis.categories.length > 0
              ? analysis.categories.reduce((sum, c) => sum + c.score, 0) / analysis.categories.length
              : null;

          return (
            <HistoryCard key={analysis.id}>
              <HistoryCardHeader>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <strong>{new Date(analysis.date).toLocaleDateString()}</strong>
                  <ScoreBadge score={averageScore}>
                    {averageScore !== null ? <StarRating value={averageScore} /> : "-"}
                  </ScoreBadge>
                  <VerdictBadge verdict={analysis.verdict}>{verdictLabel(analysis.verdict)}</VerdictBadge>
                </div>
                <HistoryCardActions>
                  <PrimaryButton
                    onClick={() => navigate(`/watchlist/${asset.id}/analyses/${analysis.id}/edit`)}
                  >
                    Edit
                  </PrimaryButton>
                  <DangerButton onClick={() => handleDeleteAnalysis(analysis.id)}>Delete</DangerButton>
                </HistoryCardActions>
              </HistoryCardHeader>

              <HistoryCategoryGrid>
                {analysis.categories.map((category) => (
                  <HistoryCategoryItem key={category.id}>
                    <HistoryCategoryTitle>
                      {categoryLabel(category.category)}
                      <InfoTooltip text={CATEGORY_GUIDANCE[category.category]} />
                      <ScoreBadge score={category.score}>
                        <StarRating value={category.score} />
                      </ScoreBadge>
                    </HistoryCategoryTitle>
                    <HistoryCategoryComment>{category.comment}</HistoryCategoryComment>
                    {category.indicators.length > 0 && (
                      <IndicatorSummary>
                        {category.indicators.map((indicator) => (
                          <IndicatorChip key={indicator.id}>
                            {indicator.name}: {indicator.value}
                            {indicator.unit ?? ""}
                          </IndicatorChip>
                        ))}
                      </IndicatorSummary>
                    )}
                  </HistoryCategoryItem>
                ))}
              </HistoryCategoryGrid>

              {analysis.observations && (
                <ObservationsBox>{analysis.observations}</ObservationsBox>
              )}
            </HistoryCard>
          );
        })
      )}
    </Container>
  );
};

export default WatchlistDetail;

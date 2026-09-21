import { useNavigate } from "react-router-dom";
import { useWatchlistComparison } from "../../hooks/useWatchlistComparison";
import { removeWatchlistAssetById } from "../../hooks/functions/removeById";
import { ASSET_VERDICTS } from "../../services/financing-server/asset-analyses/asset-verdict";
import StarRating from "../../components/star-rating/StarRating";
import {
  Container,
  HeaderSection,
  TitleContainer,
  Title,
  Subtitle,
  ActionsRow,
  PrimaryButton,
  AssetsTable,
  Th,
  Td,
  ScoreBadge,
  VerdictBadge,
  NeedsReviewBadge,
  DangerButton,
} from "./styles/styled-components";

const NEEDS_REVIEW_AFTER_MONTHS = 6;

const verdictLabel = (verdict: string | null): string =>
  ASSET_VERDICTS.find((v) => v.key === verdict)?.label ?? "No verdict";

const needsReview = (latestAnalysisDate: string | null): boolean => {
  if (!latestAnalysisDate) return true;
  const monthsSince =
    (Date.now() - new Date(latestAnalysisDate).getTime()) / (1000 * 60 * 60 * 24 * 30);
  return monthsSince >= NEEDS_REVIEW_AFTER_MONTHS;
};

const Watchlist: React.FC = () => {
  const { data, isLoading, refetch } = useWatchlistComparison();
  const navigate = useNavigate();

  if (isLoading || data === null) {
    return (
      <Container>
        <Subtitle>Loading watchlist...</Subtitle>
      </Container>
    );
  }

  const handleDelete = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation();
    if (!window.confirm("Remove this asset and all its analyses from your watchlist?")) return;
    await removeWatchlistAssetById(id);
    refetch();
  };

  const sortedAssets = [...data].sort(
    (a, b) => (b.average_score ?? -1) - (a.average_score ?? -1)
  );

  return (
    <Container>
      <HeaderSection>
        <TitleContainer>
          <Title>Watchlist</Title>
          <Subtitle>Assets you're studying before deciding to invest</Subtitle>
        </TitleContainer>
        <ActionsRow>
          <PrimaryButton onClick={() => navigate("/watchlist/compare")}>Compare Assets</PrimaryButton>
          <PrimaryButton onClick={() => navigate("/watchlist/new")}>+ New Analysis</PrimaryButton>
        </ActionsRow>
      </HeaderSection>

      {sortedAssets.length === 0 ? (
        <Subtitle>No assets yet. Click "+ New Analysis" to add your first one.</Subtitle>
      ) : (
        <AssetsTable>
          <thead>
            <tr>
              <Th>Name</Th>
              <Th>Type</Th>
              <Th>Segment</Th>
              <Th>Score</Th>
              <Th>Verdict</Th>
              <Th>Last Analysis</Th>
              <Th></Th>
            </tr>
          </thead>
          <tbody>
            {sortedAssets.map((asset) => (
              <tr
                key={asset.id}
                onClick={() => navigate(`/watchlist/${asset.id}`)}
                style={{ cursor: "pointer" }}
              >
                <Td style={{ fontWeight: "bold" }}>
                  {asset.name}
                  {asset.investiment_id && " \u{1F4CC}"}
                </Td>
                <Td>{asset.asset_type}</Td>
                <Td>{asset.segment ?? "-"}</Td>
                <Td>
                  {asset.average_score !== null ? (
                    <ScoreBadge score={asset.average_score}>
                      <StarRating value={asset.average_score} />
                    </ScoreBadge>
                  ) : (
                    <ScoreBadge score={null}>No analysis</ScoreBadge>
                  )}
                </Td>
                <Td>
                  <VerdictBadge verdict={asset.latest_verdict}>
                    {verdictLabel(asset.latest_verdict)}
                  </VerdictBadge>
                </Td>
                <Td>
                  {asset.latest_analysis_date
                    ? new Date(asset.latest_analysis_date).toLocaleDateString()
                    : "-"}{" "}
                  {needsReview(asset.latest_analysis_date) && (
                    <NeedsReviewBadge>Needs review</NeedsReviewBadge>
                  )}
                </Td>
                <Td>
                  <DangerButton onClick={(event) => handleDelete(asset.id, event)}>
                    Delete
                  </DangerButton>
                </Td>
              </tr>
            ))}
          </tbody>
        </AssetsTable>
      )}
    </Container>
  );
};

export default Watchlist;

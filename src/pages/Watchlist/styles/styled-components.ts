import styled from "styled-components";
import { theme } from "../../../styles/Theme.constants";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  gap: 24px;
  padding: 40px;
  font-family: ${theme.font.family.primary}, sans-serif;
  color: ${theme.color.neutralBlue[900]};
`;

export const HeaderSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid ${theme.color.neutralBlue[300]};
  padding-bottom: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
  }
`;

export const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const Title = styled.h1`
  font-family: ${theme.font.family.title}, sans-serif;
  font-size: 28px;
  font-weight: ${theme.font.weight.bold};
  color: ${theme.color.neutralBlue[1000]};
  margin: 0;
`;

export const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.color.neutralBlue[600]};
  margin: 0;
`;

export const ActionsRow = styled.div`
  display: flex;
  gap: 12px;
`;

export const PrimaryButton = styled.button`
  background-color: ${theme.color.highlight[700]};
  color: ${theme.color.primitives.allWhite};
  border: none;
  border-radius: 8px;
  padding: 10px 18px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;

  &:hover {
    background-color: ${theme.color.highlight[800]};
  }

  &:disabled {
    background-color: ${theme.color.neutralBlue[400]};
    cursor: not-allowed;
  }
`;

export const DangerButton = styled.button`
  background: none;
  border: 1px solid ${theme.color.error[700]};
  color: ${theme.color.error[700]};
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    background-color: ${theme.color.error[100]};
  }
`;

export const ErrorMessage = styled.p`
  color: ${theme.color.error[900]};
  background-color: ${theme.color.error[100]};
  border: 1px solid ${theme.color.error[700]};
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 13px;
  margin: 0;
`;

export const SectionCard = styled.div`
  background: ${theme.color.primitives.allWhite};
  border-radius: 12px;
  border: 1px solid ${theme.color.neutralBlue[300]};
  box-shadow: ${theme.box_shadow.default};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

export const AssetsTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
`;

export const Th = styled.th`
  text-align: left;
  padding: 12px 8px;
  color: ${theme.color.neutralBlue[600]};
  font-weight: ${theme.font.weight.semibold};
  border-bottom: 2px solid ${theme.color.neutralBlue[300]};
`;

export const Td = styled.td`
  padding: 12px 8px;
  border-bottom: 1px solid ${theme.color.neutralBlue[300]};
  color: ${theme.color.neutralBlue[900]};
`;

export const ScoreBadge = styled.span<{ score: number | null }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: ${theme.font.weight.bold};
  font-size: 12px;
  white-space: nowrap;
  background-color: ${(props) => {
    if (props.score === null) return theme.color.neutralBlue[300];
    if (props.score >= 4) return theme.color.success[200];
    if (props.score >= 2.5) return theme.color.atention[200];
    return theme.color.error[200];
  }};
  color: ${(props) => {
    if (props.score === null) return theme.color.neutralBlue[600];
    if (props.score >= 4) return theme.color.success[900];
    if (props.score >= 2.5) return theme.color.atention[700];
    return theme.color.error[900];
  }};
`;

export const VerdictBadge = styled.span<{ verdict: "BUY" | "WAIT" | "AVOID" | null }>`
  display: inline-block;
  padding: 4px 10px;
  border-radius: 999px;
  font-weight: ${theme.font.weight.bold};
  font-size: 12px;
  white-space: nowrap;
  background-color: ${(props) => {
    if (props.verdict === "BUY") return theme.color.success[200];
    if (props.verdict === "WAIT") return theme.color.atention[200];
    if (props.verdict === "AVOID") return theme.color.error[200];
    return theme.color.neutralBlue[300];
  }};
  color: ${(props) => {
    if (props.verdict === "BUY") return theme.color.success[900];
    if (props.verdict === "WAIT") return theme.color.atention[700];
    if (props.verdict === "AVOID") return theme.color.error[900];
    return theme.color.neutralBlue[600];
  }};
`;

export const NeedsReviewBadge = styled.span`
  display: inline-block;
  padding: 3px 8px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: ${theme.font.weight.bold};
  background-color: ${theme.color.atention[200]};
  color: ${theme.color.atention[700]};
`;

export const VerdictSelectorRow = styled.div`
  display: flex;
  gap: 8px;
`;

export const VerdictOption = styled.button<{ $active: boolean; $verdict: "BUY" | "WAIT" | "AVOID" }>`
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: ${theme.font.weight.semibold};
  font-size: 13px;
  cursor: pointer;
  border: 2px solid ${(props) => {
    if (props.$verdict === "BUY") return theme.color.success[900];
    if (props.$verdict === "WAIT") return theme.color.atention[700];
    return theme.color.error[900];
  }};
  background-color: ${(props) => {
    if (!props.$active) return "transparent";
    if (props.$verdict === "BUY") return theme.color.success[900];
    if (props.$verdict === "WAIT") return theme.color.atention[700];
    return theme.color.error[900];
  }};
  color: ${(props) => {
    if (props.$active) return theme.color.primitives.allWhite;
    if (props.$verdict === "BUY") return theme.color.success[900];
    if (props.$verdict === "WAIT") return theme.color.atention[700];
    return theme.color.error[900];
  }};
`;

export const IndicatorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const IndicatorRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr auto;
  gap: 6px;
  align-items: center;
`;

export const IndicatorInput = styled.input`
  padding: 6px 8px;
  font-size: 12px;
  border: 1px solid ${theme.color.neutralBlue[400]};
  border-radius: 6px;
  outline: none;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.color.highlight[700]};
  }
`;

export const RemoveIndicatorButton = styled.button`
  background: none;
  border: none;
  color: ${theme.color.error[700]};
  cursor: pointer;
  font-size: 16px;
  line-height: 1;
  padding: 4px;
`;

export const IndicatorLabel = styled.div`
  font-size: 11px;
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.color.neutralBlue[600]};
  text-transform: uppercase;
  letter-spacing: 0.4px;
`;

export const AddIndicatorButton = styled.button`
  align-self: flex-start;
  background: none;
  border: 1px dashed ${theme.color.neutralBlue[500]};
  color: ${theme.color.neutralBlue[600]};
  border-radius: 6px;
  padding: 6px 10px;
  font-size: 12px;
  cursor: pointer;

  &:hover {
    border-color: ${theme.color.highlight[700]};
    color: ${theme.color.highlight[700]};
  }
`;

export const IndicatorSummary = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
`;

export const IndicatorChip = styled.span`
  font-size: 11px;
  font-weight: ${theme.font.weight.semibold};
  background-color: ${theme.color.neutralBlue[200]};
  color: ${theme.color.neutralBlue[700]};
  border-radius: 999px;
  padding: 2px 8px;
`;

export const CompareAssetPicker = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
`;

export const CompareAssetChip = styled.button<{ $active: boolean }>`
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid ${theme.color.highlight[700]};
  background-color: ${(props) => (props.$active ? theme.color.highlight[700] : "transparent")};
  color: ${(props) => (props.$active ? theme.color.primitives.allWhite : theme.color.highlight[700])};
  font-size: 13px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`;

export const CompareTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
`;

export const CompareTh = styled.th`
  text-align: left;
  padding: 10px 8px;
  color: ${theme.color.neutralBlue[600]};
  font-weight: ${theme.font.weight.semibold};
  border-bottom: 2px solid ${theme.color.neutralBlue[300]};
`;

export const CompareTd = styled.td`
  padding: 10px 8px;
  border-bottom: 1px solid ${theme.color.neutralBlue[300]};
  color: ${theme.color.neutralBlue[900]};
`;

export const FormCard = styled(SectionCard)``;

export const FieldRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;

  > * {
    flex: 1;
    min-width: 180px;
  }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Label = styled.label`
  font-size: 12px;
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.color.neutralBlue[600]};
`;

export const StyledInput = styled.input`
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid ${theme.color.neutralBlue[400]};
  border-radius: 8px;
  outline: none;

  &:focus {
    border-color: ${theme.color.highlight[700]};
  }
`;

export const StyledTextarea = styled.textarea`
  padding: 10px 12px;
  font-size: 14px;
  font-family: ${theme.font.family.primary}, sans-serif;
  border: 1px solid ${theme.color.neutralBlue[400]};
  border-radius: 8px;
  outline: none;
  resize: vertical;
  width: 100%;
  box-sizing: border-box;

  &:focus {
    border-color: ${theme.color.highlight[700]};
  }
`;

export const CategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
`;

export const CategoryCard = styled.div`
  background: ${theme.color.primitives.allWhite};
  border-radius: 12px;
  border: 1px solid ${theme.color.neutralBlue[300]};
  box-shadow: ${theme.box_shadow.default};
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

export const CategoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: ${theme.font.weight.bold};
  color: ${theme.color.neutralBlue[1000]};
`;

export const SubmitButton = styled.button`
  align-self: flex-start;
  background-color: ${theme.color.success[900]};
  color: ${theme.color.primitives.allWhite};
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;

  &:hover {
    background-color: ${theme.color.success[800]};
  }

  &:disabled {
    background-color: ${theme.color.neutralBlue[400]};
    cursor: not-allowed;
  }
`;

export const DetailHeaderCard = styled(SectionCard)`
  flex-direction: row;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
`;

export const DetailInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  max-width: 640px;
`;

export const LinkedBadge = styled.span`
  display: inline-block;
  width: fit-content;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 11px;
  font-weight: ${theme.font.weight.bold};
  background-color: ${theme.color.secondaryBlue[50]};
  color: ${theme.color.secondaryBlue[700]};
`;

export const HistoryCard = styled.div`
  background: ${theme.color.primitives.allWhite};
  border-radius: 12px;
  border: 1px solid ${theme.color.neutralBlue[300]};
  box-shadow: ${theme.box_shadow.default};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const HistoryCardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const HistoryCardActions = styled.div`
  display: flex;
  gap: 8px;
`;

export const HistoryCategoryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
`;

export const HistoryCategoryItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const HistoryCategoryTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.color.neutralBlue[1000]};
`;

export const HistoryCategoryComment = styled.p`
  font-size: 13px;
  color: ${theme.color.neutralBlue[700]};
  margin: 0;
  white-space: pre-wrap;
`;

export const ObservationsBox = styled.p`
  font-size: 13px;
  color: ${theme.color.neutralBlue[700]};
  background-color: ${theme.color.neutralBlue[200]};
  border-radius: 8px;
  padding: 12px;
  margin: 0;
  white-space: pre-wrap;
`;

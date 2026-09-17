import styled from "styled-components";
import { theme } from "../../../styles/Theme.constants";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  gap: 28px;
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

export const ControlsContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
`;

export const KpiGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 20px;
  width: 100%;
`;

export const KpiCard = styled.div`
  background: ${theme.color.primitives.allWhite};
  border-radius: 12px;
  border: 1px solid ${theme.color.neutralBlue[300]};
  box-shadow: ${theme.box_shadow.default};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const KpiLabel = styled.span`
  font-size: 12px;
  font-weight: ${theme.font.weight.semibold};
  color: ${theme.color.neutralBlue[600]};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const KpiValue = styled.span`
  font-size: 24px;
  font-weight: ${theme.font.weight.bold};
  color: ${theme.color.neutralBlue[1000]};
`;

export const KpiSubtext = styled.span<{ trend?: "up" | "down" | "neutral" }>`
  font-size: 12px;
  font-weight: ${theme.font.weight.medium};
  color: ${props => 
    props.trend === "up" ? theme.color.success[800] : 
      props.trend === "down" ? theme.color.error[800] : 
        theme.color.neutralBlue[600]};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const MainContentGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 28px;

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
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

export const SectionTitle = styled.h2`
  font-family: ${theme.font.family.title}, sans-serif;
  font-size: 18px;
  font-weight: ${theme.font.weight.bold};
  color: ${theme.color.neutralBlue[1000]};
  margin: 0;
`;

export const StatsTable = styled.table`
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
  cursor: pointer;
  user-select: none;
  transition: background-color 0.2s ease, color 0.2s ease;

  &:hover {
    background-color: ${theme.color.neutralBlue[200]};
    color: ${theme.color.neutralBlue[1000]};
  }
`;

export const Td = styled.td`
  padding: 12px 8px;
  border-bottom: 1px solid ${theme.color.neutralBlue[300]};
  color: ${theme.color.neutralBlue[900]};
`;

export const Badge = styled.span<{ variant?: string }>`
  font-size: 11px;
  font-weight: ${theme.font.weight.bold};
  padding: 2px 6px;
  border-radius: 4px;
  background-color: ${props => 
    props.variant === "Stock" ? theme.color.highlight[100] : 
      props.variant === "FII" ? theme.color.secondaryBlue[50] :
        theme.color.neutralBlue[300]};
  color: ${props => 
    props.variant === "Stock" ? theme.color.highlight[700] : 
      props.variant === "FII" ? theme.color.secondaryBlue[700] :
        theme.color.neutralBlue[800]};
`;

export const ProgressWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const ProgressLabelRow = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 13px;
`;

export const ProgressBarContainer = styled.div`
  width: 100%;
  height: 8px;
  background-color: ${theme.color.neutralBlue[300]};
  border-radius: 4px;
  overflow: hidden;
`;

export const ProgressBarFill = styled.div<{ width: number }>`
  width: ${props => props.width}%;
  height: 100%;
  background-color: ${theme.color.highlight[700]};
  border-radius: 4px;
  transition: width 0.3s ease;
`;

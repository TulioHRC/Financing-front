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

export const Button = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  background-color: ${theme.color.highlight[700]};
  color: ${theme.color.primitives.allWhite};
  font-weight: ${theme.font.weight.semibold};
  font-size: 14px;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: ${theme.box_shadow.default};
  transition: all 0.2s ease;

  &:hover {
    background-color: ${theme.color.highlight[800]};
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

export const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(650px, 1fr));
  gap: 24px;
`;

export const CategoryCard = styled.div`
  background: ${theme.color.primitives.allWhite};
  border-radius: 12px;
  border: 1px solid ${theme.color.neutralBlue[300]};
  box-shadow: ${theme.box_shadow.default};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const CategoryTitle = styled.h2`
  font-family: ${theme.font.family.title}, sans-serif;
  font-size: 18px;
  font-weight: ${theme.font.weight.bold};
  color: ${theme.color.neutralBlue[900]};
  border-bottom: 2px solid ${theme.color.highlight[100]};
  padding-bottom: 8px;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

export const InvestmentList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
`;

export const PriceRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  background-color: ${theme.color.neutralBlue[200]};
  border-radius: 8px;
  border: 1px solid ${theme.color.neutralBlue[300]};
  transition: all 0.2s ease;

  &:hover {
    border-color: ${theme.color.highlight[600]};
    background-color: ${theme.color.neutralBlue[100]};
  }
`;

export const InvestmentName = styled.span`
  font-size: 14px;
  font-weight: ${theme.font.weight.medium};
  color: ${theme.color.neutralBlue[800]};
`;

export const ValueActionContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const PriceValue = styled.span<{ hasValue: boolean }>`
  font-size: 14px;
  font-weight: ${theme.font.weight.bold};
  color: ${props => props.hasValue ? theme.color.neutralBlue[900] : theme.color.error[700]};
  background-color: ${props => props.hasValue ? theme.color.neutralBlue[300] : theme.color.error[100]};
  padding: 4px 8px;
  border-radius: 6px;
`;

export const ActionButton = styled.button<{ variant?: "primary" | "secondary" }>`
  background-color: ${props => props.variant === "primary" ? theme.color.highlight[700] : "transparent"};
  color: ${props => props.variant === "primary" ? theme.color.primitives.allWhite : theme.color.highlight[700]};
  border: ${props => props.variant === "primary" ? "none" : `1px solid ${theme.color.highlight[700]}`};
  padding: 6px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: ${theme.font.weight.semibold};
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${props => props.variant === "primary" ? theme.color.highlight[800] : theme.color.highlight[100]};
  }
`;

export const EditForm = styled.form`
  display: flex;
  align-items: center;
  gap: 8px;
  width: 100%;
`;

export const PriceInput = styled.input`
  flex: 1;
  min-width: 80px;
  padding: 6px 10px;
  font-size: 14px;
  border: 1px solid ${theme.color.neutralBlue[400]};
  border-radius: 6px;
  outline: none;
  font-family: inherit;

  &:focus {
    border-color: ${theme.color.highlight[700]};
    box-shadow: 0 0 0 2px ${theme.color.highlight[100]};
  }
`;
import styled from "styled-components";
import { theme } from "../../styles/Theme.constants";

const Wrapper = styled.span`
  position: relative;
  display: inline-flex;
  align-items: center;
`;

const IconButton = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background-color: ${theme.color.neutralBlue[500]};
  color: ${theme.color.primitives.allWhite};
  font-size: 11px;
  font-weight: bold;
  cursor: help;
  flex-shrink: 0;
`;

const Bubble = styled.div`
  position: absolute;
  bottom: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  width: 300px;
  max-width: 80vw;
  background-color: ${theme.color.neutralBlue[1000]};
  color: ${theme.color.primitives.allWhite};
  padding: 12px 14px;
  border-radius: 8px;
  font-size: 12px;
  font-weight: normal;
  line-height: 1.6;
  white-space: pre-wrap;
  text-align: left;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.15s ease;
  z-index: 30;
  box-shadow: ${theme.box_shadow.default};
  pointer-events: none;

  &::after {
    content: "";
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 6px solid transparent;
    border-top-color: ${theme.color.neutralBlue[1000]};
  }

  ${Wrapper}:hover &,
  ${Wrapper}:focus-within & {
    visibility: visible;
    opacity: 1;
  }
`;

interface TooltipProps {
  text: string;
}

const Tooltip: React.FC<TooltipProps> = ({ text }) => (
  <Wrapper tabIndex={0}>
    <IconButton>?</IconButton>
    <Bubble>{text}</Bubble>
  </Wrapper>
);

export default Tooltip;

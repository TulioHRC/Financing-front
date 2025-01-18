import styled from "styled-components";
import { theme } from "../../styles/Theme.constants";

interface SwitchProps {
  options: { value: string; text: string }[];
  selectedOption: string;
  setFunction: (value: any) => void;
  disabled?: boolean;
}

export const Switch = ({
  options,
  selectedOption,
  setFunction,
  disabled,
}: SwitchProps): JSX.Element => {
  return (
    <SwitchContainer>
      {options.map((option) => (
        <SwitchButton
          key={option.value}
          onClick={() => setFunction(option.value)}
          disabled={disabled}
          isselected={selectedOption === option.value ? 'true' : 'false'}
        >
          {option.text}
        </SwitchButton>
      ))}
    </SwitchContainer>
  );
};


const SwitchContainer = styled.div`
  height: 32px;
  border-radius: 8px;
  padding: 4px;
  background: ${theme.color.base[300]};

  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
`;

const SwitchButton = styled.button<{ isselected: 'true' | 'false' }>`
  flex: 1;
  padding: 4px 6px;
  text-align: center;
  background: ${({ isselected, disabled }) =>
    isselected === 'true' && !disabled ? theme.color.primitives.allWhite : "transparent"};
  border: solid 0.5px rgba(0, 0, 0, 0);
  border-radius: 8px;
  cursor: ${({ disabled }) => (disabled ? "initial" : "pointer")};
  color: ${({ isselected, disabled }) =>
    isselected === 'true' && !disabled
      ? theme.color.neutralBlue[1000]
      : theme.color.primaryNeutral[500]};
  font-size: 14px;
  font-family: ${theme.font.family.primary};
  font-weight: ${theme.font.weight.semibold};
  transition: background-color 0.3s ease;
  white-space: nowrap;
  ${({ isselected, disabled }) =>
    isselected === 'true' &&
    !disabled &&
    "box-shadow: 0px 1px 2px 0px #0000000f, 0px 1px 3px 0px #0000001a;"}
  transition: color 0.2s, background 0.2s, box-shadow 0.2s;

  &:hover {
    background: ${({ isselected, disabled }) =>
      isselected === 'true' || disabled ? undefined : theme.color.primaryNeutral[50]};
  }
`;

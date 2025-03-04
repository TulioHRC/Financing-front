import styled, { keyframes } from 'styled-components';

export const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 20px;
  justify-content: center;
  align-items: center;
`;

const focusAnimation = keyframes`
  0% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 123, 255, 0);
  }
  50% {
    transform: scale(1.02);
    box-shadow: 0 0 10px rgba(0, 123, 255, 0.3);
  }
  100% {
    transform: scale(1);
    box-shadow: 0 0 0 rgba(0, 123, 255, 0);
  }
`;

export const InputContainer = styled.div`
  position: relative;
  margin: 20px 0;
`;

export const StyledInput = styled.input`
  width: 100%;
  padding: 12px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  outline: none;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  &:focus {
    border-color: #007bff;
    animation: ${focusAnimation} 0.5s ease;
  }

  &:focus + label, &:not(:placeholder-shown) + label {
    top: -10px;
    left: 10px;
    font-size: 12px;
    color: #007bff;
    background-color: white;
    padding: 0 5px;
  }
`;

export const Label = styled.label`
  position: absolute;
  top: 12px;
  left: 12px;
  font-size: 16px;
  color: #999;
  pointer-events: none;
  transition: all 0.3s ease;
`;

export const OptionContainer = styled.div`
  display: flex;
  gap: 10px;
  margin: 20px 0;
`;

export const OptionButton = styled.button`
  padding: 12px 20px;
  font-size: 16px;
  border: 2px solid #ccc;
  border-radius: 8px;
  background-color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  outline: none;

  &:hover {
    border-color: #007bff;
    background-color: #f0f8ff;
  }

  &.active {
    border-color: #007bff;
    background-color: #007bff;
    color: white;
  }
`;

export const SubmitButton = styled.button`
  background-color: #4caf50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  margin-top: 20px;

  &:hover {
    background-color: #45a049;
  }
`;

export const ColumnsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;
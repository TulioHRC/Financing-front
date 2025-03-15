import styled, { keyframes } from "styled-components";

export const DividendsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: 25px 0px;
  gap: 20px;
`;

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

export const Spinner = styled.div`
  border: 3px solid #f3f3f3; /* Light grey */
  border-top: 3px solid #3498db; /* Blue */
  border-radius: 50%;
  width: 20px;
  height: 20px;
  animation: ${spin} 1s linear infinite;
`;

export const UploadButton = styled.button`
  position: relative;
  padding: 0.5rem 1rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;

  &:disabled {
    background-color: #cccccc;
    cursor: not-allowed;
  }

  .spinner {
    border: 3px solid #f3f3f3;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    animation: ${spin} 1s linear infinite;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;

interface AlertProps {
  type: 'success' | 'error';
}

export const Alert = styled.div<AlertProps>`
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
  font-size: 1rem;
  font-weight: 500;
  text-align: center;
  color: ${({ type }) => (type === 'success' ? '#155724' : '#721c24')};
  background-color: ${({ type }) => (type === 'success' ? '#d4edda' : '#f8d7da')};
  border: 1px solid ${({ type }) => (type === 'success' ? '#c3e6cb' : '#f5c6cb')};
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: inherit;
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0;
  margin-left: 1rem;

  &:hover {
    opacity: 0.8;
  }
`;
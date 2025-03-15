import styled from "styled-components";

export const DividendsContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  align-items: center;
  padding: 25px 0px;
  gap: 20px;
`;

export const UploadButton = styled.label`
  display: inline-block;
  padding: 10px 20px;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s ease;
  width: 400px;

  &:hover {
    background-color: #0056b3;
  }
`;

export const HiddenInput = styled.input`
  display: none;
`;
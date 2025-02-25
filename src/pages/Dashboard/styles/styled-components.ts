import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
  padding: 20px;
`;

export const SwitchContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

export const ChartsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
  justify-content: center;
  align-items: center;
`;

export const PortifolioContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
`;

export const HeaderContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 50px;
  justify-content: center;
  align-items: center;
  padding: 20px;
  background-color: #f8f9fa; /* Fundo claro para o header */
  border-bottom: 1px solid #e0e0e0; /* Linha sutil na parte inferior */
`;

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
  width: 300px;
  height: 120px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1); /* Sombra mais pronunciada */
  transition: transform 0.2s, box-shadow 0.2s; /* Efeito de hover suave */

  &:hover {
    transform: translateY(-5px); /* Levanta o box levemente ao passar o mouse */
    box-shadow: 0px 6px 16px rgba(0, 0, 0, 0.15); /* Sombra mais intensa no hover */
  }

  p {
    font-size: 14px;
    color: #666; /* Cor mais suave para o texto */
    margin: 0;
  }

  h3 {
    font-size: 24px;
    color: #333; /* Cor mais escura para o valor */
    margin: 0;
  }

  div {
    display: flex;
    align-items: center;
    gap: 8px; /* Espaçamento entre o valor e a porcentagem */
  }

  span {
    font-size: 14px;
    font-weight: bold;
  }
`;
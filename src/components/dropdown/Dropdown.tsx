import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #333;
  border-radius: 10px;
  flex-grow: 1;
  cursor: pointer;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease;

  &:hover {
    background-color: #444;
  }
`;

const DropdownHeader = styled.div`
  font-weight: bold;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
`;

const DropdownDetails = styled.div`
  background-color: #444;
  padding: 10px 0;
  border-radius: 0 0 10px 10px;
  display: flex;
  flex-direction: column;
  opacity: 0;
  visibility: hidden;
  max-height: 0;
  overflow-y: auto;
  transition: opacity 0.5s, visibility 0.3s, max-height 0.5s ease-in-out;

  max-height: 500px;

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: #333;
    border-radius: 10px;
  }

  ::-webkit-scrollbar-thumb {
    background-color: #888;
    border-radius: 10px;
    border: 2px solid #444;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: #555;
  }

  scrollbar-width: thin;
  scrollbar-color: #888 #333;
`;


const DropdownItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 20px;
  border-bottom: 1px solid #555;
  font-size: 14px;
  color: #fff;
  transition: background-color 0.3s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    background-color: #555;
    cursor: pointer;
  }

  .item-column {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;

    label {
      margin: 4px 0;
      color: #bbb;
    }

    label:nth-child(1) {
      font-weight: normal;
    }

    label:nth-child(2),
    label:nth-child(3) {
      font-weight: bold;
    }
  }
`;

const Icon = styled.i`
  font-size: 18px;
  color: #fff;
`;

interface ItemDTO {
  label: string;
  quantity: number;
  averagePrice: number;
  actualPrice: number | null;
}

export interface PortfolioDTO {
  [key: string]: ItemDTO[];
}

interface DropdownProps {
  name: string;
  items: ItemDTO[];
}

export const Dropdown: React.FC<DropdownProps> = ({ name, items }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <DropdownContainer onClick={() => setIsOpen(!isOpen)}>
      <DropdownHeader>
        <p>{name}</p>
        <div>
          <Icon className={isOpen ? "fas fa-angle-up" : "fas fa-angle-down"} />
        </div>
      </DropdownHeader>
      <DropdownDetails
        style={{
          opacity: isOpen ? 1 : 0,
          visibility: isOpen ? "visible" : "hidden",
          maxHeight: isOpen ? "500px" : "0", // Aplica a transição
        }}
      >
        {items.map((item) => (
          <DropdownItem key={item.label}>
            <div className="item-column">
              <label>{item.label}</label>
            </div>
            <div className="item-column">
              <label>Quantity</label>
              <label>{item.quantity}</label>
            </div>
            <div className="item-column">
              <label>Avg Price</label>
              <label>{item.averagePrice.toFixed(2)}</label>
            </div>
            <div className="item-column">
              <label>Actual Price</label>
              <label>{item.actualPrice ?? "N/A"}</label>
            </div>
          </DropdownItem>
        ))}
      </DropdownDetails>
    </DropdownContainer>
  );
};

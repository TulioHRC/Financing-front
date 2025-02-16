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
  allocatedPercentage: number;
  actualPrice: number | null;
  actualPercentage: number;
}

export interface PortfolioDTO {
  [key: string]: ItemDTO[];
}

interface DropdownProps {
  name: string;
  items: ItemDTO[];
  currency: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ name, items, currency }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatCurrency = (value: number, currency: string) => {
    const formatter = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 8, // Adjust for BTC which can have up to 8 decimal places
    });

    return formatter.format(value);
  };

  const calculateGrowthPercentage = (averagePrice: number, actualPrice: number | null) => {
    if (!actualPrice) return null;
    return ((actualPrice - averagePrice) / averagePrice) * 100;
  };

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
          maxHeight: isOpen ? "500px" : "0",
        }}
      >
        {items.map((item) => {
          const growthPercentage = calculateGrowthPercentage(item.averagePrice, item.actualPrice);
          const isProfit = growthPercentage !== null && growthPercentage > 0;
          const isLoss = growthPercentage !== null && growthPercentage < 0;

          return (
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
                <label>{formatCurrency(item.averagePrice, currency)}</label>
              </div>
              <div className="item-column">
                <label>Total Invested</label>
                <label>{formatCurrency(item.averagePrice * item.quantity, currency)}</label>
              </div>
              <div className="item-column">
                <label>Actual Price</label>
                <label>
                  {item.actualPrice ? formatCurrency(item.actualPrice, currency) : "N/A"}
                  {growthPercentage !== null && (
                    <Icon
                      className={`fas ${
                        isProfit ? "fa-arrow-up" : isLoss ? "fa-arrow-down" : ""
                      }`}
                      style={{
                        color: isProfit ? "#4CAF50" : isLoss ? "#F44336" : "inherit",
                        marginLeft: "8px",
                      }}
                    />
                  )}
                </label>
              </div>
              <div className="item-column">
                <label>Invested allocation</label>
                <label>{item.allocatedPercentage.toFixed(1)} %</label>
              </div>
              <div className="item-column">
                <label>Total</label>
                <label>
                  {item.actualPrice ? formatCurrency(item.actualPrice * item.quantity, currency) : "N/A"}
                  {growthPercentage !== null && (
                    <span
                      style={{
                        color: isProfit ? "#4CAF50" : isLoss ? "#F44336" : "inherit",
                        marginLeft: "8px",
                        fontSize: "12px",
                      }}
                    >
                      ({growthPercentage.toFixed(2)}%)
                    </span>
                  )}
                </label>
              </div>
              <div className="item-column">
                <label>Actual allocation</label>
                <label>{item.actualPercentage.toFixed(1)} %</label>
              </div>
            </DropdownItem>
          );
        })}
      </DropdownDetails>
    </DropdownContainer>
  );
};
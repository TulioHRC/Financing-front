import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  width: 100%;
  padding: 10px;
  background-color: #adadad;
  border-radius: 10px;
  flex-grow: 1;
  cursor: pointer;
`;

const DropdownHeader = styled.div`
  font-weight: bold;
  color: #fff;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

const Icon = styled.i`
  font-size: 18px;
  color: #fff;
`;

interface DropdownProps {
  name: string;
  items: { label: string, value: string | number }[];
};

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
      {isOpen && (
        <div>
          {items.map((item) => (
            <div key={item.label}>
              <label>{item.label}</label>
            </div>
          ))}
        </div>
      )}
    </DropdownContainer>
  );
};

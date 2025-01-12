import React from "react";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 200px;
  height: 100vh;
  background-color: #f4f4f4;
  box-shadow: 2px 0 5px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
`;

const SidebarItems = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 10px 0;
`;

const SidebarFooter = styled.div`
  padding: 10px;
  text-align: center;
  font-size: 0.9rem;
  background-color: #f8f9fa;
  color: #6c757d;
`;

const SidebarItem = styled.a`
  text-decoration: none;
  color: #333;
  padding: 10px;
  width: 100%;
  border: 1px solid black;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #e9ecef;
  }
  &:active {
      background-color: #dee2e6;
    }
  }
  &:focus {
      outline: none;
    }
  }
`;

interface SidebarProps {
  items: { label: string; link: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => {
  return (
    <SidebarContainer>
      <SidebarItems>
        {items.map((item, index) => (
          <SidebarItem
            key={index}
            href={item.link}
            onMouseEnter={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "#e9ecef";
            }}
            onMouseLeave={(e) => {
              (e.target as HTMLElement).style.backgroundColor = "transparent";
            }}
          >
            {item.label}
          </SidebarItem>
        ))}
      </SidebarItems>
      <SidebarFooter>© Oilut, 2025</SidebarFooter>
    </SidebarContainer>
  );
};
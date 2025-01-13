import React from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";

const SidebarContainer = styled.div`
  width: 250px;
  height: 100vh;
  background-color: #fff;
  border-right: 1px solid #ddd;
`;

const SidebarList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const SidebarItem = styled.li`
  margin: 0;
  padding: 10px;
  border-bottom: 1px solid #eee;

  a {
    text-decoration: none;
    color: #333;
    padding: 10px;
    display: block;

    &:hover {
      background-color: #f0f2f5;
    }
  }

  .active {
    font-weight: bold;
    color: #007bff;
    background-color: #e9f5ff;
    border-left: 4px solid #007bff;
  }
`;

interface SidebarProps {
  items: { label: string; link: string }[];
}

export const Sidebar: React.FC<SidebarProps> = ({ items }) => (
  <SidebarContainer>
    <SidebarList>
      {items.map((item) => (
        <SidebarItem key={item.link}>
          <NavLink 
            to={item.link} 
            className={({ isActive }) => (isActive ? "active" : "")}
          >
            {item.label}
          </NavLink>
        </SidebarItem>
      ))}
    </SidebarList>
  </SidebarContainer>
);

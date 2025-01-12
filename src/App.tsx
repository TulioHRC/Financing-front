import React from "react";
import { Sidebar } from "./components/sidebar/Sidebar";
import styled from "styled-components";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  margin: 0;
  background-color: #f0f2f5;
`;

const App: React.FC = () => {
  const menuItems = [
    { label: "Dashboard", link: "/dashboard" },
  ];

  return (
    <AppContainer>
      <Sidebar items={menuItems} />
      <div style={{ flex: 1, padding: "20px" }}>
        <h1>Hello World!</h1>
      </div>
    </AppContainer>
  );
};

export default App;

import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";

const AppContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  margin: 0;
  background-color: #f0f2f5;
`;

const App: React.FC = () => {
  const menuItems = [
    { label: "Dashboard", link: "/" },
    { label: "Stats", link: "/stats" },
  ];

  return (
    <Router>
      <AppContainer>
        <Sidebar items={menuItems} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/stats" element={<div>Hi</div>} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;

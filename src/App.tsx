import React from "react";
import styled from "styled-components";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Sidebar } from "./components/sidebar/Sidebar";
import Dashboard from "./pages/Dashboard/Dashboard";
import Data from "./pages/Data/Data";
import '@fortawesome/fontawesome-free/css/all.min.css';
import AddForm from "./pages/AddForm/AddForm";
import Investiments from "./pages/Investiments/Investiments";
import InvestimentsOperations from "./pages/InvestimentsOperations/InvestimentsOperations";
import Currencies from "./pages/Currencies/Currencies";
import CurrenciesOperations from "./pages/CurrenciesOperations/CurrenciesOperations";

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
    { label: "Investiments", link: "/investiments" },
    { label: "Operations", link: "/investiments-operations" },
    { label: "Currencies", link: "/currencies" },
    { label: "Currencies Operations", link: "/currencies-operations" },
    { label: "Stats", link: "/stats" },
    { label: "Data", link: "/data" },
    { label: "Add", link: "/add-form" },
  ];

  return (
    <Router>
      <AppContainer>
        <Sidebar items={menuItems} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/investiments" element={<Investiments />} />
          <Route path="/investiments-operations" element={<InvestimentsOperations />} />
          <Route path="/currencies" element={<Currencies />} />
          <Route path="/currencies-operations" element={<CurrenciesOperations />} />
          <Route path="/stats" element={<div>Hi</div>} />
          <Route path="/data" element={<Data />} />
          <Route path="/add-form" element={<AddForm />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;

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
import Dividends from "./pages/Dividends/Dividends";
import Stats from "./pages/Stats/Stats";
import Watchlist from "./pages/Watchlist/Watchlist";
import AssetAnalysisForm from "./pages/Watchlist/AssetAnalysisForm";
import WatchlistDetail from "./pages/Watchlist/WatchlistDetail";
import WatchlistCompare from "./pages/Watchlist/WatchlistCompare";

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
    { label: "Dividends", link: "/dividends" },
    { label: "Currencies", link: "/currencies" },
    { label: "Currencies Operations", link: "/currencies-operations" },
    { label: "Stats", link: "/stats" },
    { label: "Watchlist", link: "/watchlist" },
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
          <Route path="/dividends" element={<Dividends />} />
          <Route path="/currencies" element={<Currencies />} />
          <Route path="/currencies-operations" element={<CurrenciesOperations />} />
          <Route path="/stats" element={<Stats />} />
          <Route path="/data" element={<Data />} />
          <Route path="/add-form" element={<AddForm />} />
          <Route path="/watchlist" element={<Watchlist />} />
          <Route path="/watchlist/new" element={<AssetAnalysisForm />} />
          <Route path="/watchlist/compare" element={<WatchlistCompare />} />
          <Route path="/watchlist/:assetId/analyses/new" element={<AssetAnalysisForm />} />
          <Route path="/watchlist/:assetId/analyses/:analysisId/edit" element={<AssetAnalysisForm />} />
          <Route path="/watchlist/:assetId" element={<WatchlistDetail />} />
        </Routes>
      </AppContainer>
    </Router>
  );
};

export default App;

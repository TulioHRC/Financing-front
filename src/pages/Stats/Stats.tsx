import React, { useState } from "react";
import { useDashboardData } from "../../hooks/useDashboardData";
import { formatCurrency } from "../../components/dropdown/Dropdown";
import { Switch } from "../../components/switch/Switch";
import PieChartComponent from "../../components/charts/PieChartComponent";
import {
  Container,
  HeaderSection,
  TitleContainer,
  Title,
  Subtitle,
  ControlsContainer,
  KpiGrid,
  KpiCard,
  KpiLabel,
  KpiValue,
  KpiSubtext,
  MainContentGrid,
  SectionCard,
  SectionTitle,
  StatsTable,
  Th,
  Td,
  Badge,
  ProgressWrapper,
  ProgressLabelRow,
  ProgressBarContainer,
  ProgressBarFill,
} from "./styles/styled-components";

const Stats: React.FC = () => {
  const [currency, setCurrency] = useState<string>(import.meta.env.VITE_MAIN_CURRENCY_ID);
  const { portfilioData, isLoading } = useDashboardData({ id: currency });

  const [sortKey, setSortKey] = useState<"name" | "type" | "cost" | "current" | "gain" | "roi">("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  if (isLoading || portfilioData === null) {
    return (
      <Container style={{ justifyContent: "center", alignItems: "center", height: "80vh" }}>
        <Subtitle>Loading portfolio statistics...</Subtitle>
      </Container>
    );
  }

  const activeCurrency = portfilioData.currencies.find((c) => c.id === currency);
  const currencyName = activeCurrency?.name || "BRL";

  // Calculations
  let investedTotal = 0;
  let currentTotal = 0;
  let bestPerformer = { name: "N/A", roi: -9999 };
  let worstPerformer = { name: "N/A", roi: 9999 };
  const segmentAllocationMap: { [segment: string]: number } = {};

  const activeInvestments = portfilioData.investiments.filter((inv) => inv.quantity > 0);

  activeInvestments.forEach((inv) => {
    const cost = inv.quantity * inv.average_price * inv.quotation;
    const current = inv.quantity * (inv.actual_price ?? 0) * inv.quotation;

    investedTotal += cost;
    currentTotal += current;

    if (cost > 0) {
      const roi = ((current - cost) / cost) * 100;
      if (roi > bestPerformer.roi) {
        bestPerformer = { name: inv.name, roi };
      }
      if (roi < worstPerformer.roi) {
        worstPerformer = { name: inv.name, roi };
      }
    }

    // Segment tracking
    const segment = inv.segment || "Other";
    segmentAllocationMap[segment] = (segmentAllocationMap[segment] || 0) + current;
  });

  // Include currencies in current and invested values
  portfilioData.currencies_investiments.forEach((cInv) => {
    if (cInv.quantity > 0) {
      const remainingRatio = (cInv.quantity - cInv.used_quantity) / cInv.quantity;
      const cost = remainingRatio * cInv.price;
      const current = (cInv.quantity - cInv.used_quantity) * cInv.quotation;

      investedTotal += cost;
      currentTotal += current;

      segmentAllocationMap["Cash"] = (segmentAllocationMap["Cash"] || 0) + current;
    }
  });

  const profitLoss = currentTotal - investedTotal;
  const totalRoi = investedTotal > 0 ? (profitLoss / investedTotal) * 100 : 0;

  // Format segment allocation for Chart
  const segmentChartData = Object.entries(segmentAllocationMap)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Top Holdings by current value
  const topHoldings = [...activeInvestments]
    .map((inv) => ({
      name: inv.name,
      value: inv.quantity * (inv.actual_price ?? 0) * inv.quotation,
      type: inv.investiment_type,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);

  // Precompute and sort table breakdown
  const breakdownData = activeInvestments.map((inv) => {
    const cost = inv.quantity * inv.average_price * inv.quotation;
    const current = inv.quantity * (inv.actual_price ?? 0) * inv.quotation;
    const gain = current - cost;
    const roi = cost > 0 ? (gain / cost) * 100 : 0;
    return {
      id: inv.id,
      name: inv.name,
      type: inv.investiment_type,
      cost,
      current,
      gain,
      roi,
    };
  });

  const sortedBreakdown = [...breakdownData].sort((a, b) => {
    let comparison = 0;
    if (sortKey === "name" || sortKey === "type") {
      comparison = a[sortKey].localeCompare(b[sortKey]);
    } else {
      comparison = a[sortKey] - b[sortKey];
    }
    return sortOrder === "asc" ? comparison : -comparison;
  });

  const handleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  const renderSortIcon = (key: typeof sortKey) => {
    if (sortKey !== key) return null;
    return sortOrder === "asc" ? " ▲" : " ▼";
  };

  return (
    <Container>
      <HeaderSection>
        <TitleContainer>
          <Title>Portfolio Analytics</Title>
          <Subtitle>Detailed performance metrics, ROI tracking, and asset allocation stats</Subtitle>
        </TitleContainer>
        <ControlsContainer>
          <Switch
            options={portfilioData.currencies.map((c) => ({
              value: c.id,
              text: c.name,
            }))}
            selectedOption={currency}
            setFunction={setCurrency}
          />
        </ControlsContainer>
      </HeaderSection>

      <KpiGrid>
        <KpiCard>
          <KpiLabel>Net Profit / Loss</KpiLabel>
          <KpiValue>{formatCurrency(profitLoss, currencyName)}</KpiValue>
          <KpiSubtext trend={profitLoss > 0 ? "up" : profitLoss < 0 ? "down" : "neutral"}>
            <i className={`fa-solid ${profitLoss >= 0 ? "fa-circle-arrow-up" : "fa-circle-arrow-down"}`} />
            {totalRoi.toFixed(2)}% Return
          </KpiSubtext>
        </KpiCard>

        <KpiCard>
          <KpiLabel>Total Portfolio Value</KpiLabel>
          <KpiValue>{formatCurrency(currentTotal, currencyName)}</KpiValue>
          <KpiSubtext trend="neutral">
            Cost Basis: {formatCurrency(investedTotal, currencyName)}
          </KpiSubtext>
        </KpiCard>

        <KpiCard>
          <KpiLabel>Best Performing Asset</KpiLabel>
          <KpiValue>{bestPerformer.name}</KpiValue>
          <KpiSubtext trend={bestPerformer.roi > 0 ? "up" : "neutral"}>
            {bestPerformer.roi !== -9999 ? `+${bestPerformer.roi.toFixed(1)}%` : "N/A"}
          </KpiSubtext>
        </KpiCard>

        <KpiCard>
          <KpiLabel>Worst Performing Asset</KpiLabel>
          <KpiValue>{worstPerformer.name}</KpiValue>
          <KpiSubtext trend={worstPerformer.roi < 0 ? "down" : "neutral"}>
            {worstPerformer.roi !== 9999 ? `${worstPerformer.roi.toFixed(1)}%` : "N/A"}
          </KpiSubtext>
        </KpiCard>
      </KpiGrid>

      <MainContentGrid>
        <SectionCard>
          <SectionTitle>Asset Performance Breakdown</SectionTitle>
          <div style={{ overflowX: "auto" }}>
            <StatsTable>
              <thead>
                <tr>
                  <Th onClick={() => handleSort("name")}>Asset{renderSortIcon("name")}</Th>
                  <Th onClick={() => handleSort("type")}>Type{renderSortIcon("type")}</Th>
                  <Th onClick={() => handleSort("cost")}>Invested{renderSortIcon("cost")}</Th>
                  <Th onClick={() => handleSort("current")}>Current Value{renderSortIcon("current")}</Th>
                  <Th onClick={() => handleSort("gain")}>Profit / Loss{renderSortIcon("gain")}</Th>
                  <Th onClick={() => handleSort("roi")}>ROI{renderSortIcon("roi")}</Th>
                </tr>
              </thead>
              <tbody>
                {sortedBreakdown.map((row) => {
                  return (
                    <tr key={row.id}>
                      <Td style={{ fontWeight: "bold" }}>{row.name}</Td>
                      <Td><Badge variant={row.type}>{row.type}</Badge></Td>
                      <Td>{formatCurrency(row.cost, currencyName)}</Td>
                      <Td>{formatCurrency(row.current, currencyName)}</Td>
                      <Td style={{ color: row.gain >= 0 ? "#2A7E39" : "#F03E3E" }}>
                        {row.gain >= 0 ? "+" : ""}{formatCurrency(row.gain, currencyName)}
                      </Td>
                      <Td style={{ color: row.gain >= 0 ? "#2A7E39" : "#F03E3E", fontWeight: "bold" }}>
                        {row.gain >= 0 ? "+" : ""}{row.roi.toFixed(1)}%
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </StatsTable>
          </div>
        </SectionCard>

        <div style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
          <SectionCard>
            <SectionTitle>Top Holdings</SectionTitle>
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {topHoldings.map((holding) => {
                const percentage = currentTotal > 0 ? (holding.value / currentTotal) * 100 : 0;
                return (
                  <ProgressWrapper key={holding.name}>
                    <ProgressLabelRow>
                      <span style={{ fontWeight: "bold" }}>{holding.name}</span>
                      <span>{percentage.toFixed(1)}%</span>
                    </ProgressLabelRow>
                    <ProgressBarContainer>
                      <ProgressBarFill width={percentage} />
                    </ProgressBarContainer>
                  </ProgressWrapper>
                );
              })}
            </div>
          </SectionCard>

          <SectionCard>
            <PieChartComponent
              title="Allocation by Segment"
              data={segmentChartData}
              legendLayout="vertical"
              legendAlign="right"
              legendVerticalAlign="middle"
            />
          </SectionCard>
        </div>
      </MainContentGrid>
    </Container>
  );
};

export default Stats;

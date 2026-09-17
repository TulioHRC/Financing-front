import { describe, expect, it } from "vitest";
import { convertQuotation, getInvestimentOperations, getOldestInvestimentDate, nextMonthKey } from "./utils";
import { FinancingOperationsResponseDTO } from "../services/financing-server/operations/dto/financing-operations.get.response.dto";

describe("nextMonthKey", () => {
  it("advances within the same year", () => {
    expect(nextMonthKey("2024-05")).toBe("2024-06");
  });

  it("rolls over to the next year after December", () => {
    expect(nextMonthKey("2024-12")).toBe("2025-01");
  });

  it("zero-pads single-digit months", () => {
    expect(nextMonthKey("2024-01")).toBe("2024-02");
  });
});

describe("convertQuotation", () => {
  const currencies = [
    { id: "brl", quotation_in_BRL: 1 },
    { id: "usd", quotation_in_BRL: 5 },
  ];

  it("converts an amount from one currency to another", () => {
    expect(convertQuotation(currencies, "brl", "usd")).toBe(5);
    expect(convertQuotation(currencies, "usd", "brl")).toBe(0.2);
  });

  it("returns the same quotation when converting a currency to itself", () => {
    expect(convertQuotation(currencies, "usd", "usd")).toBe(1);
  });

  it("returns 0 instead of Infinity when the target currency is unknown", () => {
    expect(convertQuotation(currencies, "missing", "usd")).toBe(0);
  });

  it("returns 0 when the source currency is unknown", () => {
    expect(convertQuotation(currencies, "usd", "missing")).toBe(0);
  });
});

function makeOperation(overrides: Partial<FinancingOperationsResponseDTO[number]>): FinancingOperationsResponseDTO[number] {
  return {
    created_at: new Date(),
    updated_at: new Date(),
    deleted_at: null,
    id: "op-id",
    price: 0,
    investiment_id: "inv-1",
    quantity: 0,
    date: new Date(),
    ...overrides,
  };
}

describe("getInvestimentOperations", () => {
  it("computes total quantity and weighted average price for a single investment", () => {
    const operations = [
      makeOperation({ investiment_id: "inv-1", quantity: 10, price: 100 }),
      makeOperation({ investiment_id: "inv-1", quantity: 5, price: 130 }),
      makeOperation({ investiment_id: "inv-2", quantity: 999, price: 1 }),
    ];

    const result = getInvestimentOperations("inv-1", operations);

    expect(result.quantity).toBe(15);
    expect(result.averagePrice).toBeCloseTo((10 * 100 + 5 * 130) / 15);
  });
});

describe("getOldestInvestimentDate", () => {
  it("returns the earliest operation date", () => {
    const oldest = new Date("2022-01-01");
    const operations = [
      makeOperation({ date: new Date("2023-06-01") }),
      makeOperation({ date: oldest }),
      makeOperation({ date: new Date("2024-01-01") }),
    ];

    expect(getOldestInvestimentDate(operations)).toEqual(oldest);
  });
});

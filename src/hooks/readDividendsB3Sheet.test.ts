import { beforeEach, describe, expect, it, vi } from "vitest";

const { getMock, postMock } = vi.hoisted(() => ({
  getMock: vi.fn(),
  postMock: vi.fn(),
}));

vi.mock("../services/financing-server/financing-api", () => ({
  financingApi: {
    investiments: { get: getMock },
    dividends: { post: postMock },
  },
}));

import { readDividendsB3Sheet } from "./readDividendsB3Sheet";

const HEADER = ["Produto", "Pagamento", "Tipo de Evento", "Instituição", "Quantidade", "Preço unitário", "Valor líquido"];

beforeEach(() => {
  getMock.mockReset();
  postMock.mockReset();
  getMock.mockResolvedValue([{ id: "inv-1", name: "PETR4" }]);
  postMock.mockResolvedValue({});
});

describe("readDividendsB3Sheet", () => {
  it("rejects a sheet with the wrong header", () => {
    const data = [["Wrong", "Header"], ["PETR4", "05/01/2024", "", "", "10", 1, 10]];

    return expect(readDividendsB3Sheet(data)).rejects.toThrow("Isn't a B3 dividends sheet!");
  });

  it("rejects a sheet with no data rows", () => {
    return expect(readDividendsB3Sheet([HEADER])).rejects.toThrow("No rows found!");
  });

  it("parses single-digit day/month payment dates without producing an invalid date", async () => {
    const data = [HEADER, ["PETR4", "5/1/2024", "Dividendo", "", "10", 1, 10]];

    await readDividendsB3Sheet(data);

    expect(postMock).toHaveBeenCalledTimes(1);
    const body = postMock.mock.calls[0][0].body;
    expect(Number.isNaN(body.date.getTime())).toBe(false);
    expect(body.date.toISOString().slice(0, 10)).toBe("2024-01-05");
  });

  it("maps renamed B3 tickers to their current investment", async () => {
    getMock.mockResolvedValue([{ id: "inv-2", name: "ISAE4" }]);
    const data = [HEADER, ["TRPL4", "05/01/2024", "Dividendo", "", "10", 1, 10]];

    await readDividendsB3Sheet(data);

    expect(postMock.mock.calls[0][0].body.investiment_id).toBe("inv-2");
  });

  it("counts successes against the total number of named rows", async () => {
    const data = [
      HEADER,
      ["PETR4", "05/01/2024", "Dividendo", "", "10", 1, 10],
      ["PETR4", "05/02/2024", "Dividendo", "", "5", 1, 5],
    ];

    const { successCount, totalCount } = await readDividendsB3Sheet(data);

    expect(totalCount).toBe(2);
    expect(successCount).toBe(2);
  });
});

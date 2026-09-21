import { AnalysisCategory } from "./analysis-category";

// Condensed from docs/Financing/research/asset-analysis-factors.md
export const CATEGORY_GUIDANCE: Record<AnalysisCategory, string> = {
  PROFITABILITY:
    "A empresa converte receita em lucro de forma eficiente, e mantém isso ao longo do tempo?\n\n" +
    "• ROE e ROIC: compare com o setor, não isolado. ROIC bem abaixo do ROE indica retorno inflado por alavancagem.\n" +
    "• Margem líquida/EBITDA: a tendência importa mais que o valor único — expandindo é melhor sinal que alta mas em queda.\n" +
    "• Consistência entre trimestres pesa mais que um pico isolado.\n\n" +
    "FIIs: olhe vacância e cap rate. ETFs: pouco aplicável.",
  DEBT:
    "A empresa honra suas obrigações sem depender de refinanciamento em condições ruins?\n\n" +
    "• Liquidez corrente: acima de 1 é saudável, compare com o setor.\n" +
    "• Dívida líquida/EBITDA: <2x confortável, 2–3.5x moderado, >4x arriscado (varia por setor).\n" +
    "• Tempo para quitar a dívida e cobertura de juros.\n" +
    "• Perfil de vencimento: concentrado no curto prazo é mais arriscado.\n\n" +
    "FIIs: alavancagem costuma ser baixa/regulada.",
  GROWTH:
    "O crescimento é real, sustentável e de qualidade — não só um pico pontual?\n\n" +
    "• CAGR de receita e lucro (3–5 anos).\n" +
    "• Orgânico vs. via aquisições — aquisições distorcem a leitura de eficiência.\n" +
    "• Pipeline/projetos contratados (relevante em infraestrutura e utilities).\n\n" +
    "FIIs: crescimento de aluguéis e aquisições. ETFs: crescimento de patrimônio (AUM).",
  GOVERNANCE:
    "Quem manda na empresa, e os interesses estão alinhados com o acionista minoritário?\n\n" +
    "• Concentração acionária e % de free float.\n" +
    "• Nível de listagem na B3 (Novo Mercado, Nível 2…).\n" +
    "• Histórico da administração: trocas frequentes, controvérsias, litígios.\n" +
    "• Alocação de capital: recompras e dividendos consistentes vs. M&A que destrói valor.\n" +
    "• Sinais de alerta: transações com partes relacionadas, reapresentação de balanços.\n\n" +
    "FIIs: reputação da gestora e conflitos de interesse.\n" +
    "Categoria mais qualitativa — texto sem indicador numérico é normal aqui.",
  PRICE:
    "O preço atual compensa o risco, comparado ao histórico do ativo e aos pares?\n\n" +
    "• P/L: compare com a média histórica do próprio ativo e pares (muito baixo nem sempre é barganha).\n" +
    "• EV/EBIT: neutro à estrutura de capital, melhor que P/L entre empresas com alavancagens diferentes.\n" +
    "• P/VP: essencial em FIIs e bancos.\n" +
    "• Preço atual vs. máxima/mínima histórica.\n" +
    "• Dividend yield como contracheque — yield muito alto pode ser risco precificado, não oportunidade.\n\n" +
    "ETFs: o que importa é prêmio/desconto sobre o NAV.",
  DIVIDENDS:
    "Os proventos são sustentáveis, ou estão comendo caixa/patrimônio da empresa?\n\n" +
    "• Dividend yield (últimos 12 meses e estimativa futura).\n" +
    "• Payout ratio: sustentável quando vem de caixa livre, não de dívida.\n" +
    "• Consistência e frequência — já cortou dividendo em crise?\n" +
    "• Tendência de crescimento dos proventos.\n\n" +
    "FIIs: veja se a distribuição inclui amortização de capital (devolução de patrimônio), não só aluguel.",
};

export const CATEGORY_INDICATOR_SUGGESTIONS: Record<AnalysisCategory, { name: string; unit: string }[]> = {
  PROFITABILITY: [
    { name: "ROE", unit: "%" },
    { name: "ROIC", unit: "%" },
    { name: "Margem líquida", unit: "%" },
    { name: "Margem EBITDA", unit: "%" },
  ],
  DEBT: [
    { name: "Liquidez corrente", unit: "x" },
    { name: "Dívida líquida/EBITDA", unit: "x" },
    { name: "Tempo para quitar dívida", unit: "anos" },
    { name: "Cobertura de juros", unit: "x" },
  ],
  GROWTH: [
    { name: "CAGR receita 5a", unit: "%" },
    { name: "CAGR lucro 5a", unit: "%" },
  ],
  GOVERNANCE: [{ name: "Free float", unit: "%" }],
  PRICE: [
    { name: "P/L", unit: "x" },
    { name: "EV/EBIT", unit: "x" },
    { name: "P/VP", unit: "x" },
    { name: "Preço vs. máxima histórica", unit: "%" },
  ],
  DIVIDENDS: [
    { name: "Dividend yield", unit: "%" },
    { name: "Payout ratio", unit: "%" },
  ],
};

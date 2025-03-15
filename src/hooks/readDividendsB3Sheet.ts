import { FinancingApi } from "../services/financing-server/financing-api";

export const readDividendsB3Sheet = async (data: (string | number)[][]) => {
  const financingApi = new FinancingApi();

  const investiments = await financingApi.investiments.get({});
  const investimentByName : {[name: string] : string} = {};
  investiments.forEach((inv) => investimentByName[inv.name] = inv.id);

  for (const dividend of data.slice(1)) {
    if (
      typeof dividend[0] !== 'string' ||
      typeof dividend[1] !== 'string' ||
      typeof dividend[4] !== 'string' ||
      typeof dividend[5] === 'string' ||
      typeof dividend[6] === 'string'
    ) {
      continue;
    }
    const quantity = parseInt(dividend[4]);

    const [dia, mes, ano] = dividend[1].split('/');
    const date = new Date(`${ano}-${mes}-${dia}`);

    const body = {
      investiment_id: investimentByName[dividend[0].split(' ')[0]],
      date,
      value: dividend[5],
      value_after_fees: dividend[6] / quantity,
      investiment_quantity: quantity,
    };

    // TODO: alerts
    await financingApi.dividends.post({
      body
    })
  }
}
import { FinancingApi } from "../services/financing-server/financing-api";

const b3NamesChanged: {[key: string]: string} = {
  'TRPL4': 'ISAE4',
  'MXRF14': 'MXRF11',
  'MXRF13': 'MXRF11',
};

export const readDividendsB3Sheet = async (data: (string | number)[][]) => {
  const financingApi = new FinancingApi();

  const investiments = await financingApi.investiments.get({});
  const investimentByName: { [name: string]: string } = {};
  investiments.forEach((inv) => investimentByName[inv.name] = inv.id);

  let successCount = 0;
  const totalCount = data.reduce((acc, actualRow) => typeof actualRow[0] === "string" && actualRow[0] !== "" ? acc + 1 : acc, 0) - 1;

  if (data.length <= 1) {
    throw new Error('No rows found!');
  }

  if (
    data[0][0] !== "Produto" ||
    data[0][1] !== "Pagamento" ||
    data[0][2] !== "Tipo de Evento" ||
    data[0][3] !== "Instituição" ||
    data[0][4] !== "Quantidade" ||
    data[0][5] !== "Preço unitário" ||
    data[0][6] !== "Valor líquido" ||
    data[0].length !== 7
  ) {
    throw new Error('Isn\'t a B3 dividends sheet!');
  }

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

    let name = dividend[0].split(' ')[0];
    if (b3NamesChanged[name]) name = b3NamesChanged[name];

    const body = {
      investiment_id: investimentByName[name],
      date,
      value: dividend[5],
      value_after_fees: dividend[6] / quantity,
      investiment_quantity: quantity,
    };

    try {
      await financingApi.dividends.post({
        body
      });
      successCount++;
    } catch (error) {
      console.log(body)
      console.error(`Failed to post dividend: ${error}`);
    }
  }

  return { successCount, totalCount };
}
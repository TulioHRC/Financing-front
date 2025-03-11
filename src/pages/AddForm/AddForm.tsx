import { useState } from "react";
import { FormContainer, InputContainer, Label, StyledInput, OptionContainer, OptionButton, SubmitButton, ColumnsContainer } from "./styles/styled-components";
import { useAddFormData } from "../../hooks/useAddFormData";
import { FinancingApi } from "../../services/financing-server/financing-api";

const defaultInvestimentFieldsValue = {
  type: '',
  name: '',
  currency_name: '',
  currency_id: '',
  quantity: 0,
  paidPrice: 0,
};

const defaultCurrencyFieldsValue = {
  price: 0,
  bought_currency_name: '',
  bought_currency_id: '',
  selled_currency_name: '',
  selled_currency_id: '',
  quantity: 0,
}

const AddForm: React.FC = () => {
  const { data, isLoading, refetch } = useAddFormData();
  const [type, setType] = useState<string | null>(null);
  const [investimentFields, setInvestimentFields] = useState<{
    type: string,
    name: string,
    id?: string,
    segment?: string,
    currency_name: string,
    currency_id: string,
    quantity: number,
    paidPrice: number,
    date?: Date;
  }>(defaultInvestimentFieldsValue);
  const [currencyFields, setCurrencyFields] = useState<{
    price: number;
    bought_currency_name: string;
    bought_currency_id: string;
    selled_currency_name: string;
    selled_currency_id: string;
    quantity: number;
    date?: Date;
  }>(defaultCurrencyFieldsValue);

  if (isLoading === true) {
    return <div>Loading...</div>;
  }

  const handleOptionClick = (option: string) => {
    setType(option);
  };

  const handleInvestimentSubmit = async () => {
    const financingApi = new FinancingApi();

    const data = {...investimentFields};

    if (data.id === undefined) {
      const res = await financingApi.investiments.post({
        body: {
          name: data.name,
          investiment_type: data.type,
          currency_id: data.currency_id,
          segment: data.segment ?? '',
        }
      });

      data.id = res.id;
    }

    await financingApi.operations.post({
      body: {
        investiment_id: data.id,
        quantity: data.quantity,
        price: data.paidPrice,
        date: data.date ?? new Date(),
      }
    });

    setInvestimentFields(defaultInvestimentFieldsValue);
    refetch();
  };

  const handleCurrencySubmit = async () => {
    const financingApi = new FinancingApi();

    const data = {...currencyFields};

    if (data.selled_currency_id === undefined) {
      console.log("Please provide an existing selled currency");
      // TODO: alert
    } 

    if (data.bought_currency_id === '') {
      const res = await financingApi.currencies.post({
        body: {
          name: data.bought_currency_name,
          quotation_in_BRL: 1
        }
      });

      data.bought_currency_id = res.id;
    }

    await financingApi.currenciesOperations.post({
      body: {
        bought_currency_id: data.bought_currency_id,
        selled_currency_id: data.selled_currency_id,
        quantity: data.quantity,
        price: data.price,
        date: data.date ?? new Date(),
      }
    });

    setCurrencyFields(defaultCurrencyFieldsValue);
    refetch();
  };

  return (
    <FormContainer>
      <OptionContainer>
        <OptionButton
          className={type === 'investiment' ? 'active' : ''}
          onClick={() => handleOptionClick('investiment')}
        >
          Investiment
        </OptionButton>
        <OptionButton
          className={type === 'currency' ? 'active' : ''}
          onClick={() => handleOptionClick('currency')}
        >
          Currency
        </OptionButton>
      </OptionContainer>

      {
        data && type === 'investiment' && (
          <>
            <InputContainer>
              <StyledInput 
                type="text"
                id="investiment-type"
                placeholder=" "
                list="investiment-types"
                value={investimentFields.type}
                onChange={(e) => setInvestimentFields((prev) => ({ ...prev, type: e.target.value }))}
              />
              <Label htmlFor="investiment-type">Investiment Type</Label>
              <datalist id="investiment-types">
                {
                  data.investiments.reduce((acc: string[], inv) => {
                    if (!(acc.includes(inv.type))) acc.push(inv.type);
                    
                    return acc; 
                  }, []).sort().map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))
                }
              </datalist>
            </InputContainer>
            {
              investimentFields.type !== '' && (
                <InputContainer>
                  <StyledInput 
                    type="text"
                    id="investiment-name"
                    placeholder=" "
                    list="investiment-names"
                    value={investimentFields.name}
                    onChange={(e) => setInvestimentFields((prev) => ({
                      ...prev,
                      name: e.target.value,
                      id: data.investiments.filter(i => i.type === investimentFields.type)
                        .find(inv => inv.name === e.target.value)?.id,
                    }))}
                  />
                  <Label htmlFor="investiment-name">Name</Label>
                  <datalist id="investiment-names">
                    {
                      data.investiments.filter(i => i.type === investimentFields.type)
                        .sort((a, b) => a.name > b.name ? 1 : -1).map(inv => (
                          <option key={inv.id} value={inv.name}>{inv.name}</option>
                        ))
                    }
                  </datalist>
                </InputContainer>
              )
            }
            {
              investimentFields.name !== '' && investimentFields.id === undefined && (
                <ColumnsContainer>
                  <InputContainer>
                    <StyledInput 
                      type="text"
                      id="investiment-segment"
                      placeholder=" "
                      list="investiment-segments"
                      value={investimentFields.segment ?? ''}
                      onChange={(e) => setInvestimentFields((prev) => ({
                        ...prev,
                        segment: e.target.value,
                      }))}
                    />
                    <Label htmlFor="investiment-segment">Segment</Label>
                    <datalist id="investiment-segments">
                      {
                        data.investiments.filter(i => i.type === investimentFields.type).reduce((acc: string[], inv) => {
                          if (!(acc.includes(inv.segment))) acc.push(inv.segment);
                          
                          return acc; 
                        }, []).sort().map(segment => (
                          <option key={segment} value={segment}>{segment}</option>
                        ))
                      }
                    </datalist>
                  </InputContainer>
                  <InputContainer>
                    <StyledInput 
                      type="text"
                      id="investiment-currency"
                      placeholder=" "
                      list="investiment-currencies"
                      value={investimentFields.currency_name}
                      onChange={(e) => setInvestimentFields((prev) => ({
                        ...prev,
                        currency_id: data.currencies.find(c => c.name === e.target.value)?.id ?? '',
                        currency_name: e.target.value,
                      }))}
                    />
                    <Label htmlFor="investiment-currency">Currency</Label>
                    <datalist id="investiment-currencies">
                      {
                        data.currencies.sort((a, b) => a.name > b.name ? 1 : -1).map(cur => (
                          <option key={cur.id} value={cur.name}>{cur.name}</option>
                        ))
                      }
                    </datalist>
                  </InputContainer>
                </ColumnsContainer>
              )
            }
            {
              investimentFields.name !== '' && 
                (investimentFields.id !== undefined || investimentFields.currency_id !== '') && (
                <InputContainer>
                  <StyledInput 
                    type="number"
                    id="investiment-quantity"
                    placeholder=" "
                    value={investimentFields.quantity}
                    onChange={(e) => setInvestimentFields((prev) => ({
                      ...prev,
                      quantity: e.target.valueAsNumber
                    }))}
                  />
                  <Label htmlFor="investiment-quantity">Quantity</Label>
                </InputContainer>
              )
            }
            {
              investimentFields.quantity !== 0 && (
                <InputContainer>
                  <StyledInput 
                    type="number"
                    id="investiment-paid-price"
                    placeholder=" "
                    value={investimentFields.paidPrice}
                    onChange={(e) => setInvestimentFields((prev) => ({
                      ...prev,
                      paidPrice: e.target.valueAsNumber
                    }))}
                  />
                  <Label htmlFor="investiment-paid-price">Paid Price</Label>
                </InputContainer>
              )
            }
            {
              investimentFields.paidPrice !== 0 && (
                <InputContainer>
                  <StyledInput 
                    type="date"
                    id="investiment-date"
                    placeholder=" "
                    onChange={(e) => setInvestimentFields((prev) => ({
                      ...prev,
                      date: new Date(e.target.value)
                    }))}
                  />
                  <Label htmlFor="investiment-date">Date</Label>
                </InputContainer>
              )
            }
            {
              investimentFields.date !== undefined && (
                <SubmitButton onClick={handleInvestimentSubmit}>Submit</SubmitButton>
              )
            }
          </>
        )
      }

      {
        data && type === 'currency' && (
          <>
            <InputContainer>
              <StyledInput
                type="text"
                id="bought-currency"
                placeholder=" "
                list="currencies"
                value={currencyFields.bought_currency_name}
                onChange={(e) =>
                  setCurrencyFields((prev) => ({
                    ...prev,
                    bought_currency_name: e.target.value,
                    bought_currency_id: data.currencies.find((c) => c.name === e.target.value)?.id ?? '',
                  }))
                }
              />
              <Label htmlFor="bought-currency">Bought Currency</Label>
              <datalist id="currencies">
                {data.currencies
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((currency) => (
                    <option key={currency.id} value={currency.name}>{currency.name}</option>
                  ))}
              </datalist>
            </InputContainer>
            <InputContainer>
              <StyledInput
                type="text"
                id="selled-currency"
                placeholder=" "
                list="currencies"
                value={currencyFields.selled_currency_name}
                onChange={(e) =>
                  setCurrencyFields((prev) => ({
                    ...prev,
                    selled_currency_id: data.currencies.find((c) => c.name === e.target.value)?.id ?? '',
                    selled_currency_name: e.target.value,
                  }))
                }
              />
              <Label htmlFor="selled-currency">Selled Currency</Label>
              <datalist id="currencies">
                {data.currencies
                  .sort((a, b) => (a.name > b.name ? 1 : -1))
                  .map((currency) => (
                    <option key={currency.id} value={currency.name}>{currency.name}</option>
                  ))}
              </datalist>
            </InputContainer>
            {currencyFields.bought_currency_id !== '' && currencyFields.selled_currency_id !== '' && (
              <InputContainer>
                <StyledInput
                  type="number"
                  id="currency-quantity"
                  placeholder=" "
                  value={currencyFields.quantity}
                  onChange={(e) =>
                    setCurrencyFields((prev) => ({
                      ...prev,
                      quantity: e.target.valueAsNumber,
                    }))
                  }
                />
                <Label htmlFor="currency-quantity">Quantity</Label>
              </InputContainer>
            )}
            {currencyFields.quantity !== 0 && (
              <InputContainer>
                <StyledInput
                  type="number"
                  id="currency-price"
                  placeholder=" "
                  value={currencyFields.price}
                  onChange={(e) =>
                    setCurrencyFields((prev) => ({
                      ...prev,
                      price: e.target.valueAsNumber,
                    }))
                  }
                />
                <Label htmlFor="currency-price">Price</Label>
              </InputContainer>
            )}
            {currencyFields.price !== 0 && (
              <InputContainer>
                <StyledInput
                  type="date"
                  id="currency-date"
                  placeholder=" "
                  onChange={(e) =>
                    setCurrencyFields((prev) => ({
                      ...prev,
                      date: new Date(e.target.value),
                    }))
                  }
                />
                <Label htmlFor="currency-date">Date</Label>
              </InputContainer>
            )}
            {currencyFields.date !== undefined && (
              <SubmitButton onClick={handleCurrencySubmit}>Submit</SubmitButton>
            )}
          </>
        )
      }
    </FormContainer>
  )
};

export default AddForm;
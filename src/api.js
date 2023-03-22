import fetch from 'node-fetch';

export const getCashInConfig = async () => fetch(process.env.API_CASH_IN, {
  method: 'GET',
}).then((response) => response.json());

export const getCashOutNaturalConfig = async () => fetch(process.env.API_CASH_OUT_NATURAL, {
  method: 'GET',
}).then((response) => response.json());

export const getCashOutJuridical = async () => fetch(process.env.API_CASH_OUT_JURIDICAL, {
  method: 'GET',
}).then((response) => response.json());

export const getFeeConfig = async () => Promise.all(
  [
    getCashInConfig(),
    getCashOutNaturalConfig(),
    getCashOutJuridical(),
  ],
)
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .then(([cashIn, cashOutNatural, cashOutJuridical]) => ({
    cashIn,
    cashOutNatural,
    cashOutJuridical,
  }));

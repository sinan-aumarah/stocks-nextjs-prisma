export const getMockCompany = () => ({
  id: Math.random(),
  name: "Company 1",
  ticker_symbol: "C1",
  exchange_symbol: "E1",
  unique_symbol: "U1",
  swsCompanyPriceClose: [
    {
      date_created: "2022-01-01",
      price: 100,
    },
  ],
  swsCompanyScore: {
    total: 25,
    sentence: "Good",
    value: 5,
    future: 5,
    past: 5,
    health: 5,
    dividend: 5,
  },
});

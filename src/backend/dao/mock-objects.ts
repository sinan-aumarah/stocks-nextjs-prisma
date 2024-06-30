export const getMockRepositoryCompany = () => ({
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

export const getMockedStockServiceResponse = () => ({
  companyName: "Company 1",
  symbol: "C1",
  exchangeSymbol: "E1",
  uniqueSymbol: "U1",
  latestPrice: 100,
  sharePrices: [
    {
      dateTime: new Date("2022-01-01"),
      price: 100,
    },
  ],
  stockVolatility: {
    average: 0,
    standardDeviation: 0,
    scores: [],
  },
  snowflake: {
    overallScore: 25,
    description: "Good",
    value: 5,
    future: 5,
    past: 5,
    health: 5,
    dividend: 5,
  },
});

export const getMockStockRepositoryResponse = () => ({
  companiesWithPriceHistory: [getMockRepositoryCompany()],
  totalStockCount: 1,
});

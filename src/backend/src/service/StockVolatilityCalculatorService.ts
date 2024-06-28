interface CompanyPriceHistory {
  name: string;
  uniqueSymbol: string;
  dateCreated: Date;
  price: number;
}

type StockVolatilityScore = {
  dailyVolatility: number;
  annualVolatility: number;
  isEnoughDataAvailable: boolean;
  totalDaysCompared: number;
};

class StockVolatilityService {
  public calculateVolatility(
    priceHistory: CompanyPriceHistory[],
    numberOfDaysToCompare: number = 90,
  ): StockVolatilityScore {
    // TODO: This is a naive approach, we should be ensuring the days and are unique and in consecutive order
    const isEnoughCorrectDataAvailable =
      priceHistory.length >= numberOfDaysToCompare;

    const lastNPrices: number[] = priceHistory
      .slice(0, numberOfDaysToCompare)
      .map(({ price }) => price);
    const volatilityScore =
      this.calculateAnnualizedStandardDeviation(lastNPrices);

    return {
      isEnoughDataAvailable: isEnoughCorrectDataAvailable,
      totalDaysCompared: priceHistory.length,
      ...volatilityScore,
    };
  }

  //TODO check if this logic is actually accurate 🤔
  private calculateAnnualizedStandardDeviation(priceHistory: number[]) {
    // Calculate daily returns
    const dailyReturns = [];

    for (let i = 1; i < priceHistory.length; i++) {
      const dailyReturn =
        (priceHistory[i] - priceHistory[i - 1]) / priceHistory[i - 1];

      dailyReturns.push(dailyReturn);
    }

    // Calculate mean of daily returns
    const mean = dailyReturns.reduce((a, b) => a + b, 0) / dailyReturns.length;
    // Calculate variance (average of squared differences from the mean)
    const variance =
      dailyReturns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) /
      dailyReturns.length;
    // Standard deviation is the square root of variance
    const dailyStdDev = Math.sqrt(variance);

    // Annualized standard deviation by multiplying by square root of number of trading days in a year
    const annualizedStdDev = dailyStdDev * Math.sqrt(252);

    return {
      dailyVolatility: dailyStdDev,
      annualVolatility: annualizedStdDev,
    };
  }
}

export default StockVolatilityService;

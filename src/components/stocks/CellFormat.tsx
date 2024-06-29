// todo: this should be in the stock exchange currency?

const currencyFormatter = (value: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
  }).format(value);

const volatilityFormatter = (value: number) => {
  return `${(value * 100).toFixed(2)}%`;
};

function cellRenderer(columnKey: string, cellValue: any) {
  switch (columnKey) {
    case "latestPrice":
      return currencyFormatter(cellValue as number);
    case "volatility":
      return (
        <div className="flex flex-col">
          <p className="text-bold text-small capitalize">
            Annual: {volatilityFormatter(cellValue.annualVolatility)}
          </p>
          <p className="text-bold text-tiny capitalize text-default-400">
            Daily: {volatilityFormatter(cellValue.dailyVolatility)}
          </p>
          {!cellValue.isSufficientDataPresent ? (
            <p className="text-bold text-tiny capitalize text-default-400">
              Based on {cellValue.totalDaysCompared}days
            </p>
          ) : null}
        </div>
      );
    default:
      return cellValue;
  }
}

export { cellRenderer };

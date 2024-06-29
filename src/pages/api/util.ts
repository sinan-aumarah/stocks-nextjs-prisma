const parseToNumberIfAvailable = (value: any): number | null => {
  if (typeof value === "string" && !isNaN(Number(value)) && value !== "") {
    return Number(value);
  }

  return null;
};

export { parseToNumberIfAvailable };

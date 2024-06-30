const parseToNumberIfAvailable = (value?: any): number | null => {
  const num = Number(value);

  return isNaN(num) ? null : num;
};

export { parseToNumberIfAvailable };

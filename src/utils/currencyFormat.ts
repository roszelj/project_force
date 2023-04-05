export function stringToCurrency(str) {
  const price = Number.parseFloat(str).toFixed(2);
  return '$' + price.toLocaleString();
}

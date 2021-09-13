export function getMoney({ amount, currency }) {
  if (!amount || !currency) {
    return null;
  }

  const moneyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  });
  return moneyFormatter.format(amount);
}

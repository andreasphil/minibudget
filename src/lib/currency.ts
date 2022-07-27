/** Formats a number as a currency. Currently doesn't support i18n. */
export function formatCurrency(value: number): string {
  const { format } = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: "EUR",
  });
  return format(value);
}

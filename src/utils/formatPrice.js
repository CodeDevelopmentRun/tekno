export function formatPrice(value) {
  if (value === null || value === undefined) return "—";
  return Number(value)
    .toFixed(0)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

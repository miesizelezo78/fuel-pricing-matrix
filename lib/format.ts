const money = new Intl.NumberFormat("sk-SK", {
  style: "currency",
  currency: "EUR",
});

const number = new Intl.NumberFormat("sk-SK", {
  maximumFractionDigits: 2,
});

export function formatMoney(value: number) {
  return money.format(value);
}

export function formatKg(kg: number) {
  return `${number.format(kg)} kg`;
}

export function formatPerKg(value: number) {
  return `${money.format(value)}/kg`;
}

export function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

export function formatBagCount(bags: number) {
  if (bags === 1) return "1 vrece";
  if (bags >= 2 && bags <= 4) return `${bags} vrecia`;
  return `${bags} vriec`;
}

export function formatPercent(value: number) {
  return new Intl.NumberFormat("sk-SK", {
    style: "percent",
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatMoneyInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) return "";

  return Number(digits).toLocaleString("ko-KR");
}

export function parseMoney(value) {
  return Number(String(value ?? "").replace(/,/g, "")) || 0;
}

export function formatWon(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}원`;
}
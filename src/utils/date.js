export function formatDate(date) {
  if (!date) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${date}T00:00:00`));
}

export function today() {
  return new Date().toISOString().slice(0, 10);
}

export function currentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export function daysInMonth(dateString) {
  const [year, month] = dateString
    .split("-")
    .map(Number);

  return new Date(year, month, 0).getDate();
}

export function isToday(date) {
  return date === today();
}
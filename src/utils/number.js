export function clamp(
  value,
  min,
  max,
) {
  return Math.min(
    Math.max(value, min),
    max,
  );
}

export function percent(
  current,
  total,
) {
  if (total <= 0) return 0;

  return clamp(
    (current / total) * 100,
    0,
    100,
  );
}

export function round(
  value,
  digits = 0,
) {
  const factor = 10 ** digits;

  return (
    Math.round(value * factor) /
    factor
  );
}

export function average(array = []) {
  if (array.length === 0) return 0;

  return (
    array.reduce(
      (sum, value) => sum + value,
      0,
    ) / array.length
  );
}

export function sum(array = []) {
  return array.reduce(
    (total, value) =>
      total + Number(value || 0),
    0,
  );
}
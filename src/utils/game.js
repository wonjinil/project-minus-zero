export function calculateGameStats(result) {
  const recovered = Math.max(0, Number(result.recovered || 0));
  const dailyRows = Array.isArray(result.dailyRows)
    ? result.dailyRows
    : [];

  const levelStep = 100000;
  const level = Math.floor(recovered / levelStep) + 1;
  const levelProgress =
    ((recovered % levelStep) / levelStep) * 100;
  const nextLevelAmount =
    levelStep - (recovered % levelStep || levelStep);

  let streak = 0;

  for (let index = dailyRows.length - 1; index >= 0; index -= 1) {
    if (dailyRows[index].saving >= 0) {
      streak += 1;
    } else {
      break;
    }
  }

  const successfulDays = dailyRows.filter(
    (day) => day.saving >= 0,
  ).length;

  return {
    level,
    levelProgress,
    nextLevelAmount,
    streak,
    successfulDays,
  };
}
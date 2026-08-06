export function calculateExperience(result, streak = 0) {
  const recovered = Number(result.recovered || 0);

  let exp = 0;

  exp += Math.floor(recovered / 1000);

  exp += streak * 20;

  const level = Math.floor(exp / 500) + 1;

  const currentLevelExp = exp % 500;

  const nextLevelExp = 500;

  return {
    exp,
    level,
    currentLevelExp,
    nextLevelExp,
    progress:
      (currentLevelExp / nextLevelExp) * 100,
  };
}
export function hasLevelUp(
  previousLevel,
  currentLevel,
) {
  if (
    previousLevel == null ||
    currentLevel == null
  ) {
    return false;
  }

  return currentLevel > previousLevel;
}

export function getLevelTitle(level) {
  if (level >= 100)
    return "👑 Minus Legend";

  if (level >= 75)
    return "🏆 Minus Master";

  if (level >= 50)
    return "🚀 Debt Hunter";

  if (level >= 30)
    return "💎 Saver Elite";

  if (level >= 15)
    return "💰 Saver";

  if (level >= 5)
    return "🌱 Beginner";

  return "🐣 Rookie";
}
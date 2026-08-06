export function getAchievements(stats = {}) {
  const achievements = [];

  const recovered = Number(stats.recovered || 0);
  const streak = Number(stats.streak || 0);
  const level = Number(stats.level || 1);

  if (recovered >= 100000) {
    achievements.push({
      id: "recover100k",
      title: "첫 10만원 회복",
      icon: "💰",
    });
  }

  if (recovered >= 500000) {
    achievements.push({
      id: "recover500k",
      title: "50만원 회복",
      icon: "🚀",
    });
  }

  if (recovered >= 1000000) {
    achievements.push({
      id: "recover1m",
      title: "100만원 회복",
      icon: "🏆",
    });
  }

  if (streak >= 7) {
    achievements.push({
      id: "streak7",
      title: "7일 연속 절약",
      icon: "🔥",
    });
  }

  if (streak >= 30) {
    achievements.push({
      id: "streak30",
      title: "30일 연속 절약",
      icon: "👑",
    });
  }

  if (level >= 10) {
    achievements.push({
      id: "level10",
      title: "레벨 10 달성",
      icon: "⭐",
    });
  }

  if (level >= 25) {
    achievements.push({
      id: "level25",
      title: "레벨 25 달성",
      icon: "💎",
    });
  }

  return achievements;
}
export function getBadges(stats = {}) {
  const recovered = Number(stats.recovered || 0);
  const streak = Number(stats.streak || 0);

  const badges = [];

  // 기본 배지
  badges.push({
    id: "starter",
    icon: "🌱",
    title: "Starter",
  });

  if (recovered >= 100000) {
    badges.push({
      id: "saver",
      icon: "💰",
      title: "Saver",
    });
  }

  if (recovered >= 500000) {
    badges.push({
      id: "hunter",
      icon: "🚀",
      title: "Debt Hunter",
    });
  }

  if (recovered >= 1000000) {
    badges.push({
      id: "master",
      icon: "🏆",
      title: "Minus Master",
    });
  }

  if (streak >= 7) {
    badges.push({
      id: "streak7",
      icon: "🔥",
      title: "7 Day Streak",
    });
  }

  if (streak >= 30) {
    badges.push({
      id: "streak30",
      icon: "👑",
      title: "30 Day Streak",
    });
  }

  return badges;
}
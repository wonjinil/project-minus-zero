const KEY = "pmz-project";

export function loadProject() {
  const saved = localStorage.getItem(KEY);

  if (!saved) {
    return {
      projectName: "PROJECT MINUS ZERO",
      startDebt: 0,
      monthlyIncome: 0,
      fixedExpense: 0,
      monthlyGoal: 0,
    };
  }

  return JSON.parse(saved);
}

export function saveProject(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}
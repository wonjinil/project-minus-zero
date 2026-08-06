export function getDaysInMonth(dateString) {
  if (!dateString) {
    return 30;
  }

  const [year, month] = dateString
    .split("-")
    .map(Number);

  return new Date(year, month, 0).getDate();
}

export function calculateDailyTarget(
  project,
  dateString,
) {
  const monthlyIncome = Number(
    project.monthlyIncome || 0,
  );

  const fixedExpense = Number(
    project.fixedExpense || 0,
  );

  const monthlyGoal = Number(
    project.monthlyGoal || 0,
  );

  const variableBudget = Math.max(
    0,
    monthlyIncome - fixedExpense - monthlyGoal,
  );

  return (
    variableBudget /
    getDaysInMonth(dateString)
  );
}

export function calculateProject(
  project,
  transactions,
) {
  const groupedByDate = {};

  transactions.forEach((transaction) => {
    const date = transaction.date;

    if (!groupedByDate[date]) {
      groupedByDate[date] = {
        date,
        expense: 0,
        payment: 0,
      };
    }

    if (transaction.type === "payment") {
      groupedByDate[date].payment += Number(
        transaction.amount || 0,
      );
    } else {
      groupedByDate[date].expense += Number(
        transaction.amount || 0,
      );
    }
  });

  let totalSaving = 0;
  let totalPayment = 0;

  const dailyRows = Object.values(
    groupedByDate,
  )
    .sort((a, b) =>
      a.date.localeCompare(b.date),
    )
    .map((day) => {
      const target = calculateDailyTarget(
        project,
        day.date,
      );

      const saving = target - day.expense;

      totalSaving += saving;
      totalPayment += day.payment;

      return {
        ...day,
        target,
        saving,
      };
    });

  const startDebt = Number(
    project.startDebt || 0,
  );

  const recovered =
    totalSaving + totalPayment;

  const currentDebt = Math.max(
    0,
    startDebt - recovered,
  );

  const progress =
    startDebt > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (recovered / startDebt) * 100,
          ),
        )
      : 0;

  return {
    startDebt,
    totalSaving,
    totalPayment,
    recovered,
    currentDebt,
    progress,
    dailyRows,
  };
}

export function calculatePayoffDate(
  project,
  currentDebt,
) {
  const monthlyGoal = Number(
    project.monthlyGoal || 0,
  );

  if (
    !project.startDate ||
    monthlyGoal <= 0 ||
    currentDebt <= 0
  ) {
    return null;
  }

  const dailyPayment =
    monthlyGoal / 30.4375;

  const remainingDays = Math.ceil(
    currentDebt / dailyPayment,
  );

  const payoffDate = new Date(
    `${project.startDate}T00:00:00`,
  );

  payoffDate.setDate(
    payoffDate.getDate() + remainingDays,
  );

  return payoffDate
    .toISOString()
    .slice(0, 10);
}

export function getNextTarget(
  startDebt,
  currentDebt,
) {
  const start = Number(startDebt || 0);
  const current = Number(currentDebt || 0);

  if (start <= 0 || current <= 0) {
    return {
      target: 0,
      remaining: 0,
    };
  }

  const targetStep = Math.max(
    100000,
    Math.round(
      start / 12 / 100000,
    ) * 100000,
  );

  const target = Math.max(
    0,
    Math.floor(
      (current - 1) / targetStep,
    ) * targetStep,
  );

  return {
    target,
    remaining: Math.max(
      0,
      current - target,
    ),
  };
}
export function getDaysInMonth(dateString) {
  if (!dateString) {
    return 30;
  }

  const [year, month] = dateString.split("-").map(Number);

  return new Date(year, month, 0).getDate();
}

export function calculateDailyTarget(project, dateString) {
  const monthlyIncome = Number(project.monthlyIncome || 0);
  const fixedExpense = Number(project.fixedExpense || 0);
  const monthlyGoal = Number(project.monthlyGoal || 0);

  const variableBudget = Math.max(
    0,
    monthlyIncome - fixedExpense - monthlyGoal,
  );

  return variableBudget / getDaysInMonth(dateString);
}

export function calculateProject(project, transactions) {
  const startDebt = Number(project.startDebt || 0);

  const groupedByDate = transactions.reduce((groups, transaction) => {
    const date = transaction.date;

    if (!groups[date]) {
      groups[date] = {
        expense: 0,
        payment: 0,
      };
    }

    if (transaction.type === "payment") {
      groups[date].payment += Number(transaction.amount || 0);
    } else {
      groups[date].expense += Number(transaction.amount || 0);
    }

    return groups;
  }, {});

  let totalSaving = 0;
  let totalPayment = 0;

  Object.entries(groupedByDate).forEach(([date, daily]) => {
    const target = calculateDailyTarget(project, date);
    const saving = target - daily.expense;

    totalSaving += saving;
    totalPayment += daily.payment;
  });

  const recovered = totalSaving + totalPayment;

  const currentDebt = Math.max(
    0,
    startDebt - recovered,
  );

  const progress =
    startDebt > 0
      ? Math.max(
          0,
          Math.min(100, (recovered / startDebt) * 100),
        )
      : 0;

  return {
    startDebt,
    totalSaving,
    totalPayment,
    recovered,
    currentDebt,
    progress,
  };
}

export function calculatePayoffDate(project, currentDebt) {
  const monthlyGoal = Number(project.monthlyGoal || 0);

  if (monthlyGoal <= 0 || currentDebt <= 0) {
    return null;
  }

  const dailyPayment = monthlyGoal / 30.4375;
  const remainingDays = Math.ceil(currentDebt / dailyPayment);

  const payoffDate = new Date();

  payoffDate.setDate(
    payoffDate.getDate() + remainingDays,
  );

  return payoffDate.toISOString().slice(0, 10);
}
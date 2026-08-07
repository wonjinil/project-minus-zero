import { useEffect, useMemo, useState } from "react";
import { useProject } from "../context/ProjectContext.jsx";
import {
  formatMoneyInput,
  formatWon,
  parseMoney,
} from "../utils/money.js";

const MONEY_FIELDS = [
  "startDebt",
  "monthlyIncome",
  "fixedExpense",
  "monthlyGoal",
];

export default function SettingsPage() {
  const {
    project,
    setProject,
    resetAll,
    dataLoading,
    syncError,
  } = useProject();

  const [form, setForm] = useState({
    projectName: "",
    startDebt: "",
    startDate: "",
    monthlyIncome: "",
    fixedExpense: "",
    monthlyGoal: "",
  });

  useEffect(() => {
    setForm({
      projectName: project.projectName || "",
      startDebt: project.startDebt
        ? Number(project.startDebt).toLocaleString("ko-KR")
        : "",
      startDate: project.startDate || "",
      monthlyIncome: project.monthlyIncome
        ? Number(project.monthlyIncome).toLocaleString("ko-KR")
        : "",
      fixedExpense: project.fixedExpense
        ? Number(project.fixedExpense).toLocaleString("ko-KR")
        : "",
      monthlyGoal: project.monthlyGoal
        ? Number(project.monthlyGoal).toLocaleString("ko-KR")
        : "",
    });
  }, [project]);

  const preview = useMemo(() => {
    const monthlyIncome = parseMoney(form.monthlyIncome);
    const fixedExpense = parseMoney(form.fixedExpense);
    const monthlyGoal = parseMoney(form.monthlyGoal);

    const availableBudget = Math.max(
      0,
      monthlyIncome - fixedExpense - monthlyGoal,
    );

    const now = new Date();
    const daysInMonth = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      0,
    ).getDate();

    return {
      monthlyIncome,
      fixedExpense,
      monthlyGoal,
      availableBudget,
      dailyBudget:
        daysInMonth > 0
          ? availableBudget / daysInMonth
          : 0,
    };
  }, [
    form.monthlyIncome,
    form.fixedExpense,
    form.monthlyGoal,
  ]);

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: MONEY_FIELDS.includes(name)
        ? formatMoneyInput(value)
        : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setProject({
      projectName: form.projectName.trim(),
      startDebt: parseMoney(form.startDebt),
      startDate: form.startDate,
      monthlyIncome: parseMoney(form.monthlyIncome),
      fixedExpense: parseMoney(form.fixedExpense),
      monthlyGoal: parseMoney(form.monthlyGoal),
    });

    alert("설정을 저장했습니다.");
  }

  function handleReset() {
    if (
      window.confirm(
        "설정과 모든 거래 내역을 삭제할까요?",
      )
    ) {
      resetAll();
    }
  }

  if (dataLoading) {
    return (
      <section className="v9-settings-shell">
        <div className="v9-settings-loading">
          클라우드 데이터를 불러오고 있습니다.
        </div>
      </section>
    );
  }

  return (
    <section className="v9-settings-shell">
      <header className="v9-page-heading">
        <span>CONTROL CENTER</span>
        <h2>Settings</h2>
        <p>프로젝트 기준값과 월간 예산을 관리합니다.</p>
      </header>

      {syncError && (
        <div className="sync-error">{syncError}</div>
      )}

      <form
        className="v9-settings-form"
        onSubmit={handleSubmit}
      >
        <section className="v9-settings-panel">
          <div className="v9-panel-title">
            <span>PROJECT</span>
            <strong>기본 설정</strong>
          </div>

          <div className="v9-form-grid">
            <label>
              프로젝트 이름
              <input
                name="projectName"
                value={form.projectName}
                onChange={handleChange}
                placeholder="PROJECT MINUS ZERO"
              />
            </label>

            <label>
              프로젝트 시작일
              <input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
              />
            </label>

            <label className="v9-wide-field">
              시작 부채
              <input
                name="startDebt"
                type="text"
                inputMode="numeric"
                value={form.startDebt}
                onChange={handleChange}
                placeholder="0"
              />
            </label>
          </div>
        </section>

        <section className="v9-settings-panel">
          <div className="v9-panel-title">
            <span>MONTHLY PLAN</span>
            <strong>예산 설정</strong>
          </div>

          <div className="v9-form-grid">
            <label>
              기준 월수입
              <input
                name="monthlyIncome"
                type="text"
                inputMode="numeric"
                value={form.monthlyIncome}
                onChange={handleChange}
                placeholder="0"
              />
            </label>

            <label>
              필수 고정비
              <input
                name="fixedExpense"
                type="text"
                inputMode="numeric"
                value={form.fixedExpense}
                onChange={handleChange}
                placeholder="0"
              />
            </label>

            <label className="v9-wide-field">
              월 목표상환
              <input
                name="monthlyGoal"
                type="text"
                inputMode="numeric"
                value={form.monthlyGoal}
                onChange={handleChange}
                placeholder="0"
              />
            </label>
          </div>
        </section>

        <section className="v9-budget-preview">
          <div className="v9-panel-title">
            <span>LIVE PREVIEW</span>
            <strong>입력값 기준 예산</strong>
          </div>

          <div className="v9-budget-grid">
            <article>
              <span>MONTHLY INCOME</span>
              <strong>
                {formatWon(preview.monthlyIncome)}
              </strong>
            </article>

            <article>
              <span>FIXED EXPENSE</span>
              <strong className="negative-value">
                -{formatWon(preview.fixedExpense)}
              </strong>
            </article>

            <article>
              <span>MONTHLY PAYMENT</span>
              <strong className="negative-value">
                -{formatWon(preview.monthlyGoal)}
              </strong>
            </article>

            <article className="v9-budget-highlight">
              <span>AVAILABLE BUDGET</span>
              <strong className="positive-value">
                {formatWon(preview.availableBudget)}
              </strong>
            </article>

            <article className="v9-budget-highlight">
              <span>DAILY TARGET</span>
              <strong className="positive-value">
                {formatWon(preview.dailyBudget)}
              </strong>
            </article>
          </div>
        </section>

        <button
          className="v9-save-button"
          type="submit"
        >
          Save Settings
        </button>

        <button
          className="v9-reset-button"
          type="button"
          onClick={handleReset}
        >
          모든 데이터 초기화
        </button>
      </form>
    </section>
  );
}

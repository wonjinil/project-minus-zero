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

    const dailyBudget =
      daysInMonth > 0
        ? availableBudget / daysInMonth
        : 0;

    return {
      monthlyIncome,
      fixedExpense,
      monthlyGoal,
      availableBudget,
      dailyBudget,
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
    const confirmed = window.confirm(
      "설정과 모든 거래 내역을 삭제할까요?",
    );

    if (!confirmed) {
      return;
    }

    resetAll();
  }

  if (dataLoading) {
    return (
      <section className="page-card">
        <h2>설정</h2>

        <p className="empty-message">
          클라우드 데이터를 불러오고 있습니다.
        </p>
      </section>
    );
  }

  return (
    <section className="page-card">
      <h2>설정</h2>

      {syncError && (
        <div className="sync-error">
          {syncError}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label>
          프로젝트 이름
          <input
            name="projectName"
            value={form.projectName}
            onChange={handleChange}
            placeholder="직접 입력"
          />
        </label>

        <label>
          시작 부채
          <input
            name="startDebt"
            type="text"
            inputMode="numeric"
            value={form.startDebt}
            onChange={handleChange}
            placeholder="직접 입력"
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

        <label>
          기준 월수입
          <input
            name="monthlyIncome"
            type="text"
            inputMode="numeric"
            value={form.monthlyIncome}
            onChange={handleChange}
            placeholder="직접 입력"
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
            placeholder="직접 입력"
          />
        </label>

        <label>
          월 목표상환
          <input
            name="monthlyGoal"
            type="text"
            inputMode="numeric"
            value={form.monthlyGoal}
            onChange={handleChange}
            placeholder="직접 입력"
          />
        </label>

        <section
          style={{
            padding: "16px",
            border: "1px solid #dbe4ec",
            borderRadius: "16px",
            background: "#f5f8fb",
          }}
        >
          <strong
            style={{
              display: "block",
              marginBottom: "12px",
            }}
          >
            입력값 기준 예산
          </strong>

          <dl
            style={{
              display: "grid",
              gap: "10px",
              margin: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <dt>기준 월수입</dt>
              <dd style={{ margin: 0 }}>
                {formatWon(preview.monthlyIncome)}
              </dd>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <dt>필수 고정비</dt>
              <dd style={{ margin: 0 }}>
                -{formatWon(preview.fixedExpense)}
              </dd>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <dt>월 목표상환</dt>
              <dd style={{ margin: 0 }}>
                -{formatWon(preview.monthlyGoal)}
              </dd>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
                paddingTop: "10px",
                borderTop: "1px solid #dbe4ec",
              }}
            >
              <dt>
                <strong>월 가용 생활비</strong>
              </dt>

              <dd
                style={{
                  margin: 0,
                  color: "#2f80ed",
                  fontWeight: 800,
                }}
              >
                {formatWon(preview.availableBudget)}
              </dd>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "12px",
              }}
            >
              <dt>
                <strong>하루 목표지출</strong>
              </dt>

              <dd
                style={{
                  margin: 0,
                  color: "#2e8b57",
                  fontWeight: 800,
                }}
              >
                {formatWon(preview.dailyBudget)}
              </dd>
            </div>
          </dl>
        </section>

        <button
          className="primary-btn"
          type="submit"
        >
          저장
        </button>

        <button
          className="danger-btn"
          type="button"
          onClick={handleReset}
        >
          모든 데이터 초기화
        </button>
      </form>
    </section>
  );
}
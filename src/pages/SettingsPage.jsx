import { useEffect, useState } from "react";
import { useProject } from "../context/ProjectContext";

function formatMoneyInput(value) {
  const digits = String(value ?? "").replace(/\D/g, "");

  if (!digits) {
    return "";
  }

  return Number(digits).toLocaleString("ko-KR");
}

function parseMoney(value) {
  return Number(String(value ?? "").replace(/,/g, "")) || 0;
}

function SettingsPage() {
  const { project, setProject } = useProject();

  const [form, setForm] = useState({
    projectName: "",
    startDebt: "",
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

  function handleTextChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleMoneyChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: formatMoneyInput(value),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    setProject({
      projectName: form.projectName.trim(),
      startDebt: parseMoney(form.startDebt),
      monthlyIncome: parseMoney(form.monthlyIncome),
      fixedExpense: parseMoney(form.fixedExpense),
      monthlyGoal: parseMoney(form.monthlyGoal),
    });

    alert("저장되었습니다.");
  }

  return (
    <section className="page-card">
      <h2>설정</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="projectName">프로젝트 이름</label>
          <input
            id="projectName"
            name="projectName"
            value={form.projectName}
            onChange={handleTextChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="startDebt">시작 부채</label>
          <input
            id="startDebt"
            name="startDebt"
            type="text"
            inputMode="numeric"
            value={form.startDebt}
            onChange={handleMoneyChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="monthlyIncome">기준 월수입</label>
          <input
            id="monthlyIncome"
            name="monthlyIncome"
            type="text"
            inputMode="numeric"
            value={form.monthlyIncome}
            onChange={handleMoneyChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="fixedExpense">필수 고정비</label>
          <input
            id="fixedExpense"
            name="fixedExpense"
            type="text"
            inputMode="numeric"
            value={form.fixedExpense}
            onChange={handleMoneyChange}
          />
        </div>

        <div className="form-group">
          <label htmlFor="monthlyGoal">월 목표 상환</label>
          <input
            id="monthlyGoal"
            name="monthlyGoal"
            type="text"
            inputMode="numeric"
            value={form.monthlyGoal}
            onChange={handleMoneyChange}
          />
        </div>

        <button className="primary-btn" type="submit">
          저장
        </button>
      </form>
    </section>
  );
}

export default SettingsPage;
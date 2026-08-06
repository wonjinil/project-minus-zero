import { useState } from "react";
import { useProject } from "../context/ProjectContext";

const CATEGORIES = [
  "식비",
  "카페·간식",
  "교통·차량",
  "생활잡화",
  "쇼핑",
  "구독·디지털",
  "의료",
  "여가",
  "기타",
];

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

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function InputPage() {
  const { addTransaction } = useProject();

  const [form, setForm] = useState({
    date: getToday(),
    type: "expense",
    category: CATEGORIES[0],
    amount: "",
    memo: "",
  });

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  function handleMoneyChange(event) {
    setForm((current) => ({
      ...current,
      amount: formatMoneyInput(event.target.value),
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const amount = parseMoney(form.amount);

    if (!form.date) {
      alert("날짜를 입력하세요.");
      return;
    }

    if (amount <= 0) {
      alert("금액을 입력하세요.");
      return;
    }

    addTransaction({
      date: form.date,
      type: form.type,
      category: form.category,
      amount,
      memo: form.memo.trim(),
    });

    setForm((current) => ({
      ...current,
      amount: "",
      memo: "",
    }));

    alert("저장되었습니다.");
  }

  return (
    <section className="page-card">
      <h2>거래 입력</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="date">날짜</label>
          <input
            id="date"
            name="date"
            type="date"
            value={form.date}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="type">구분</label>
          <select
            id="type"
            name="type"
            value={form.type}
            onChange={handleChange}
          >
            <option value="expense">지출</option>
            <option value="payment">추가상환</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="category">카테고리</label>
          <select
            id="category"
            name="category"
            value={form.category}
            onChange={handleChange}
          >
            {CATEGORIES.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="amount">금액</label>
          <input
            id="amount"
            name="amount"
            type="text"
            inputMode="numeric"
            value={form.amount}
            onChange={handleMoneyChange}
            placeholder="0"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="memo">메모</label>
          <textarea
            id="memo"
            name="memo"
            rows="4"
            value={form.memo}
            onChange={handleChange}
            placeholder="선택사항"
          />
        </div>

        <button className="primary-btn" type="submit">
          저장
        </button>
      </form>
    </section>
  );
}

export default InputPage;
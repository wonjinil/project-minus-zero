import { useEffect, useMemo, useState } from "react";
import { useProject } from "../context/ProjectContext.jsx";
import {
  formatMoneyInput,
  formatWon,
  parseMoney,
} from "../utils/money.js";

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

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function createDefaultForm() {
  return {
    date: getToday(),
    type: "expense",
    category: CATEGORIES[0],
    amount: "",
    memo: "",
  };
}

export default function InputPage({
  editingTransaction,
  onFinished,
  onCancel,
}) {
  const {
    addTransaction,
    updateTransaction,
  } = useProject();

  const [form, setForm] = useState(createDefaultForm);

  useEffect(() => {
    if (!editingTransaction) {
      setForm(createDefaultForm());
      return;
    }

    setForm({
      date: editingTransaction.date || getToday(),
      type: editingTransaction.type || "expense",
      category:
        editingTransaction.category || CATEGORIES[0],
      amount: formatMoneyInput(
        editingTransaction.amount,
      ),
      memo: editingTransaction.memo || "",
    });
  }, [editingTransaction]);

  const amount = useMemo(
    () => parseMoney(form.amount),
    [form.amount],
  );

  const isPayment = form.type === "payment";

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]:
        name === "amount"
          ? formatMoneyInput(value)
          : value,
    }));
  }

  function handleTypeChange(type) {
    setForm((current) => ({
      ...current,
      type,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!form.date) {
      alert("날짜를 입력하세요.");
      return;
    }

    if (amount <= 0) {
      alert("금액을 입력하세요.");
      return;
    }

    const payload = {
      date: form.date,
      type: form.type,
      category: form.category,
      amount,
      memo: form.memo.trim(),
    };

    if (editingTransaction?.id) {
      updateTransaction(
        editingTransaction.id,
        payload,
      );
      alert("수정되었습니다.");
      onFinished?.();
      return;
    }

    addTransaction(payload);
    setForm(createDefaultForm());
    alert("저장되었습니다.");
    onFinished?.();
  }

  return (
    <section className="v9-input-shell">
      <header className="v9-page-heading">
        <span>QUICK ENTRY</span>
        <h2>
          {editingTransaction
            ? "Edit Transaction"
            : "Add Transaction"}
        </h2>
        <p>
          오늘의 지출과 추가상환을 빠르게 기록합니다.
        </p>
      </header>

      <form
        className="v9-input-form"
        onSubmit={handleSubmit}
      >
        <section className="v9-input-panel v9-type-panel">
          <div className="v9-panel-title">
            <span>TYPE</span>
            <strong>거래 구분</strong>
          </div>

          <div className="v9-type-switch">
            <button
              type="button"
              className={
                !isPayment ? "active expense" : ""
              }
              onClick={() => handleTypeChange("expense")}
            >
              <span>−</span>
              <strong>지출</strong>
              <small>생활비 사용</small>
            </button>

            <button
              type="button"
              className={
                isPayment ? "active payment" : ""
              }
              onClick={() => handleTypeChange("payment")}
            >
              <span>+</span>
              <strong>추가상환</strong>
              <small>부채 직접 감소</small>
            </button>
          </div>
        </section>

        <section className="v9-input-panel v9-amount-panel">
          <label htmlFor="amount">
            <span>AMOUNT</span>
            <strong>금액</strong>
          </label>

          <div className="v9-amount-input-wrap">
            <input
              id="amount"
              name="amount"
              type="text"
              inputMode="numeric"
              value={form.amount}
              onChange={handleChange}
              placeholder="0"
              required
              autoComplete="off"
            />
            <span>KRW</span>
          </div>

          <p className="v9-amount-preview">
            {amount > 0
              ? formatWon(amount)
              : "금액을 입력하세요."}
          </p>
        </section>

        <section className="v9-input-panel">
          <div className="v9-panel-title">
            <span>DETAILS</span>
            <strong>거래 정보</strong>
          </div>

          <div className="v9-input-grid">
            <label>
              날짜
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleChange}
                required
              />
            </label>

            <label>
              카테고리
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
              >
                {CATEGORIES.map((category) => (
                  <option
                    key={category}
                    value={category}
                  >
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <label className="v9-input-wide">
              메모
              <textarea
                name="memo"
                rows="4"
                value={form.memo}
                onChange={handleChange}
                placeholder="선택사항"
              />
            </label>
          </div>
        </section>

        <button
          className={
            isPayment
              ? "v9-submit-button payment"
              : "v9-submit-button expense"
          }
          type="submit"
        >
          {editingTransaction
            ? "Save Changes"
            : isPayment
              ? "Add Payment"
              : "Save Expense"}
        </button>

        {editingTransaction && (
          <button
            className="v9-cancel-button"
            type="button"
            onClick={onCancel}
          >
            수정 취소
          </button>
        )}
      </form>
    </section>
  );
}

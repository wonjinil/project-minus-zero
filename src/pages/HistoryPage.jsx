import { useMemo, useState } from "react";
import { useProject } from "../context/ProjectContext.jsx";
import { formatWon } from "../utils/money.js";

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

export default function HistoryPage({ onEdit }) {
  const { transactions, deleteTransaction } = useProject();

  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonth(),
  );
  const [selectedType, setSelectedType] = useState("all");
  const [keyword, setKeyword] = useState("");

  const filteredTransactions = useMemo(() => {
    const normalizedKeyword = keyword
      .trim()
      .toLowerCase();

    return [...transactions]
      .filter((item) => {
        const matchesMonth = selectedMonth
          ? item.date.startsWith(selectedMonth)
          : true;

        const matchesType =
          selectedType === "all"
            ? true
            : item.type === selectedType;

        const category = String(
          item.category || "",
        ).toLowerCase();

        const memo = String(
          item.memo || "",
        ).toLowerCase();

        const matchesKeyword =
          !normalizedKeyword ||
          category.includes(normalizedKeyword) ||
          memo.includes(normalizedKeyword);

        return (
          matchesMonth &&
          matchesType &&
          matchesKeyword
        );
      })
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          String(b.createdAt || "").localeCompare(
            String(a.createdAt || ""),
          ),
      );
  }, [
    transactions,
    selectedMonth,
    selectedType,
    keyword,
  ]);

  const summary = useMemo(() => {
    return filteredTransactions.reduce(
      (result, item) => {
        const amount = Number(item.amount || 0);

        if (item.type === "payment") {
          result.payment += amount;
        } else {
          result.expense += amount;
        }

        return result;
      },
      {
        expense: 0,
        payment: 0,
      },
    );
  }, [filteredTransactions]);

  function handleDelete(id) {
    const confirmed = window.confirm(
      "이 거래를 삭제할까요?",
    );

    if (confirmed) {
      deleteTransaction(id);
    }
  }

  return (
    <section className="page-card">
      <h2>거래 내역</h2>

      <div
        style={{
          display: "grid",
          gap: "12px",
          marginBottom: "16px",
        }}
      >
        <label>
          조회 월
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(event.target.value)
            }
          />
        </label>

        <label>
          유형
          <select
            value={selectedType}
            onChange={(event) =>
              setSelectedType(event.target.value)
            }
          >
            <option value="all">전체</option>
            <option value="expense">지출</option>
            <option value="payment">
              추가상환
            </option>
          </select>
        </label>

        <label>
          검색
          <input
            type="search"
            value={keyword}
            onChange={(event) =>
              setKeyword(event.target.value)
            }
            placeholder="카테고리 또는 메모"
          />
        </label>
      </div>

      <section
        className="home-stat-grid"
        style={{
          marginBottom: "16px",
        }}
      >
        <article className="home-stat-card">
          <span>지출 합계</span>
          <strong className="negative-value">
            {formatWon(summary.expense)}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>추가상환 합계</span>
          <strong className="positive-value">
            {formatWon(summary.payment)}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>거래 건수</span>
          <strong>
            {filteredTransactions.length}건
          </strong>
        </article>

        <article className="home-stat-card">
          <span>순 회복액</span>
          <strong
            className={
              summary.payment - summary.expense >= 0
                ? "positive-value"
                : "negative-value"
            }
          >
            {formatWon(
              summary.payment - summary.expense,
            )}
          </strong>
        </article>
      </section>

      {filteredTransactions.length === 0 ? (
        <p className="empty-message">
          조건에 맞는 거래가 없습니다.
        </p>
      ) : (
        filteredTransactions.map((item) => (
          <article
            className="history-item"
            key={item.id}
          >
            <div>
              <strong>{item.category}</strong>

              <p>{item.date}</p>

              <small>
                {item.type === "payment"
                  ? "추가상환"
                  : "지출"}
              </small>

              {item.memo && (
                <small>{item.memo}</small>
              )}
            </div>

            <div className="history-actions">
              <strong
                className={
                  item.type === "payment"
                    ? "payment-text"
                    : "expense-text"
                }
              >
                {item.type === "payment"
                  ? "+"
                  : "-"}
                {formatWon(item.amount)}
              </strong>

              <div>
                <button
                  className="text-btn"
                  type="button"
                  onClick={() => onEdit(item)}
                >
                  수정
                </button>

                <button
                  className="text-btn danger-text"
                  type="button"
                  onClick={() =>
                    handleDelete(item.id)
                  }
                >
                  삭제
                </button>
              </div>
            </div>
          </article>
        ))
      )}
    </section>
  );
}
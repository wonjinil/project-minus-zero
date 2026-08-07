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
        const itemDate = String(item.date || "");

        const matchesMonth = selectedMonth
          ? itemDate.startsWith(selectedMonth)
          : true;

        const matchesType =
          selectedType === "all" ||
          item.type === selectedType;

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
          String(b.date || "").localeCompare(
            String(a.date || ""),
          ) ||
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

  const summary = useMemo(
    () =>
      filteredTransactions.reduce(
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
      ),
    [filteredTransactions],
  );

  function handleDelete(id) {
    const confirmed = window.confirm(
      "이 거래를 삭제할까요?",
    );

    if (confirmed) {
      deleteTransaction(id);
    }
  }

  return (
    <section className="v9-history-shell">
      <header className="v9-page-heading">
        <span>TRANSACTION LOG</span>
        <h2>History</h2>
        <p>
          지출과 추가상환 기록을 검색하고 관리합니다.
        </p>
      </header>

      <section className="v9-history-filter">
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

        <label className="v9-history-search">
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
      </section>

      <section className="v9-history-summary">
        <article>
          <span>EXPENSE</span>
          <strong className="negative-value">
            {formatWon(summary.expense)}
          </strong>
        </article>

        <article>
          <span>PAYMENT</span>
          <strong className="positive-value">
            {formatWon(summary.payment)}
          </strong>
        </article>

        <article>
          <span>RECORDS</span>
          <strong>
            {filteredTransactions.length}건
          </strong>
        </article>

        <article>
          <span>NET RECOVERY</span>
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

      <section className="v9-history-list">
        <div className="v9-panel-title">
          <span>ACTIVITY</span>
          <strong>거래 내역</strong>
        </div>

        {filteredTransactions.length === 0 ? (
          <p className="v9-history-empty">
            조건에 맞는 거래가 없습니다.
          </p>
        ) : (
          <div className="v9-history-stack">
            {filteredTransactions.map((item) => {
              const isPayment =
                item.type === "payment";

              return (
                <article
                  className="v9-history-row"
                  key={item.id}
                >
                  <div
                    className={
                      isPayment
                        ? "v9-history-icon payment"
                        : "v9-history-icon expense"
                    }
                  >
                    {isPayment ? "↑" : "↓"}
                  </div>

                  <div className="v9-history-main">
                    <strong>
                      {item.category || "기타"}
                    </strong>

                    <div className="v9-history-meta">
                      <span>{item.date}</span>
                      <span>
                        {isPayment
                          ? "추가상환"
                          : "지출"}
                      </span>
                    </div>

                    {item.memo && (
                      <p>{item.memo}</p>
                    )}
                  </div>

                  <div className="v9-history-side">
                    <strong
                      className={
                        isPayment
                          ? "payment-text"
                          : "expense-text"
                      }
                    >
                      {isPayment ? "+" : "-"}
                      {formatWon(item.amount)}
                    </strong>

                    <div>
                      <button
                        type="button"
                        onClick={() => onEdit(item)}
                      >
                        수정
                      </button>

                      <button
                        className="danger"
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
              );
            })}
          </div>
        )}
      </section>
    </section>
  );
}

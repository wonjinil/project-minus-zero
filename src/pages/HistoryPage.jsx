import { useProject } from "../context/ProjectContext";

function formatMoney(value) {
  return Number(value || 0).toLocaleString("ko-KR") + "원";
}

function HistoryPage() {
  const { transactions, deleteTransaction } = useProject();

  const sorted = [...transactions].sort(
    (a, b) => new Date(b.date) - new Date(a.date),
  );

  if (sorted.length === 0) {
    return (
      <section className="page-card">
        <h2>거래 내역</h2>
        <p>아직 저장된 거래가 없습니다.</p>
      </section>
    );
  }

  return (
    <section className="page-card">
      <h2>거래 내역</h2>

      {sorted.map((item) => (
        <div
          className="history-item"
          key={item.id}
        >
          <div>
            <strong>{item.category}</strong>

            <p>{item.date}</p>

            {item.memo && (
              <small>{item.memo}</small>
            )}
          </div>

          <div
            style={{
              textAlign: "right",
            }}
          >
            <strong
              style={{
                color:
                  item.type === "payment"
                    ? "#2E7D32"
                    : "#D32F2F",
              }}
            >
              {item.type === "payment" ? "+" : "-"}
              {formatMoney(item.amount)}
            </strong>

            <br />

            <button
              onClick={() => deleteTransaction(item.id)}
            >
              삭제
            </button>
          </div>
        </div>
      ))}
    </section>
  );
}

export default HistoryPage;
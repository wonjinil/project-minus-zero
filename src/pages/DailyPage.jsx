import { useProject } from "../context/ProjectContext";

function formatWon(value) {
  return `${Math.round(value).toLocaleString("ko-KR")}원`;
}

function DailyPage() {
  const { transactions } = useProject();

  const dailyMap = {};

  transactions.forEach((item) => {
    if (!dailyMap[item.date]) {
      dailyMap[item.date] = {
        expense: 0,
        payment: 0,
      };
    }

    if (item.type === "payment") {
      dailyMap[item.date].payment += item.amount;
    } else {
      dailyMap[item.date].expense += item.amount;
    }
  });

  const days = Object.entries(dailyMap).sort(
    (a, b) => new Date(b[0]) - new Date(a[0])
  );

  return (
    <section className="page-card">
      <h2>일별 요약</h2>

      {days.length === 0 && (
        <p>거래가 없습니다.</p>
      )}

      {days.map(([date, data]) => (
        <div
          key={date}
          className="history-item"
        >
          <div>
            <strong>{date}</strong>

            <p>
              지출 {formatWon(data.expense)}
            </p>

            <p>
              상환 {formatWon(data.payment)}
            </p>
          </div>

          <strong>
            {formatWon(
              data.payment - data.expense
            )}
          </strong>
        </div>
      ))}
    </section>
  );
}

export default DailyPage;
import { formatWon } from "../utils/money.js";

export default function DebtTrendChart({
  startDebt,
  dailyRows,
}) {
  if (!startDebt || dailyRows.length === 0) {
    return (
      <section className="trend-card">
        <div className="trend-heading">
          <div>
            <span>DEBT TREND</span>
            <strong>부채 감소 추이</strong>
          </div>
        </div>

        <p className="empty-message">
          거래를 입력하면 그래프가 표시됩니다.
        </p>
      </section>
    );
  }

  let currentDebt = Number(startDebt);

  const points = dailyRows.map((day) => {
    currentDebt = Math.max(
      0,
      currentDebt - day.saving - day.payment,
    );

    return {
      date: day.date,
      debt: currentDebt,
    };
  });

  const chartPoints = [
    {
      date: "START",
      debt: Number(startDebt),
    },
    ...points,
  ].slice(-12);

  const maximum = Math.max(
    ...chartPoints.map((point) => point.debt),
    1,
  );

  const minimum = Math.min(
    ...chartPoints.map((point) => point.debt),
  );

  const range = Math.max(maximum - minimum, 1);

  const polylinePoints = chartPoints
    .map((point, index) => {
      const x =
        chartPoints.length === 1
          ? 50
          : (index / (chartPoints.length - 1)) * 100;

      const y =
        88 -
        ((maximum - point.debt) / range) * 70;

      return `${x},${y}`;
    })
    .join(" ");

  const latestDebt =
    chartPoints.at(-1)?.debt ?? startDebt;

  const reducedAmount = Math.max(
    0,
    Number(startDebt) - latestDebt,
  );

  return (
    <section className="trend-card">
      <div className="trend-heading">
        <div>
          <span>DEBT TREND</span>
          <strong>부채 감소 추이</strong>
        </div>

        <p>{formatWon(reducedAmount)} 감소</p>
      </div>

      <div className="trend-chart">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-label="부채 감소 그래프"
        >
          <line
            x1="0"
            y1="18"
            x2="100"
            y2="18"
            className="trend-grid-line"
          />

          <line
            x1="0"
            y1="53"
            x2="100"
            y2="53"
            className="trend-grid-line"
          />

          <line
            x1="0"
            y1="88"
            x2="100"
            y2="88"
            className="trend-grid-line"
          />

          <polyline
            points={polylinePoints}
            className="trend-line"
          />
        </svg>
      </div>

      <div className="trend-footer">
        <span>
          시작 {formatWon(startDebt)}
        </span>

        <strong>
          현재 {formatWon(latestDebt)}
        </strong>
      </div>
    </section>
  );
}
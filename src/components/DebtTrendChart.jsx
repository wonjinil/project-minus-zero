import { formatWon } from "../utils/money.js";

export default function DebtTrendChart({
  startDebt,
  dailyRows,
}) {
  if (!startDebt || dailyRows.length === 0) {
    return (
      <section className="v8-panel v8-trend">
        <div className="v8-panel-head">
          <div>
            <span>DEBT TREND</span>
            <strong>부채 감소 추이</strong>
          </div>
        </div>

        <p className="v8-empty">
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

  const pathPoints = chartPoints
    .map((point, index) => {
      const x =
        chartPoints.length === 1
          ? 50
          : (index / (chartPoints.length - 1)) *
            100;

      const y =
        88 -
        ((maximum - point.debt) / range) * 68;

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
    <section className="v8-panel v8-trend">
      <div className="v8-panel-head">
        <div>
          <span>DEBT TREND</span>
          <strong>부채 감소 추이</strong>
        </div>

        <p>{formatWon(reducedAmount)} 감소</p>
      </div>

      <div className="v8-chart">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-label="부채 감소 그래프"
        >
          <defs>
            <linearGradient
              id="v8ChartFill"
              x1="0"
              y1="0"
              x2="0"
              y2="1"
            >
              <stop
                offset="0%"
                stopColor="#4aa3ff"
                stopOpacity="0.28"
              />
              <stop
                offset="100%"
                stopColor="#4aa3ff"
                stopOpacity="0"
              />
            </linearGradient>
          </defs>

          <line
            x1="0"
            y1="20"
            x2="100"
            y2="20"
            className="v8-chart-grid"
          />
          <line
            x1="0"
            y1="54"
            x2="100"
            y2="54"
            className="v8-chart-grid"
          />
          <line
            x1="0"
            y1="88"
            x2="100"
            y2="88"
            className="v8-chart-grid"
          />

          <polygon
            points={`0,88 ${pathPoints} 100,88`}
            className="v8-chart-area"
          />

          <polyline
            points={pathPoints}
            className="v8-chart-line"
          />
        </svg>
      </div>

      <div className="v8-chart-footer">
        <span>START {formatWon(startDebt)}</span>
        <strong>NOW {formatWon(latestDebt)}</strong>
      </div>
    </section>
  );
}

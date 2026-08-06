import { formatWon } from "../utils/money.js";

export default function MonthlySummaryCard({
  summary,
}) {
  return (
    <section className="next-goal-card">
      <div className="section-heading">
        <div>
          <span>MONTH SUMMARY</span>
          <strong>이번 달</strong>
        </div>
      </div>

      <div className="today-grid">
        <div>
          <span>총 지출</span>
          <strong className="negative-value">
            {formatWon(summary.expense)}
          </strong>
        </div>

        <div>
          <span>추가상환</span>
          <strong className="positive-value">
            {formatWon(summary.payment)}
          </strong>
        </div>

        <div>
          <span>생활세이브</span>
          <strong
            className={
              summary.saving >= 0
                ? "positive-value"
                : "negative-value"
            }
          >
            {formatWon(summary.saving)}
          </strong>
        </div>

        <div>
          <span>거래 수</span>
          <strong>
            {summary.count}건
          </strong>
        </div>
      </div>
    </section>
  );
}
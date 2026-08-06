import { useProject } from "../context/ProjectContext.jsx";
import {
  calculatePayoffDate,
  calculateProject,
  getNextTarget,
} from "../utils/calculations.js";
import { formatWon } from "../utils/money.js";

function formatDate(value) {
  if (!value) return "-";

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

export default function HomePage() {
  const {
    project,
    transactions,
    dataLoading,
    syncError,
  } = useProject();

  const result = calculateProject(project, transactions);
  const configured = result.startDebt > 0;

  const payoffDate = calculatePayoffDate(
    project,
    result.currentDebt,
  );

  const nextTarget = getNextTarget(
    result.startDebt,
    result.currentDebt,
  );

  const latestDay = result.dailyRows.at(-1);

  if (dataLoading) {
    return (
      <section className="home-loading-card">
        클라우드 데이터를 불러오고 있습니다.
      </section>
    );
  }

  return (
    <div className="home-page">
      {syncError && (
        <div className="sync-error">
          {syncError}
        </div>
      )}

      <section className="hero-card">
        <div className="hero-top">
          <div>
            <p className="hero-label">CURRENT</p>

            <strong className="hero-current">
              {configured
                ? formatWon(result.currentDebt)
                : "-"}
            </strong>
          </div>

          <div className="progress-circle">
            <span>
              {configured
                ? `${result.progress.toFixed(0)}%`
                : "-"}
            </span>
          </div>
        </div>

        <p className="hero-message">
          {configured
            ? result.currentDebt === 0
              ? "PROJECT COMPLETE 🎉"
              : `${formatWon(
                  result.recovered,
                )} 회복했습니다.`
            : "설정에서 시작 부채를 입력하세요."}
        </p>

        <div className="hero-progress-track">
          <div
            className="hero-progress-bar"
            style={{
              width: `${result.progress}%`,
            }}
          />
        </div>
      </section>

      <section className="home-stat-grid">
        <article className="home-stat-card">
          <span>시작 부채</span>
          <strong>
            {configured
              ? formatWon(result.startDebt)
              : "-"}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>총 회복액</span>
          <strong className="positive-value">
            {configured
              ? formatWon(result.recovered)
              : "-"}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>생활세이브</span>
          <strong
            className={
              result.totalSaving >= 0
                ? "positive-value"
                : "negative-value"
            }
          >
            {configured
              ? formatWon(result.totalSaving)
              : "-"}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>추가상환</span>
          <strong className="positive-value">
            {configured
              ? formatWon(result.totalPayment)
              : "-"}
          </strong>
        </article>
      </section>

      <section className="next-goal-card">
        <div className="section-heading">
          <div>
            <span>NEXT GOAL</span>

            <strong>
              {configured
                ? formatWon(nextTarget.target)
                : "설정 필요"}
            </strong>
          </div>

          <p>
            {configured
              ? `${formatWon(
                  nextTarget.remaining,
                )} 남음`
              : "-"}
          </p>
        </div>

        <div className="next-goal-track">
          <div
            className="next-goal-bar"
            style={{
              width: `${result.progress}%`,
            }}
          />
        </div>
      </section>

      <section className="today-card">
        <div className="section-heading">
          <div>
            <span>TODAY</span>
            <strong>
              {latestDay?.date || "기록 없음"}
            </strong>
          </div>

          <p>
            {latestDay
              ? latestDay.saving >= 0
                ? "절약 성공"
                : "목표 초과"
              : "-"}
          </p>
        </div>

        <div className="today-grid">
          <div>
            <span>목표지출</span>
            <strong>
              {latestDay
                ? formatWon(latestDay.target)
                : "-"}
            </strong>
          </div>

          <div>
            <span>실제지출</span>
            <strong>
              {latestDay
                ? formatWon(latestDay.expense)
                : "-"}
            </strong>
          </div>

          <div>
            <span>생활세이브</span>
            <strong
              className={
                latestDay?.saving >= 0
                  ? "positive-value"
                  : "negative-value"
              }
            >
              {latestDay
                ? formatWon(latestDay.saving)
                : "-"}
            </strong>
          </div>
        </div>
      </section>

      <section className="payoff-card">
        <span>예상 완납일</span>

        <strong>
          {configured
            ? formatDate(payoffDate)
            : "-"}
        </strong>

        <p>
          월 목표상환액을 기준으로 계산합니다.
        </p>
      </section>
    </div>
  );
}
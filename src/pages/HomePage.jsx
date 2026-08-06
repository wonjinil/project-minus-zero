import { useProject } from "../context/ProjectContext.jsx";
import {
  calculatePayoffDate,
  calculateProject,
  getNextTarget,
} from "../utils/calculations.js";
import { calculateGameStats } from "../utils/game.js";
import { formatWon } from "../utils/money.js";
import DebtTrendChart from "../components/DebtTrendChart.jsx";

function formatDate(value) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("ko-KR").format(
    new Date(`${value}T00:00:00`)
  );
}

export default function HomePage() {
  const { project, transactions, dataLoading, syncError } = useProject();

  const result = calculateProject(project, transactions);
  const game = calculateGameStats(result);

  if (dataLoading) {
    return <section className="home-loading-card">클라우드 데이터를 불러오는 중...</section>;
  }

  const latestDay = result.dailyRows.at(-1);
  const payoffDate = calculatePayoffDate(project, result.currentDebt);
  const nextGoal = getNextTarget(result.startDebt, result.currentDebt);

  return (
    <div className="home-page">
      {syncError && <div className="sync-error">{syncError}</div>}

      <section className="hero-card">
        <div className="hero-top">
          <div>
            <p className="hero-label">CURRENT</p>
            <strong className="hero-current">{formatWon(result.currentDebt)}</strong>
          </div>
          <div className="progress-circle">
            <span>{result.progress.toFixed(0)}%</span>
          </div>
        </div>

        <p className="hero-message">
          {formatWon(result.recovered)} 회복했습니다.
        </p>

        <div className="hero-progress-track">
          <div
            className="hero-progress-bar"
            style={{ width: `${result.progress}%` }}
          />
        </div>
      </section>

      <section className="next-goal-card">
        <div className="section-heading">
          <div>
            <span>LEVEL</span>
            <strong>LV. {game.level}</strong>
          </div>
          <p>🔥 {game.streak}일 연속</p>
        </div>

        <div className="next-goal-track">
          <div
            className="next-goal-bar"
            style={{ width: `${game.levelProgress}%` }}
          />
        </div>
      </section>

      <DebtTrendChart
        startDebt={result.startDebt}
        dailyRows={result.dailyRows}
      />

      <section className="today-card">
        <div className="section-heading">
          <div>
            <span>NEXT GOAL</span>
            <strong>{formatWon(nextGoal.target)}</strong>
          </div>
          <p>{formatWon(nextGoal.remaining)} 남음</p>
        </div>

        <div className="today-grid">
          <div>
            <span>오늘 절약</span>
            <strong>{latestDay ? formatWon(latestDay.saving) : "-"}</strong>
          </div>
          <div>
            <span>추가상환</span>
            <strong>{latestDay ? formatWon(latestDay.payment) : "-"}</strong>
          </div>
          <div>
            <span>완납예상</span>
            <strong>{payoffDate || "-"}</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

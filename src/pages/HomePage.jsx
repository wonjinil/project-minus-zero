import { useProject } from "../context/ProjectContext.jsx";

import AchievementCard from "../components/AchievementCard.jsx";
import BadgeCard from "../components/BadgeCard.jsx";
import CircularProgress from "../components/CircularProgress.jsx";
import DebtTrendChart from "../components/DebtTrendChart.jsx";
import ExperienceCard from "../components/ExperienceCard.jsx";

import useAnimatedNumber from "../hooks/useAnimatedNumber.js";

import {
  calculatePayoffDate,
  calculateProject,
  getNextTarget,
} from "../utils/calculations.js";
import { calculateExperience } from "../utils/experience.js";
import { calculateGameStats } from "../utils/game.js";
import { getLevelTitle } from "../utils/level.js";
import { formatWon } from "../utils/money.js";

function formatDate(value) {
  if (!value) return "-";

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(`${value}T00:00:00`));
}

export default function HomePage() {
  const {
    project,
    transactions,
    dataLoading,
    syncError,
  } = useProject();

  const result = calculateProject(project, transactions);
  const game = calculateGameStats(result);
  const experience = calculateExperience(result, game.streak);

  const animatedDebt = useAnimatedNumber(
    result.currentDebt,
    700,
  );

  const configured = result.startDebt > 0;
  const latestDay = result.dailyRows.at(-1);

  const payoffDate = calculatePayoffDate(
    project,
    result.currentDebt,
  );

  const nextTarget = getNextTarget(
    result.startDebt,
    result.currentDebt,
  );

  const gameStats = {
    recovered: result.recovered,
    streak: game.streak,
    level: experience.level,
  };

  if (dataLoading) {
    return (
      <section className="v11-loading">
        Loading your progress...
      </section>
    );
  }

  return (
    <div className="v11-home">
      {syncError && (
        <div className="sync-error">{syncError}</div>
      )}

      <section className="v11-balance-card">
        <div className="v11-balance-glow" />

        <div className="v11-balance-copy">
          <div className="v11-balance-label-row">
            <span>REMAINING DEBT</span>
            <small>LIVE STATUS</small>
          </div>

          <strong className="v11-balance-number">
            {configured
              ? formatWon(animatedDebt)
              : "-"}
          </strong>

          <p className="v11-balance-caption">
            {configured
              ? `${formatWon(result.recovered)} recovered`
              : "설정에서 시작 부채를 입력하세요."}
          </p>

          <div className="v11-status-row">
            <span>LV. {experience.level}</span>
            <span>{getLevelTitle(experience.level)}</span>
            <span>{game.streak} day streak</span>
          </div>
        </div>

        <div className="v11-balance-ring">
          <CircularProgress
            value={result.progress}
            size={112}
            stroke={8}
          />
        </div>
      </section>

      <section className="v11-insight-grid">
        <article className="v11-insight-card accent-blue">
          <div className="v11-insight-top">
            <span>TODAY</span>
            <small>{latestDay?.date || "No record"}</small>
          </div>

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

          <div className="v11-insight-bottom">
            <span>Payment</span>
            <b>
              {latestDay
                ? formatWon(latestDay.payment)
                : "-"}
            </b>
          </div>
        </article>

        <article className="v11-insight-card accent-mint">
          <div className="v11-insight-top">
            <span>NEXT TARGET</span>
            <small>
              {configured
                ? `${formatWon(nextTarget.remaining)} left`
                : "Not configured"}
            </small>
          </div>

          <strong>
            {configured
              ? formatWon(nextTarget.target)
              : "-"}
          </strong>

          <div className="v11-insight-bottom">
            <span>Est. payoff</span>
            <b>
              {configured
                ? formatDate(payoffDate)
                : "-"}
            </b>
          </div>
        </article>
      </section>

      <section className="v11-progress-card">
        <div className="v11-progress-head">
          <div>
            <span>PROJECT PROGRESS</span>
            <strong>{result.progress.toFixed(0)}%</strong>
          </div>

          <p>{formatWon(result.recovered)}</p>
        </div>

        <div className="v11-progress-track">
          <div
            className="v11-progress-fill"
            style={{
              width: `${result.progress}%`,
            }}
          />
        </div>

        <div className="v11-progress-meta">
          <span>START {formatWon(result.startDebt)}</span>
          <span>NOW {formatWon(result.currentDebt)}</span>
        </div>
      </section>

      <div className="v11-section-label">
        <span>GROWTH</span>
        <strong>Momentum</strong>
      </div>

      <ExperienceCard experience={experience} />

      <div className="v11-section-label">
        <span>INSIGHT</span>
        <strong>Debt Movement</strong>
      </div>

      <DebtTrendChart
        startDebt={result.startDebt}
        dailyRows={result.dailyRows}
      />

      <div className="v11-section-label">
        <span>MILESTONES</span>
        <strong>Rewards</strong>
      </div>

      <BadgeCard stats={gameStats} />
      <AchievementCard stats={gameStats} />
    </div>
  );
}

import { useProject } from "../context/ProjectContext";
import CurrentCard from "../components/CurrentCard";
import SummaryCard from "../components/SummaryCard";
import {
  calculatePayoffDate,
  calculateProject,
} from "../utils/calculations";

function formatWon(value) {
  return `${Math.round(Number(value || 0)).toLocaleString("ko-KR")}원`;
}

function formatDate(value) {
  if (!value) {
    return "-";
  }

  const date = new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function HomePage() {
  const { project, transactions } = useProject();

  const result = calculateProject(project, transactions);

  const payoffDate = calculatePayoffDate(
    project,
    result.currentDebt,
  );

  const isConfigured = result.startDebt > 0;

  const targetStep = result.startDebt > 0
    ? Math.max(
        100000,
        Math.round(result.startDebt / 12 / 100000) * 100000,
      )
    : 0;

  const nextTarget =
    result.currentDebt > 0 && targetStep > 0
      ? Math.max(
          0,
          Math.floor((result.currentDebt - 1) / targetStep) *
            targetStep,
        )
      : 0;

  const remainingToTarget = Math.max(
    0,
    result.currentDebt - nextTarget,
  );

  return (
    <>
      <CurrentCard />

      <section className="summary-grid">
        <SummaryCard
          title="시작 부채"
          value={
            isConfigured
              ? formatWon(result.startDebt)
              : "-"
          }
        />

        <SummaryCard
          title="총 회복액"
          value={
            isConfigured
              ? formatWon(result.recovered)
              : "-"
          }
        />

        <SummaryCard
          title="진행률"
          value={
            isConfigured
              ? `${result.progress.toFixed(1)}%`
              : "-"
          }
        />

        <SummaryCard
          title="예상 완납일"
          value={
            isConfigured
              ? formatDate(payoffDate)
              : "-"
          }
        />
      </section>

      <section className="goal-card">
        <div className="goal-header">
          <span>다음 목표</span>

          <strong>
            {isConfigured
              ? `${formatWon(nextTarget)}까지 ${formatWon(
                  remainingToTarget,
                )}`
              : "설정 필요"}
          </strong>
        </div>

        <div className="progress-track">
          <div
            className="progress-bar"
            style={{
              width: `${result.progress}%`,
            }}
          />
        </div>
      </section>
    </>
  );
}

export default HomePage;
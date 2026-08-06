import { useProject } from "../context/ProjectContext";
import { calculateProject } from "../utils/calculations";

function formatWon(value) {
  return `${Math.round(Number(value || 0)).toLocaleString(
    "ko-KR",
  )}원`;
}

function CurrentCard() {
  const { project, transactions } = useProject();

  const result = calculateProject(
    project,
    transactions,
  );

  const isConfigured = result.startDebt > 0;

  return (
    <section className="current-card">
      <p className="card-label">CURRENT</p>

      <strong className="current-value">
        {isConfigured
          ? formatWon(result.currentDebt)
          : "-"}
      </strong>

      <p className="card-caption">
        {isConfigured
          ? `생활세이브 ${formatWon(
              result.totalSaving,
            )} · 추가상환 ${formatWon(
              result.totalPayment,
            )}`
          : "설정에서 시작 부채를 입력하세요."}
      </p>
    </section>
  );
}

export default CurrentCard;
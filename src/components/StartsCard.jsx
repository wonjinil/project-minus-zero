import { formatWon } from "../utils/money.js";

export default function StatsCard({
  title,
  value,
  color = "default",
  subtitle,
}) {
  const className =
    color === "green"
      ? "positive-value"
      : color === "red"
      ? "negative-value"
      : "";

  return (
    <article className="home-stat-card">
      <span>{title}</span>

      <strong className={className}>
        {typeof value === "number"
          ? formatWon(value)
          : value}
      </strong>

      {subtitle && (
        <small
          style={{
            display: "block",
            marginTop: 6,
            color: "#6b7b8c",
            fontSize: 11,
          }}
        >
          {subtitle}
        </small>
      )}
    </article>
  );
}
import { getBadges } from "../utils/badges.js";

export default function BadgeCard({ stats }) {
  const badges = getBadges(stats);

  return (
    <section className="v8-panel v8-badges">
      <div className="v8-panel-head">
        <div>
          <span>BADGES</span>
          <strong>{badges.length}개 획득</strong>
        </div>
      </div>

      <div className="v8-badge-row">
        {badges.map((badge) => (
          <div
            className="v8-badge-chip"
            key={badge.id || badge.title}
          >
            <span>{badge.icon}</span>
            <strong>{badge.title}</strong>
          </div>
        ))}
      </div>
    </section>
  );
}

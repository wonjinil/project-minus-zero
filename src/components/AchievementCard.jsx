import { getAchievements } from "../utils/achievement.js";

export default function AchievementCard({
  stats,
}) {
  const achievements = getAchievements(stats);

  return (
    <section className="v8-panel v8-achievements">
      <div className="v8-panel-head">
        <div>
          <span>ACHIEVEMENTS</span>
          <strong>
            {achievements.length}개 달성
          </strong>
        </div>
      </div>

      {achievements.length === 0 ? (
        <p className="v8-empty">
          아직 달성한 업적이 없습니다.
        </p>
      ) : (
        <div className="v8-achievement-grid">
          {achievements.map((item) => (
            <article key={item.id}>
              <span>{item.icon}</span>
              <strong>{item.title}</strong>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

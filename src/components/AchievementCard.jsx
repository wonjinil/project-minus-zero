import { getAchievements } from "../utils/achievement.js";

export default function AchievementCard({
  stats,
}) {
  const achievements =
    getAchievements(stats);

  return (
    <section className="next-goal-card">
      <div className="section-heading">
        <div>
          <span>ACHIEVEMENTS</span>
          <strong>
            {achievements.length}개 달성
          </strong>
        </div>
      </div>

      {achievements.length === 0 ? (
        <p
          style={{
            marginTop: 16,
            color: "#6b7b8c",
          }}
        >
          아직 달성한 업적이 없습니다.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: 10,
            marginTop: 16,
          }}
        >
          {achievements.map(
            (achievement) => (
              <div
                key={achievement.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: 14,
                  border: "1px solid #dbe4ec",
                  borderRadius: 14,
                  background: "#f8fbff",
                }}
              >
                <span
                  style={{
                    fontSize: 28,
                  }}
                >
                  {achievement.icon}
                </span>

                <strong>
                  {achievement.title}
                </strong>
              </div>
            ),
          )}
        </div>
      )}
    </section>
  );
}
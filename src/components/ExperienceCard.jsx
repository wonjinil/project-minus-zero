import { formatWon } from "../utils/money.js";

export default function ExperienceCard({ experience }) {
  return (
    <section className="next-goal-card">
      <div className="section-heading">
        <div>
          <span>EXPERIENCE</span>
          <strong>LV. {experience.level}</strong>
        </div>

        <p>
          {experience.currentLevelExp} / {experience.nextLevelExp} EXP
        </p>
      </div>

      <div className="next-goal-track">
        <div
          className="next-goal-bar"
          style={{
            width: `${experience.progress}%`,
          }}
        />
      </div>

      <div className="today-grid">
        <div>
          <span>TOTAL EXP</span>
          <strong>{experience.exp}</strong>
        </div>

        <div>
          <span>LEVEL</span>
          <strong>{experience.level}</strong>
        </div>

        <div>
          <span>NEXT</span>
          <strong>
            {experience.nextLevelExp -
              experience.currentLevelExp}
          </strong>
        </div>
      </div>
    </section>
  );
}
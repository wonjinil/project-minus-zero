export default function ExperienceCard({ experience }) {
  const remaining =
    experience.nextLevelExp -
    experience.currentLevelExp;

  return (
    <section className="v8-panel v8-experience">
      <div className="v8-panel-head">
        <div>
          <span>EXPERIENCE</span>
          <strong>LV. {experience.level}</strong>
        </div>

        <p>
          {experience.currentLevelExp} /{" "}
          {experience.nextLevelExp} EXP
        </p>
      </div>

      <div className="v8-exp-track">
        <div
          className="v8-exp-fill"
          style={{
            width: `${experience.progress}%`,
          }}
        />
      </div>

      <div className="v8-exp-grid">
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
          <strong>{remaining}</strong>
        </div>
      </div>
    </section>
  );
}

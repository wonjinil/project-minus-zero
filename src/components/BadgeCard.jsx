import {getBadges} from "../utils/badges.js";

export default function BadgeCard({stats}){
  const badges=getBadges(stats);
  return (
    <section className="next-goal-card">
      <div className="section-heading">
        <div>
          <span>BADGES</span>
          <strong>{badges.length}개 획득</strong>
        </div>
      </div>

      <div style={{display:"flex",flexWrap:"wrap",gap:"10px",marginTop:"14px"}}>
        {badges.map((b)=>(
          <div key={b.title}
            style={{
              padding:"10px 14px",
              borderRadius:"999px",
              background:"#f5f8fb",
              border:"1px solid #dbe4ec",
              fontWeight:700
            }}>
            {b.icon} {b.title}
          </div>
        ))}
      </div>
    </section>
  );
}

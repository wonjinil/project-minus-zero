function getMonthDays(monthValue) {
  const [year, month] = monthValue.split("-").map(Number);
  const firstDay = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();

  return {
    firstDay,
    days: Array.from({ length: lastDate }, (_, index) => index + 1),
  };
}

export default function SavingsCalendar({
  month,
  dailyRows,
}) {
  const { firstDay, days } = getMonthDays(month);

  const dayMap = new Map(
    dailyRows.map((day) => [
      Number(day.date.slice(-2)),
      day,
    ]),
  );

  return (
    <section className="next-goal-card">
      <div className="section-heading">
        <div>
          <span>CALENDAR</span>
          <strong>{month}</strong>
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: 6,
          marginTop: 14,
          textAlign: "center",
        }}
      >
        {["일", "월", "화", "수", "목", "금", "토"].map(
          (label) => (
            <strong
              key={label}
              style={{
                padding: "6px 0",
                color: "#6b7b8c",
                fontSize: 11,
              }}
            >
              {label}
            </strong>
          ),
        )}

        {Array.from({ length: firstDay }).map((_, index) => (
          <span key={`empty-${index}`} />
        ))}

        {days.map((dayNumber) => {
          const day = dayMap.get(dayNumber);
          const successful = day && day.saving >= 0;
          const failed = day && day.saving < 0;

          return (
            <div
              key={dayNumber}
              title={
                day
                  ? successful
                    ? "절약 성공"
                    : "목표 초과"
                  : "기록 없음"
              }
              style={{
                display: "grid",
                minHeight: 42,
                placeItems: "center",
                border: "1px solid #dbe4ec",
                borderRadius: 10,
                background: successful
                  ? "#e8f6ee"
                  : failed
                  ? "#fdecec"
                  : "#f5f8fb",
                color: successful
                  ? "#2e8b57"
                  : failed
                  ? "#c63f3f"
                  : "#6b7b8c",
                fontSize: 12,
                fontWeight: 800,
              }}
            >
              {dayNumber}
            </div>
          );
        })}
      </div>
    </section>
  );
}
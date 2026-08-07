import { useMemo, useState } from "react";
import { useProject } from "../context/ProjectContext.jsx";
import { calculateProject } from "../utils/calculations.js";
import { formatWon } from "../utils/money.js";

function getCurrentMonth() {
  return new Date().toISOString().slice(0, 7);
}

function getMonthLabel(monthValue) {
  const [year, month] = monthValue.split("-");
  return `${year}년 ${Number(month)}월`;
}

function getCalendarCells(monthValue, monthRows) {
  const [year, month] = monthValue.split("-").map(Number);
  const firstWeekday = new Date(year, month - 1, 1).getDay();
  const lastDate = new Date(year, month, 0).getDate();
  const rowMap = new Map(
    monthRows.map((day) => [Number(day.date.slice(-2)), day]),
  );

  return [
    ...Array.from({ length: firstWeekday }, (_, index) => ({
      key: `empty-${index}`,
      empty: true,
    })),
    ...Array.from({ length: lastDate }, (_, index) => {
      const dayNumber = index + 1;
      return {
        key: `day-${dayNumber}`,
        dayNumber,
        row: rowMap.get(dayNumber),
      };
    }),
  ];
}

export default function DailyPage() {
  const { project, transactions } = useProject();
  const [selectedMonth, setSelectedMonth] = useState(
    getCurrentMonth(),
  );

  const result = calculateProject(project, transactions);

  const monthRows = useMemo(
    () =>
      result.dailyRows
        .filter((day) => day.date.startsWith(selectedMonth))
        .sort((a, b) => b.date.localeCompare(a.date)),
    [result.dailyRows, selectedMonth],
  );

  const summary = useMemo(
    () =>
      monthRows.reduce(
        (current, day) => ({
          target: current.target + day.target,
          expense: current.expense + day.expense,
          saving: current.saving + day.saving,
          payment: current.payment + day.payment,
          successDays:
            current.successDays + (day.saving >= 0 ? 1 : 0),
        }),
        {
          target: 0,
          expense: 0,
          saving: 0,
          payment: 0,
          successDays: 0,
        },
      ),
    [monthRows],
  );

  const calendarCells = useMemo(
    () => getCalendarCells(selectedMonth, monthRows),
    [selectedMonth, monthRows],
  );

  return (
    <section className="v9-daily-shell">
      <header className="v9-page-heading">
        <span>DAILY COMMAND</span>
        <h2>Daily</h2>
        <p>매일의 지출과 절약 성과를 한눈에 확인합니다.</p>
      </header>

      <section className="v9-daily-hero">
        <div>
          <span>{getMonthLabel(selectedMonth)}</span>
          <strong>{formatWon(summary.saving)}</strong>
          <p>이번 달 생활세이브</p>
        </div>

        <label>
          MONTH
          <input
            type="month"
            value={selectedMonth}
            onChange={(event) =>
              setSelectedMonth(event.target.value)
            }
          />
        </label>
      </section>

      <section className="v9-daily-kpis">
        <article>
          <span>TARGET</span>
          <strong>{formatWon(summary.target)}</strong>
        </article>

        <article>
          <span>SPENT</span>
          <strong className="negative-value">
            {formatWon(summary.expense)}
          </strong>
        </article>

        <article>
          <span>PAYMENT</span>
          <strong className="positive-value">
            {formatWon(summary.payment)}
          </strong>
        </article>

        <article>
          <span>SUCCESS</span>
          <strong>{summary.successDays}일</strong>
        </article>
      </section>

      <section className="v9-calendar-panel">
        <div className="v9-panel-title">
          <span>MONTH VIEW</span>
          <strong>절약 캘린더</strong>
        </div>

        <div className="v9-calendar-weekdays">
          {[
            "SUN",
            "MON",
            "TUE",
            "WED",
            "THU",
            "FRI",
            "SAT",
          ].map((label) => (
            <span key={label}>{label}</span>
          ))}
        </div>

        <div className="v9-calendar-grid">
          {calendarCells.map((cell) => {
            if (cell.empty) {
              return <span key={cell.key} />;
            }

            const saving = cell.row?.saving;
            const state =
              saving == null
                ? "empty"
                : saving >= 0
                  ? "success"
                  : "failed";

            return (
              <article
                key={cell.key}
                className={`v9-calendar-day ${state}`}
              >
                <strong>{cell.dayNumber}</strong>
                <span>
                  {saving == null ? "-" : formatWon(saving)}
                </span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="v9-daily-list-panel">
        <div className="v9-panel-title">
          <span>DAILY LOG</span>
          <strong>{monthRows.length}일 기록</strong>
        </div>

        {monthRows.length === 0 ? (
          <p className="v9-daily-empty">
            선택한 달에 기록이 없습니다.
          </p>
        ) : (
          <div className="v9-daily-list">
            {monthRows.map((day) => (
              <article className="v9-daily-row" key={day.date}>
                <div className="v9-daily-row-head">
                  <div>
                    <span>DATE</span>
                    <strong>{day.date}</strong>
                  </div>

                  <b
                    className={
                      day.saving >= 0
                        ? "v9-day-success"
                        : "v9-day-failed"
                    }
                  >
                    {day.saving >= 0 ? "절약 성공" : "목표 초과"}
                  </b>
                </div>

                <dl>
                  <div>
                    <dt>목표지출</dt>
                    <dd>{formatWon(day.target)}</dd>
                  </div>
                  <div>
                    <dt>실제지출</dt>
                    <dd>{formatWon(day.expense)}</dd>
                  </div>
                  <div>
                    <dt>생활세이브</dt>
                    <dd
                      className={
                        day.saving >= 0
                          ? "positive-value"
                          : "negative-value"
                      }
                    >
                      {formatWon(day.saving)}
                    </dd>
                  </div>
                  <div>
                    <dt>추가상환</dt>
                    <dd className="positive-value">
                      {formatWon(day.payment)}
                    </dd>
                  </div>
                </dl>
              </article>
            ))}
          </div>
        )}
      </section>
    </section>
  );
}

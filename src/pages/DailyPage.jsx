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

export default function DailyPage() {
  const { project, transactions } = useProject();
  const [selectedMonth, setSelectedMonth] =
    useState(getCurrentMonth());

  const result = calculateProject(project, transactions);

  const monthRows = useMemo(
    () =>
      result.dailyRows
        .filter((day) =>
          day.date.startsWith(selectedMonth),
        )
        .sort((a, b) =>
          b.date.localeCompare(a.date),
        ),
    [result.dailyRows, selectedMonth],
  );

  const monthSummary = useMemo(
    () =>
      monthRows.reduce(
        (summary, day) => ({
          target: summary.target + day.target,
          expense: summary.expense + day.expense,
          saving: summary.saving + day.saving,
          payment: summary.payment + day.payment,
          successDays:
            summary.successDays +
            (day.saving >= 0 ? 1 : 0),
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

  return (
    <section className="page-card">
      <h2>일별 요약</h2>

      <label
        style={{
          display: "grid",
          gap: "7px",
          marginBottom: "18px",
          color: "#6b7b8c",
          fontSize: "13px",
          fontWeight: 800,
        }}
      >
        조회 월
        <input
          type="month"
          value={selectedMonth}
          onChange={(event) =>
            setSelectedMonth(event.target.value)
          }
        />
      </label>

      <section
        style={{
          padding: "17px",
          marginBottom: "14px",
          border: "1px solid #dbe4ec",
          borderRadius: "18px",
          background: "#102a43",
          color: "white",
        }}
      >
        <span
          style={{
            fontSize: "12px",
            opacity: 0.7,
          }}
        >
          {getMonthLabel(selectedMonth)}
        </span>

        <strong
          style={{
            display: "block",
            marginTop: "7px",
            fontSize: "25px",
          }}
        >
          {formatWon(monthSummary.saving)}
        </strong>

        <p
          style={{
            margin: "7px 0 0",
            fontSize: "13px",
            opacity: 0.78,
          }}
        >
          이번 달 생활세이브
        </p>
      </section>

      <section
        className="home-stat-grid"
        style={{ marginBottom: "15px" }}
      >
        <article className="home-stat-card">
          <span>목표지출 합계</span>
          <strong>
            {formatWon(monthSummary.target)}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>실제지출 합계</span>
          <strong className="negative-value">
            {formatWon(monthSummary.expense)}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>추가상환 합계</span>
          <strong className="positive-value">
            {formatWon(monthSummary.payment)}
          </strong>
        </article>

        <article className="home-stat-card">
          <span>절약 성공일</span>
          <strong>
            {monthSummary.successDays}일
          </strong>
        </article>
      </section>

      {monthRows.length === 0 ? (
        <p className="empty-message">
          선택한 달에 기록이 없습니다.
        </p>
      ) : (
        monthRows.map((day) => (
          <article
            className="daily-card"
            key={day.date}
          >
            <div className="daily-title">
              <strong>{day.date}</strong>

              <span
                className={
                  day.saving >= 0
                    ? "saving-positive"
                    : "saving-negative"
                }
              >
                {day.saving >= 0
                  ? "● 절약 성공"
                  : "● 목표 초과"}
              </span>
            </div>

            <dl>
              <div>
                <dt>하루 목표지출</dt>
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
        ))
      )}
    </section>
  );
}
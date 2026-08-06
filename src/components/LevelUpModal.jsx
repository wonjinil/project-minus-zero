import { useEffect, useState } from "react";

export default function LevelUpModal({
  level,
}) {
  const [visible, setVisible] =
    useState(false);

  useEffect(() => {
    if (!level) return;

    setVisible(true);

    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [level]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "grid",
        placeItems: "center",
        background:
          "rgba(0,0,0,.35)",
        zIndex: 999,
      }}
    >
      <div
        style={{
          width: 300,
          padding: 24,
          borderRadius: 24,
          background: "white",
          textAlign: "center",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.18)",
        }}
      >
        <div
          style={{
            fontSize: 56,
          }}
        >
          🎉
        </div>

        <h2
          style={{
            margin: "10px 0 6px",
          }}
        >
          LEVEL UP!
        </h2>

        <h1
          style={{
            margin: 0,
            color: "#2f80ed",
          }}
        >
          LV. {level}
        </h1>

        <p
          style={{
            color: "#6b7b8c",
          }}
        >
          계속 PROJECT MINUS ZERO를
          진행하세요!
        </p>
      </div>
    </div>
  );
}
export default function QuickActionCard({
  title,
  value,
  icon,
  onClick,
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        width: "100%",
        padding: "18px",
        border: "1px solid #dbe4ec",
        borderRadius: "18px",
        background: "white",
        textAlign: "left",
        cursor: "pointer",
        transition: ".2s",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 30,
          }}
        >
          {icon}
        </span>

        <span
          style={{
            fontSize: 12,
            color: "#6b7b8c",
            fontWeight: 700,
          }}
        >
          QUICK
        </span>
      </div>

      <h3
        style={{
          marginTop: 16,
          marginBottom: 4,
          color: "#102a43",
        }}
      >
        {title}
      </h3>

      <p
        style={{
          margin: 0,
          color: "#2f80ed",
          fontWeight: 800,
          fontSize: 18,
        }}
      >
        {value}
      </p>
    </button>
  );
}
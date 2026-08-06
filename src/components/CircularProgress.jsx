export default function CircularProgress({
  value = 0,
  size = 120,
  stroke = 10,
}) {
  const radius =
    (size - stroke) / 2;

  const circumference =
    2 * Math.PI * radius;

  const offset =
    circumference -
    (value / 100) * circumference;

  return (
    <svg
      width={size}
      height={size}
      style={{
        transform: "rotate(-90deg)",
      }}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#edf3f8"
        strokeWidth={stroke}
      />

      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="#2f80ed"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        style={{
          transition:
            "stroke-dashoffset .8s ease",
        }}
      />

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dy=".35em"
        fill="#102a43"
        fontSize="20"
        fontWeight="700"
        transform={`rotate(90 ${size / 2} ${
          size / 2
        })`}
      >
        {Math.round(value)}%
      </text>
    </svg>
  );
}
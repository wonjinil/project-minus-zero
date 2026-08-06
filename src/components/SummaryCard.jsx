function SummaryCard({ title, value }) {
  return (
    <article className="summary-card">
      <p>{title}</p>

      <strong>{value}</strong>
    </article>
  );
}

export default SummaryCard;
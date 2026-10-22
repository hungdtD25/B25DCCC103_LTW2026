export default function AudienceChart({
  percentages
}) {
  const letters = ["A", "B", "C", "D"];

  return (
    <div className="audience-chart">
      {percentages.map((value, i) => (
        <div
          className="chart-column"
          key={letters[i]}
        >
          <strong>{value}%</strong>

          <div className="bar-wrap">
            <div
              className="bar"
              style={{ height: `${value}%` }}
            />
          </div>

          <b>{letters[i]}</b>
        </div>
      ))}
    </div>
  );
}
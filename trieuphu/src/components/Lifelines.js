export default function Lifelines({
  used,
  onFifty,
  onAudience,
  onStop,
  locked
}) {
  return (
    <div className="lifelines">
      <button
        disabled={locked || used.fifty}
        onClick={onFifty}
      >
        50:50 {used.fifty ? "✓" : ""}
      </button>

      <button
        disabled={locked || used.audience}
        onClick={onAudience}
      >
        Hỏi khán giả {used.audience ? "✓" : ""}
      </button>

      <button
        disabled={locked}
        onClick={onStop}
      >
        Dừng cuộc chơi
      </button>
    </div>
  );
}
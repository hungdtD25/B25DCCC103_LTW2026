const LETTERS = ["A", "B", "C", "D"];

export default function AnswerButton({
  index,
  text,
  onClick,
  disabled,
  status
}) {
  return (
    <button
      className={`answer ${status || ""}`}
      disabled={disabled}
      onClick={onClick}
    >
      <b>{LETTERS[index]}.</b>
      <span>{text}</span>
    </button>
  );
}
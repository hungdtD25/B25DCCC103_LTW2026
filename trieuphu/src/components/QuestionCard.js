export default function QuestionCard({
  index,
  total,
  question
}) {
  return (
    <section className="question-card">
      <div className="eyebrow">
        CÂU {index + 1}/{total}
      </div>

      <h2>
        {question?.question ||
          "Đang tải câu hỏi..."}
      </h2>
    </section>
  );
}
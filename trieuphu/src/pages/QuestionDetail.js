import {
  Link,
  useParams
} from "react-router-dom";

export default function QuestionDetail({
  questions,
  loading
}) {
  const { id } = useParams();

  const question = questions.find(
    (q) => q.id === Number(id)
  );

  if (loading) {
    return <p>Đang tải câu hỏi...</p>;
  }

  if (!question) {
    return (
      <section className="panel center">
        <h1>Không tìm thấy câu hỏi</h1>

        <Link to="/questions">
          Quay lại ngân hàng câu hỏi
        </Link>
      </section>
    );
  }

  return (
    <section className="panel">
      <p className="eyebrow">
        CÂU HỎI #{question.id} ·{" "}
        {question.level}
      </p>

      <h1>{question.question}</h1>

      <div className="detail-options">
        {question.options.map(
          (option, i) => (
            <div
              key={option}
              className={
                i === question.answer
                  ? "detail-correct"
                  : ""
              }
            >
              <b>
                {["A", "B", "C", "D"][i]}.
              </b>{" "}
              {option}

              {i === question.answer && (
                <strong>
                  {" "}(Đáp án đúng)
                </strong>
              )}
            </div>
          )
        )}
      </div>

      <p>{question.explanation}</p>

      <Link to="/questions">
        ← Quay lại
      </Link>
    </section>
  );
}
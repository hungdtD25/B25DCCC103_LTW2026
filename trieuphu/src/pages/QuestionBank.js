import {
  useMemo,
  useState
} from "react";

import { Link } from "react-router-dom";

export default function QuestionBank({
  questions,
  loading,
  error
}) {
  const [level, setLevel] =
    useState("Tất cả");

  const filtered = useMemo(
    () =>
      level === "Tất cả"
        ? questions
        : questions.filter(
            (q) => q.level === level
          ),
    [questions, level]
  );

  return (
    <section>
      <div className="page-heading">
        <p className="eyebrow">DỮ LIỆU</p>
        <h1>Ngân hàng câu hỏi</h1>
        <p>
          Xem và lọc câu hỏi theo mức độ.
        </p>
      </div>

      <div className="filter-row">
        <label htmlFor="level">
          Mức độ
        </label>

        <select
          id="level"
          value={level}
          onChange={(e) =>
            setLevel(e.target.value)
          }
        >
          <option>Tất cả</option>
          <option>Dễ</option>
          <option>Trung bình</option>
          <option>Khó</option>
        </select>

        <span>
          Có {filtered.length} câu hỏi
        </span>
      </div>

      {loading ? (
        <p>Đang tải câu hỏi...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>STT</th>
                <th>Mức độ</th>
                <th>Câu hỏi</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((q, i) => (
                <tr key={q.id}>
                  <td>{i + 1}</td>
                  <td>
                    <span
                      className={`level ${
                        q.level === "Khó"
                          ? "hard"
                          : q.level === "Trung bình"
                            ? "medium"
                            : ""
                      }`}
                    >
                      {q.level}
                    </span>
                  </td>

                  <td>{q.question}</td>

                  <td>
                    <Link
                      to={`/questions/${q.id}`}
                    >
                      Chi tiết →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
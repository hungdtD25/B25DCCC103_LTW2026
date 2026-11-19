import { memo, useRef } from 'react';

import { formatPoint } from '../data';
import { getGrade } from '../utils';

const CourseRow = memo(({ course, onScore, onRemove }) => {
  const renderCount = useRef(0);

  renderCount.current += 1;

  const grade = getGrade(course.score);
  const isFailed = grade.letter === 'F';

  return (
    <tr className={isFailed ? 'failed-row' : ''}>
      <td>{course.code}</td>

      <td>{course.name}</td>

      <td>{course.credits}</td>

      <td>{course.semester}</td>

      <td>
        <input
          className="score-input"
          type="number"
          min="0"
          max="10"
          step="0.1"
          aria-label={`Điểm ${course.name}`}
          value={course.score}
          onChange={(event) => {
            const score = event.target.valueAsNumber;

            if (
              Number.isFinite(score) &&
              score >= 0 &&
              score <= 10
            ) {
              onScore(course.id, score);
            }
          }}
        />
      </td>

      <td>
        {isFailed ? 'F – Học lại' : grade.letter}
      </td>

      <td>{formatPoint(grade.point)}</td>

      <td>{renderCount.current}</td>

      <td>
        <button
          type="button"
          className="danger-button"
          onClick={() =>
            onRemove(course.id, course.name)
          }
        >
          Xóa
        </button>
      </td>
    </tr>
  );
});

export default CourseRow;
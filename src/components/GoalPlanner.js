import { useMemo } from 'react';

import {
  useDispatch,
  useSelector
} from 'react-redux';

import {
  selectCourses
} from '../features/coursesSlice';

import {
  selectGoal,
  setRemaining,
  setTarget
} from '../features/goalSlice';

import { calcRequired } from '../utils';

const GoalPlanner = () => {
  const courses = useSelector(selectCourses);

  const goal = useSelector(selectGoal);

  const dispatch = useDispatch();

  const result = useMemo(
    () =>
      calcRequired(
        courses,
        goal.target,
        goal.remaining
      ),
    [
      courses,
      goal.target,
      goal.remaining
    ]
  );

  return (
    <section className="panel">
      <h2>Mục tiêu GPA</h2>

      <div className="goal-fields">
        <div className="form-field">
          <label htmlFor="target-gpa">
            GPA mục tiêu
          </label>

          <input
            id="target-gpa"
            type="number"
            min="0"
            max="4"
            step="0.01"
            value={goal.target}
            onChange={(event) =>
              dispatch(setTarget(event.target.value))
            }
          />
        </div>

        <div className="form-field">
          <label htmlFor="remaining-credits">
            Số tín chỉ còn lại
          </label>

          <input
            id="remaining-credits"
            type="number"
            value={goal.remaining}
            onChange={(event) =>
              dispatch(
                setRemaining(event.target.value)
              )
            }
          />
        </div>
      </div>

      <p className="goal-result">
        {result}
      </p>
    </section>
  );
};

export default GoalPlanner;
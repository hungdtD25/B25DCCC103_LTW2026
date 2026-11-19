import { useRef, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import {
  CREDIT_OPTIONS,
  SEMESTERS
} from '../data';

import {
  addCourse,
  selectCourses
} from '../features/coursesSlice';

import { useNotice } from '../context/NoticeContext';

const initialForm = {
  code: '',
  name: '',
  credits: '3',
  semester: 'Học kỳ 1',
  score: ''
};

const AddCourseForm = () => {
  const courses = useSelector(selectCourses);

  const dispatch = useDispatch();

  const showNotice = useNotice();

  const codeRef = useRef(null);

  const [form, setForm] = useState(initialForm);

  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value
    }));

    setErrors((current) => ({
      ...current,
      [name]: ''
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const nextErrors = {};

    const normalizedCode = form.code
      .trim()
      .toUpperCase();

    const duplicated = courses.some(
      (course) =>
        course.code.trim().toUpperCase() ===
        normalizedCode
    );

    const score = Number(form.score);

    if (!form.code.trim()) {
      nextErrors.code = 'Hãy nhập mã môn';
    } else if (duplicated) {
      nextErrors.code = 'Mã môn đã tồn tại';
    }

    if (!form.name.trim()) {
      nextErrors.name = 'Hãy nhập tên môn';
    }

    if (
      form.score === '' ||
      !Number.isFinite(score) ||
      score < 0 ||
      score > 10
    ) {
      nextErrors.score = 'Điểm phải từ 0 đến 10';
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const nextId =
      courses.reduce(
        (largest, course) =>
          Math.max(largest, course.id),
        0
      ) + 1;

    dispatch(
      addCourse({
        id: nextId,
        code: normalizedCode,
        name: form.name.trim(),
        credits: Number(form.credits),
        semester: form.semester,
        score
      })
    );

    showNotice(`Đã thêm môn ${form.name.trim()}`);

    setForm(initialForm);

    codeRef.current.focus();
  };

  return (
    <section className="panel">
      <h2>Thêm môn học</h2>

      <form
        onSubmit={handleSubmit}
        className="course-form"
      >
        <div className="form-field">
          <label htmlFor="course-code">
            Mã môn
          </label>

          <input
            ref={codeRef}
            id="course-code"
            name="code"
            value={form.code}
            onChange={handleChange}
            type="text"
          />

          {errors.code && (
            <small role="alert">
              {errors.code}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="course-name">
            Tên môn
          </label>

          <input
            id="course-name"
            name="name"
            value={form.name}
            onChange={handleChange}
            type="text"
          />

          {errors.name && (
            <small role="alert">
              {errors.name}
            </small>
          )}
        </div>

        <div className="form-field">
          <label htmlFor="course-credits">
            Số tín chỉ
          </label>

          <select
            id="course-credits"
            name="credits"
            value={form.credits}
            onChange={handleChange}
          >
            {CREDIT_OPTIONS.map((credit) => (
              <option key={credit} value={credit}>
                {credit}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="course-semester">
            Học kỳ
          </label>

          <select
            id="course-semester"
            name="semester"
            value={form.semester}
            onChange={handleChange}
          >
            {SEMESTERS.map((semester) => (
              <option key={semester} value={semester}>
                {semester}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <label htmlFor="course-score">
            Điểm hệ 10
          </label>

          <input
            id="course-score"
            name="score"
            type="number"
            min="0"
            max="10"
            step="0.1"
            value={form.score}
            onChange={handleChange}
          />

          {errors.score && (
            <small role="alert">
              {errors.score}
            </small>
          )}
        </div>

        <button type="submit">
          Thêm môn
        </button>
      </form>
    </section>
  );
};

export default AddCourseForm;
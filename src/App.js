import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';

import {
  useDispatch,
  useSelector
} from 'react-redux';

const BUILD_TAG = "gp-4073";

import {
  SEMESTERS,
  GRADES
} from './data';

import {
  selectCourses,
  setCourses,
  setScore,
  removeCourse
} from './features/coursesSlice';

import { useTheme } from './context/ThemeContext';

import { useNotice } from './context/NoticeContext';

import useFetch from './hooks/useFetch';

import useLocalStorage from './hooks/useLocalStorage';

import useDebounce from './hooks/useDebounce';

import {
  calcStats,
  getGrade
} from './utils';

import AddCourseForm from './components/AddCourseForm';

import CourseRow from './components/CourseRow';

import GoalPlanner from './components/GoalPlanner';

import { hasSaved } from './store';

const App = () => {
  const dispatch = useDispatch();

  const courses = useSelector(selectCourses);

  const { theme, toggleTheme } = useTheme();

  const showNotice = useNotice();

  const {
    data,
    loading,
    error
  } = useFetch('/data/courses.json');

  const [semester, setSemester] =
    useLocalStorage(
      'ltw_sodiem_semester',
      'all'
    );

  const [search, setSearch] = useState('');

  const debouncedSearch = useDebounce(
    search,
    300
  );

  const searchRef = useRef(null);

  const [didLoadSample, setDidLoadSample] =
    useState(hasSaved);

  // Tải dữ liệu mẫu lần đầu
  useEffect(() => {
    if (
      !hasSaved &&
      data &&
      !didLoadSample
    ) {
      dispatch(setCourses(data));

      setDidLoadSample(true);
    }
  }, [
    data,
    dispatch,
    didLoadSample
  ]);

  // Lọc môn học theo học kỳ
  const visibleBySemester = useMemo(
    () =>
      semester === 'all'
        ? courses
        : courses.filter(
            (course) =>
              course.semester === semester
          ),
    [courses, semester]
  );

  // Tìm kiếm theo mã môn và tên môn
  const filteredCourses = useMemo(() => {
    const keyword = debouncedSearch
      .trim()
      .toLowerCase();

    if (!keyword) {
      return visibleBySemester;
    }

    return visibleBySemester.filter(
      (course) =>
        course.name
          .toLowerCase()
          .includes(keyword) ||
        course.code
          .toLowerCase()
          .includes(keyword)
    );
  }, [
    visibleBySemester,
    debouncedSearch
  ]);

  // Tính thống kê
  const stats = useMemo(
    () => calcStats(visibleBySemester),
    [visibleBySemester]
  );

  const cumulativeStats = useMemo(
    () => calcStats(courses),
    [courses]
  );

  // Phân bố điểm chữ
  const distribution = useMemo(
    () =>
      GRADES.map((grade) => ({
        ...grade,

        count: visibleBySemester.filter(
          (course) =>
            getGrade(course.score).letter ===
            grade.letter
        ).length
      })),
    [visibleBySemester]
  );

  // Cập nhật điểm
  const handleScore = useCallback(
    (id, score) => {
      dispatch(
        setScore({
          id,
          score
        })
      );
    },
    [dispatch]
  );

  // Xóa môn học
  const handleRemove = useCallback(
    (id, name) => {
      dispatch(removeCourse(id));

      showNotice(`Đã xóa môn ${name}`);
    },
    [dispatch, showNotice]
  );

  // Tìm kiếm
  const handleCourseShift = (event) => {
    setSearch(event.target.value);
  };

  // Phím tắt tìm kiếm
  useEffect(() => {
    const handleKey = (event) => {
      const target = event.target;

      const tagName =
        target && target.tagName
          ? target.tagName.toLowerCase()
          : '';

      const isTyping =
        ['input', 'textarea', 'select'].includes(
          tagName
        ) ||
        (target && target.isContentEditable);

      if (
        event.key === '/' &&
        !isTyping
      ) {
        event.preventDefault();

        searchRef.current?.focus();
      }

      if (
        event.key === 'Escape' &&
        document.activeElement === searchRef.current
      ) {
        setSearch('');
      }
    };

    window.addEventListener(
      'keydown',
      handleKey
    );

    return () =>
      window.removeEventListener(
        'keydown',
        handleKey
      );
  }, []);

  // Cập nhật tiêu đề website
  useEffect(() => {
    document.title = courses.length
      ? `GPA ${cumulativeStats.gpa.toFixed(2)} – Sổ điểm`
      : 'Sổ điểm';
  }, [
    courses.length,
    cumulativeStats.gpa
  ]);

  // Khôi phục dữ liệu ban đầu
  const handleReset = () => {
    if (data) {
      dispatch(setCourses(data));

      showNotice('Đã đặt lại dữ liệu mẫu');
    }
  };

  if (
    !hasSaved &&
    !didLoadSample &&
    loading
  ) {
    return (
      <div
        className={`app ${theme}`}
        data-build={BUILD_TAG}
      >
        Đang tải bảng điểm...
      </div>
    );
  }

  if (
    !hasSaved &&
    !didLoadSample &&
    error
  ) {
    return (
      <div
        className={`app ${theme}`}
        data-build={BUILD_TAG}
      >
        Không tải được bảng điểm.
      </div>
    );
  }

  return (
    <div
      className={`app ${theme}`}
      data-build={BUILD_TAG}
    >
      <header className="page-header">
        <div>
          <p className="eyebrow">
            QUẢN LÝ HỌC TẬP
          </p>

          <h1>Sổ điểm sinh viên</h1>

          <p className="subtitle">
            Theo dõi kết quả học tập và lập kế hoạch GPA
          </p>
        </div>

        <button
          type="button"
          className="theme-button"
          onClick={toggleTheme}
        >
          {theme === 'light'
            ? 'Chế độ tối'
            : 'Chế độ sáng'}
        </button>
      </header>

      {/* THỐNG KÊ */}
      <section className="panel">
        <h2>Thống kê</h2>

        <div className="stats-grid">
          <p>
            Số môn: {stats.count}
          </p>

          <p>
            Tổng tín chỉ: {stats.credits}
          </p>

          <p>
            GPA (hệ 4): {stats.gpa.toFixed(2)}
          </p>

          <p>
            Xếp loại: {stats.rank}
          </p>

          <p>
            GPA tích lũy: {cumulativeStats.gpa.toFixed(2)}
          </p>
        </div>

        <h3>Phân bố điểm chữ</h3>

        <ul className="distribution-list">
          {distribution.map((item) => (
            <li key={item.letter}>
              <span>
                {item.letter}: {item.count}
              </span>

              <span className="bar-track">
                <span
                  className="bar-fill"
                  style={{
                    width: `${24 * item.count}px`
                  }}
                />
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* BẢNG ĐIỂM */}
      <section className="panel">
        <div className="section-heading">
          <h2>Bảng điểm</h2>

          <button
            type="button"
            className="secondary-button"
            onClick={handleReset}
          >
            Đặt lại dữ liệu mẫu
          </button>
        </div>

        {/* Bộ lọc */}
        <div className="filters">
          <div className="form-field">
            <label htmlFor="semester-filter">
              Xem học kỳ
            </label>

            <select
              id="semester-filter"
              value={semester}
              onChange={(event) =>
                setSemester(event.target.value)
              }
            >
              <option value="all">
                Tất cả
              </option>

              {SEMESTERS.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field search-field">
            <label htmlFor="course-search">
              Tìm môn học
            </label>

            <input
              ref={searchRef}
              id="course-search"
              type="text"
              value={search}
              onChange={handleCourseShift}
              placeholder="Nhập tên hoặc mã môn..."
            />
          </div>
        </div>

        <p className="result-count">
          Tìm thấy {filteredCourses.length} môn
        </p>

        {filteredCourses.length === 0 ? (
          <p className="empty-state">
            Chưa có môn học nào
          </p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Mã môn</th>
                  <th>Tên môn</th>
                  <th>Tín chỉ</th>
                  <th>Học kỳ</th>
                  <th>Điểm (hệ 10)</th>
                  <th>Điểm chữ</th>
                  <th>Điểm (hệ 4)</th>
                  <th>Số lần render</th>
                  <th>Xóa</th>
                </tr>
              </thead>

              <tbody>
                {filteredCourses.map((course) => (
                  <CourseRow
                    key={course.id}
                    course={course}
                    onScore={handleScore}
                    onRemove={handleRemove}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* FORM THÊM MÔN */}
      <AddCourseForm />

      {/* MỤC TIÊU GPA */}
      <GoalPlanner />

      <footer>
        Phím tắt: nhấn / để tìm kiếm, Esc để xóa nội dung tìm kiếm.
      </footer>
    </div>
  );
};

export default App;
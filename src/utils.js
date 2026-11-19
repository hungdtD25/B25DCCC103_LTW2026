import { GRADES, RANKS } from './data';

export const getGrade = (score) =>
  GRADES.find((grade) => score >= grade.min);

export const getRank = (gpa) => {
  const rank = RANKS.find((item) => gpa >= item.min);

  return rank ? rank.title : 'Chưa xếp loại';
};

export const calcStats = (courses) => {
  const totals = courses.reduce(
    (result, course) => {
      const grade = getGrade(course.score);

      result.credits += course.credits;
      result.points += course.credits * grade.point;

      return result;
    },
    { credits: 0, points: 0 }
  );

  const gpa = totals.credits
    ? Math.round(
        (totals.points / totals.credits) * 100
      ) / 100
    : 0;

  return {
    count: courses.length,
    credits: totals.credits,
    points: totals.points,
    gpa,
    rank: courses.length
      ? getRank(gpa)
      : 'Chưa xếp loại'
  };
};

export const calcRequired = (
  courses,
  target,
  remaining
) => {
  const targetNumber = Number(target);
  const remainingNumber = Number(remaining);

  if (
    target === '' ||
    remaining === '' ||
    !Number.isFinite(targetNumber) ||
    targetNumber < 0 ||
    targetNumber > 4 ||
    !Number.isInteger(remainingNumber) ||
    remainingNumber < 1
  ) {
    return 'Hãy nhập GPA mục tiêu (0–4) và số tín chỉ còn lại (từ 1)';
  }

  const stats = calcStats(courses);

  const need =
    (
      targetNumber * (stats.credits + remainingNumber)
      - stats.points
    ) / remainingNumber;

  if (need > 4) {
    return 'Không thể đạt mục tiêu này';
  }

  if (need <= 0) {
    return 'Bạn đã đạt mục tiêu';
  }

  return `Cần đạt trung bình ${need.toFixed(2)} điểm (hệ 4) ở ${remainingNumber} tín chỉ còn lại`;
};
const STORAGE_KEY = 'ltw_sodiem_courses';

export const loadSaved = () => {
  try {
    const saved = window.localStorage.getItem(
      STORAGE_KEY
    );

    if (saved === null) return null;

    const parsed = JSON.parse(saved);

    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
};

export const saveCourses = (courses) => {
  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(courses)
    );
  } catch (error) {
    // Bỏ qua lỗi lưu trữ
  }
};
import { createSlice } from '@reduxjs/toolkit';

const coursesSlice = createSlice({
  name: 'courses',

  initialState: [],

  reducers: {
    setCourses: (state, action) => action.payload,

    addCourse: (state, action) => {
      state.push(action.payload);
    },

    removeCourse: (state, action) =>
      state.filter(
        (course) => course.id !== action.payload
      ),

    setScore: (state, action) => {
      const course = state.find(
        (item) => item.id === action.payload.id
      );

      if (course) {
        course.score = action.payload.score;
      }
    }
  }
});

export const {
  setCourses,
  addCourse,
  removeCourse,
  setScore
} = coursesSlice.actions;

export const selectCourses = (state) => state.courses;

export default coursesSlice.reducer;
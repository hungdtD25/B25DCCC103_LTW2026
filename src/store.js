import { configureStore } from '@reduxjs/toolkit';

import coursesReducer from './features/coursesSlice';
import goalReducer from './features/goalSlice';

import {
  loadSaved,
  saveCourses
} from './storage';

const savedCourses = loadSaved();

export const hasSaved = savedCourses !== null;

export const store = configureStore({
  reducer: {
    courses: coursesReducer,
    goal: goalReducer
  },

  preloadedState: {
    courses: savedCourses ?? [],

    goal: {
      target: '3.2',
      remaining: '20'
    }
  }
});

let previousCourses = store.getState().courses;

store.subscribe(() => {
  const currentCourses = store.getState().courses;

  if (currentCourses !== previousCourses) {
    previousCourses = currentCourses;

    saveCourses(currentCourses);
  }
});
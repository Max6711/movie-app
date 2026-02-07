import { combineReducers } from '@reduxjs/toolkit';
import moviesReducer from './movies/moviesSlice';

const rootReducer = combineReducers({
  movies: moviesReducer,
});

export default rootReducer;
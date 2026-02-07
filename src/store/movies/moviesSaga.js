import { call, put, takeLatest, debounce, select } from 'redux-saga/effects';
import {
  fetchMoviesRequest,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  fetchMovieDetailsRequest,
  fetchMovieDetailsSuccess,
  fetchMovieDetailsFailure,
  searchMoviesRequest,
} from './moviesSlice';
import { fetchMovies, fetchMovieById, searchMovies } from '../../api/movieApi';
import { selectCurrentPage, selectFilter, selectSearchQuery } from './moviesSelectors';
import { rateLimiter } from '../../utils/rateLimiter';
import { DEBOUNCE_DELAY } from '../../utils/constants';

function* handleFetchMovies() {
  try {
    yield call([rateLimiter, 'waitForToken']);
    
    const page = yield select(selectCurrentPage);
    const filter = yield select(selectFilter);
    const searchQuery = yield select(selectSearchQuery);
    
    let data;
    
    if (searchQuery && searchQuery.length >= 2) {
      data = yield call(searchMovies, searchQuery, page);
    } else if (filter === 'popular') {
      data = yield call(fetchMovies, 'popular', page);
    } else if (filter === 'airing_now') {
      data = yield call(fetchMovies, 'now_playing', page);
    } else {
      // For favorites, we don't fetch from API
      return;
    }
    
    yield put(fetchMoviesSuccess(data));
  } catch (error) {
    yield put(fetchMoviesFailure(error.message));
  }
}

function* handleFetchMovieDetails(action) {
  try {
    const data = yield call(fetchMovieById, action.payload);
    yield put(fetchMovieDetailsSuccess(data));
  } catch (error) {
    yield put(fetchMovieDetailsFailure(error.message));
  }
}

function* handleSearchMovies(action) {
  try {
    yield call([rateLimiter, 'waitForToken']);
    
    const { query } = action.payload;
    const page = yield select(selectCurrentPage);
    
    if (query.length >= 2) {
      const data = yield call(searchMovies, query, page);
      yield put(fetchMoviesSuccess(data));
    }
  } catch (error) {
    yield put(fetchMoviesFailure(error.message));
  }
}

export function* watchMovies() {
  yield takeLatest(fetchMoviesRequest.type, handleFetchMovies);
  yield takeLatest(fetchMovieDetailsRequest.type, handleFetchMovieDetails);
  yield debounce(DEBOUNCE_DELAY, searchMoviesRequest.type, handleSearchMovies);
}
import { all } from 'redux-saga/effects';
import { watchMovies } from './movies/moviesSaga';

export default function* rootSaga() {
  yield all([
    watchMovies(),
  ]);
}
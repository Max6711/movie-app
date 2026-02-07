import { createSlice } from '@reduxjs/toolkit';
import { getFavorites } from '../../utils/localStorage';

const initialState = {
  movies: [],
  movieDetails: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 0,
  filter: 'popular',
  searchQuery: '',
  favorites: getFavorites(),
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    // Fetch movies
    fetchMoviesRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMoviesSuccess: (state, action) => {
      state.loading = false;
      state.movies = action.payload.results;
      state.totalPages = action.payload.total_pages;
    },
    fetchMoviesFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Fetch movie details
    fetchMovieDetailsRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchMovieDetailsSuccess: (state, action) => {
      state.loading = false;
      state.movieDetails = action.payload;
    },
    fetchMovieDetailsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Search
    searchMoviesRequest: (state, action) => {
      state.loading = true;
      state.error = null;
      state.searchQuery = action.payload.query;
    },

    // Filters and pagination
    setFilter: (state, action) => {
      state.filter = action.payload;
      state.currentPage = 1;
      state.searchQuery = '';
    },
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
      state.currentPage = 1;
    },

    // Favorites
    toggleFavorite: (state, action) => {
      const movieId = action.payload;
      const index = state.favorites.indexOf(movieId);
      
      if (index > -1) {
        state.favorites.splice(index, 1);
      } else {
        state.favorites.push(movieId);
      }
      
      localStorage.setItem('movieFavorites', JSON.stringify(state.favorites));
    },

    // Clear details
    clearMovieDetails: (state) => {
      state.movieDetails = null;
    },
  },
});

export const {
  fetchMoviesRequest,
  fetchMoviesSuccess,
  fetchMoviesFailure,
  fetchMovieDetailsRequest,
  fetchMovieDetailsSuccess,
  fetchMovieDetailsFailure,
  searchMoviesRequest,
  setFilter,
  setPage,
  setSearchQuery,
  toggleFavorite,
  clearMovieDetails,
} = moviesSlice.actions;

export default moviesSlice.reducer;
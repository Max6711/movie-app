// Basic selectors
export const selectMovies = (state) => state.movies.movies;
export const selectMovieDetails = (state) => state.movies.movieDetails;
export const selectLoading = (state) => state.movies.loading;
export const selectError = (state) => state.movies.error;
export const selectCurrentPage = (state) => state.movies.currentPage;
export const selectTotalPages = (state) => state.movies.totalPages;
export const selectFilter = (state) => state.movies.filter;
export const selectSearchQuery = (state) => state.movies.searchQuery;
export const selectFavorites = (state) => state.movies.favorites;

// Computed selectors
export const selectFavoriteMovies = (state) => {
  const favorites = state.movies.favorites;
  return state.movies.movies.filter(movie => favorites.includes(movie.id));
};

export const selectDisplayMovies = (state) => {
  const filter = state.movies.filter;
  const movies = state.movies.movies;
  const favorites = state.movies.favorites;
  
  if (filter === 'favorites') {
    return movies.filter(movie => favorites.includes(movie.id));
  }
  
  return movies;
};
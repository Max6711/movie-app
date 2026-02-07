import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import './App.css';
import {
  fetchMoviesRequest,
  fetchMovieDetailsRequest,
  searchMoviesRequest,
  setFilter,
  setPage,
  setSearchQuery,
  toggleFavorite,
  clearMovieDetails,
} from './store/movies/moviesSlice';
import {
  selectDisplayMovies,
  selectLoading,
  selectCurrentPage,
  selectTotalPages,
  selectFilter,
  selectSearchQuery,
  selectMovieDetails,
  selectFavorites,
} from './store/movies/moviesSelectors';
import { getImageUrl, IMAGE_SIZES } from './api/config';
import { useKeyboard } from './hooks/useKeyboard';
import { CATEGORY_FOCUS_DELAY } from './utils/constants';

function App() {
  const dispatch = useDispatch();
  const movies = useSelector(selectDisplayMovies);
  const loading = useSelector(selectLoading);
  const currentPage = useSelector(selectCurrentPage);
  const totalPages = useSelector(selectTotalPages);
  const filter = useSelector(selectFilter);
  const searchQuery = useSelector(selectSearchQuery);
  const selectedMovie = useSelector(selectMovieDetails);
  const favorites = useSelector(selectFavorites);

  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const searchTimeout = useRef(null);
  const categoryFocusTimeout = useRef(null);
  const containerRef = useRef(null);

  // Load movies on mount and when dependencies change
  useEffect(() => {
    dispatch(fetchMoviesRequest());
  }, [dispatch, filter, currentPage, searchQuery]);

  // Handle search with debounce
  const handleSearch = (value) => {
    setLocalSearchQuery(value);
    
    if (searchTimeout.current) {
      clearTimeout(searchTimeout.current);
    }
    
    if (value.length >= 2) {
      searchTimeout.current = setTimeout(() => {
        dispatch(setSearchQuery(value));
        dispatch(searchMoviesRequest({ query: value }));
      }, 500);
    } else if (value.length === 0) {
      dispatch(setSearchQuery(''));
      dispatch(fetchMoviesRequest());
    }
  };

  // Filter change with focus delay
  const handleFilterFocus = (newFilter) => {
    if (categoryFocusTimeout.current) {
      clearTimeout(categoryFocusTimeout.current);
    }
    
    categoryFocusTimeout.current = setTimeout(() => {
      dispatch(setFilter(newFilter));
      setLocalSearchQuery('');
    }, CATEGORY_FOCUS_DELAY);
  };

  const handleFilterClick = (newFilter) => {
    if (categoryFocusTimeout.current) {
      clearTimeout(categoryFocusTimeout.current);
    }
    dispatch(setFilter(newFilter));
    setLocalSearchQuery('');
  };

  // Keyboard navigation
  useKeyboard({
    onEscape: () => {
      if (selectedMovie) {
        dispatch(clearMovieDetails());
      }
    },
    onArrowUp: () => {
      if (!selectedMovie && containerRef.current) {
        containerRef.current.scrollBy({ top: -100, behavior: 'smooth' });
      }
    },
    onArrowDown: () => {
      if (!selectedMovie && containerRef.current) {
        containerRef.current.scrollBy({ top: 100, behavior: 'smooth' });
      }
    },
    onArrowLeft: () => {
      if (!selectedMovie && currentPage > 1) {
        dispatch(setPage(currentPage - 1));
      }
    },
    onArrowRight: () => {
      if (!selectedMovie && currentPage < totalPages) {
        dispatch(setPage(currentPage + 1));
      }
    },
  });

  // Disable mouse scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    const preventScroll = (e) => {
      if (e.type === 'wheel' || e.type === 'mousewheel') {
        e.preventDefault();
      }
    };
    
    container.addEventListener('wheel', preventScroll, { passive: false });
    container.addEventListener('mousewheel', preventScroll, { passive: false });
    
    return () => {
      container.removeEventListener('wheel', preventScroll);
      container.removeEventListener('mousewheel', preventScroll);
    };
  }, []);

  return (
    <div className="app">
      <header className="header">
        <h1 className="logo">🎬 CineScope</h1>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search movies..."
            value={localSearchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="search-input"
          />
        </div>
      </header>

      <nav className="filter-nav">
        <button
          className={`filter-btn ${filter === 'popular' ? 'active' : ''}`}
          onClick={() => handleFilterClick('popular')}
          onFocus={() => handleFilterFocus('popular')}
        >
          Popular
        </button>
        <button
          className={`filter-btn ${filter === 'airing_now' ? 'active' : ''}`}
          onClick={() => handleFilterClick('airing_now')}
          onFocus={() => handleFilterFocus('airing_now')}
        >
          Airing Now
        </button>
        <button
          className={`filter-btn ${filter === 'favorites' ? 'active' : ''}`}
          onClick={() => handleFilterClick('favorites')}
          onFocus={() => handleFilterFocus('favorites')}
        >
          My Favorites
        </button>
      </nav>

      <main className="main-content" ref={containerRef}>
        {loading ? (
          <div className="loader">Loading...</div>
        ) : (
          <>
            <div className="movies-grid">
              {movies.map(movie => (
                <div 
                  key={movie.id} 
                  className="movie-card" 
                  onClick={() => dispatch(fetchMovieDetailsRequest(movie.id))}
                >
                  <div className="movie-poster">
                    {movie.poster_path ? (
                      <img
                        src={getImageUrl(movie.poster_path, IMAGE_SIZES.POSTER_MEDIUM)}
                        alt={movie.title}
                        loading="lazy"
                      />
                    ) : (
                      <div className="no-poster">No Image</div>
                    )}
                    <button
                      className={`fav-btn ${favorites.includes(movie.id) ? 'active' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(toggleFavorite(movie.id));
                      }}
                    >
                      {favorites.includes(movie.id) ? '❤️' : '🤍'}
                    </button>
                  </div>
                  <div className="movie-info">
                    <h3 className="movie-title">{movie.title}</h3>
                    <div className="movie-meta">
                      <span className="rating">⭐ {movie.vote_average?.toFixed(1)}</span>
                      <span className="year">{movie.release_date?.split('-')[0]}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!loading && movies.length === 0 && (
              <div className="no-results">No movies found</div>
            )}

            {filter !== 'favorites' && totalPages > 1 && (
              <div className="pagination">
                <button
                  onClick={() => dispatch(setPage(Math.max(1, currentPage - 1)))}
                  disabled={currentPage === 1}
                  className="page-btn"
                >
                  ← Previous
                </button>
                <span className="page-info">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  onClick={() => dispatch(setPage(Math.min(totalPages, currentPage + 1)))}
                  disabled={currentPage === totalPages}
                  className="page-btn"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </main>

      {selectedMovie && (
        <div className="modal-overlay" onClick={() => dispatch(clearMovieDetails())}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => dispatch(clearMovieDetails())}>✕</button>
            
            <div className="modal-header">
              {selectedMovie.backdrop_path && (
                <img
                  src={getImageUrl(selectedMovie.backdrop_path, IMAGE_SIZES.BACKDROP_LARGE)}
                  alt={selectedMovie.title}
                  className="backdrop"
                />
              )}
              <div className="modal-title-section">
                <h2>{selectedMovie.title}</h2>
                <div className="modal-meta">
                  <span>⭐ {selectedMovie.vote_average?.toFixed(1)}</span>
                  <span>{selectedMovie.release_date?.split('-')[0]}</span>
                  <span>{selectedMovie.runtime} min</span>
                </div>
              </div>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <h3>Overview</h3>
                <p>{selectedMovie.overview}</p>
              </div>

              {selectedMovie.genres && selectedMovie.genres.length > 0 && (
                <div className="modal-section">
                  <h3>Genres</h3>
                  <div className="genres">
                    {selectedMovie.genres.map(g => (
                      <span key={g.id} className="genre-tag">{g.name}</span>
                    ))}
                  </div>
                </div>
              )}

              <button
                className={`modal-fav-btn ${favorites.includes(selectedMovie.id) ? 'active' : ''}`}
                onClick={() => dispatch(toggleFavorite(selectedMovie.id))}
              >
                {favorites.includes(selectedMovie.id) ? '❤️ Remove from Favorites' : '🤍 Add to Favorites'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
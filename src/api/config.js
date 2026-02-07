export const API_CONFIG = {
    BASE_URL: 'https://api.themoviedb.org/3',
    IMAGE_BASE_URL: 'https://image.tmdb.org/t/p',
    API_KEY: process.env.REACT_APP_TMDB_API_KEY || '45d136948ec9f060d30bcb8242b4cb6b',
  };
  
  export const IMAGE_SIZES = {
    POSTER_SMALL: '/w185',
    POSTER_MEDIUM: '/w342',
    POSTER_LARGE: '/w500',
    BACKDROP_SMALL: '/w780',
    BACKDROP_LARGE: '/w1280',
    ORIGINAL: '/original',
  };
  
  export const getImageUrl = (path, size = IMAGE_SIZES.POSTER_MEDIUM) => {
    if (!path) return null;
    return `${API_CONFIG.IMAGE_BASE_URL}${size}${path}`;
  };
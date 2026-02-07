export const FILTER_TYPES = {
    POPULAR: 'popular',
    AIRING_NOW: 'airing_now',
    FAVORITES: 'favorites',
  };
  
  export const FILTER_LABELS = {
    [FILTER_TYPES.POPULAR]: 'Popular',
    [FILTER_TYPES.AIRING_NOW]: 'Airing Now',
    [FILTER_TYPES.FAVORITES]: 'My Favorites',
  };
  
  export const CARDS_PER_ROW = 4;
  export const DEBOUNCE_DELAY = 500;
  export const SEARCH_MIN_CHARS = 2;
  export const CATEGORY_FOCUS_DELAY = 2000;
  
  export const STORAGE_KEYS = {
    FAVORITES: 'movieFavorites',
  };
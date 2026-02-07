import { API_CONFIG } from './config';

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(`${API_CONFIG.BASE_URL}${endpoint}`);
  url.searchParams.append('api_key', API_CONFIG.API_KEY);
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      url.searchParams.append(key, value);
    }
  });
  
  return url.toString();
};

const handleResponse = async (response) => {
  if (!response.ok) {
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }
  return await response.json();
};

export const fetchMovies = async (category = 'popular', page = 1) => {
  const endpoint = `/movie/${category}`;
  const url = buildUrl(endpoint, { page });
  const response = await fetch(url);
  return handleResponse(response);
};

export const fetchMovieById = async (id) => {
  const endpoint = `/movie/${id}`;
  const url = buildUrl(endpoint, { append_to_response: 'credits,videos' });
  const response = await fetch(url);
  return handleResponse(response);
};

export const searchMovies = async (query, page = 1) => {
  const endpoint = '/search/movie';
  const url = buildUrl(endpoint, { query, page });
  const response = await fetch(url);
  return handleResponse(response);
};
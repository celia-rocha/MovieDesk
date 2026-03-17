import axios from 'axios';
import type { MovieDetails, TMDBResponse } from '../types/movie';

const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p';
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `Bearer ${TOKEN}`,
    accept: 'application/json',
  },
  params: {
    language: 'pt-BR',
  },
});

export const movieService = {
  // Filmes em Tendência (Semana)
  getTrending: async () => {
    const { data } = await tmdbApi.get<TMDBResponse>('/trending/movie/week');
    return data.results;
  },

  // Filmes Populares
  getPopular: async () => {
    const { data } = await tmdbApi.get<TMDBResponse>('/movie/popular');
    return data.results;
  },

  // Busca de Filmes
  searchMovies: async (query: string) => {
    const { data } = await tmdbApi.get<TMDBResponse>('/search/movie', {
      params: { query },
    });
    return data.results;
  },

  // Detalhes de um Filme
  getMovieDetails: async (id: number) => {
    const { data } = await tmdbApi.get<MovieDetails>(`/movie/${id}`);
    return data;
  },

  // Helper para montar URL da imagem
  getImageUrl: (path: string, size: string = 'w500') => {
    if (!path) return '';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};

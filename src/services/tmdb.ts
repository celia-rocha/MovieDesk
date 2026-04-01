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
  getPopular: async (page: number = 1) => {
    const { data } = await tmdbApi.get<TMDBResponse>('/movie/popular', {
      params: { page },
    });
    return data.results;
  },

  // Busca de Filmes por Gênero (Passamos o código do gênero e a página)
  getMoviesByGenre: async (genreId: number, page: number = 1) => {
    const { data } = await tmdbApi.get<TMDBResponse>('/discover/movie', {
      params: {
        with_genres: genreId,
        page: page,
      },
    });
    return data.results;
  },

  // Busca de Filmes
  searchMovies: async (query: string) => {
    const { data } = await tmdbApi.get<TMDBResponse>('/search/movie', {
      params: { query },
    });
    return data.results;
  },

  // Detalhes de um Filme (E pedimos os Trailers de brinde)
  getMovieDetails: async (id: number) => {
    const { data } = await tmdbApi.get<MovieDetails>(`/movie/${id}`, {
      params: { append_to_response: 'videos' }
    });
    return data;
  },

  // Helper para montar URL da imagem
  getImageUrl: (path: string, size: string = 'w500') => {
    if (!path) return '';
    return `${IMAGE_BASE_URL}/${size}${path}`;
  }
};

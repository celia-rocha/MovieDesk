import { useState, useEffect } from 'react';
import { MovieRow } from '../MovieRow/MovieRow';
import { movieService } from '../../services/tmdb';
import type { Movie } from '../../types/movie';

interface CategoryRowProps {
  title: string;
  genreId: number;
  featuredMovies: Movie[]; // Recebemos os populares para não repetir filmes!
}

export function CategoryRow({ title, genreId, featuredMovies }: CategoryRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        const data = await movieService.getMoviesByGenre(genreId);
        
        // A Mágica do Filtro continua aqui:
        const uniqueMovies = data.filter((genreMovie) => {
          return !featuredMovies.some((popular) => popular.id === genreMovie.id);
        });

        // Pega os 12 primeiros da lista limpa
        setMovies(uniqueMovies.slice(0, 12));
      } catch (error) {
        console.error(`Erro ao buscar filmes de ${title}:`, error);
      }
    };

    fetchGenreMovies();
  }, [genreId, featuredMovies]);

  // Se a lista estiver vazia, não mostramos nada
  if (movies.length === 0) return null;

  // Pegamos a lista pronta e chamamos nosso componente visual MovieRow!
  return <MovieRow title={title} movies={movies} />;
}

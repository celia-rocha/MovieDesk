import { useState, useEffect } from 'react';
import { MovieRow } from '../MovieRow/MovieRow';
import { movieService } from '../../services/tmdb';
import type { Movie } from '../../types/movie';

interface CategoryRowProps {
  title: string;
  genreId: number;
  featuredMovies: Movie[]; 
}

export function CategoryRow({ title, genreId, featuredMovies }: CategoryRowProps) {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  useEffect(() => {
    const fetchGenreMovies = async () => {
      try {
        if (page > 1) setIsLoadingMore(true);
        // Despacha request à API com suporte para paginação
        const data = await movieService.getMoviesByGenre(genreId, page);
        
        setMovies((prevMovies) => {
          // Filtra itens já renderizados e instâncias em destaque
          const uniqueMovies = data.filter((genreMovie) => {
            const inPopular = featuredMovies.some((popular) => popular.id === genreMovie.id);
            // Previne inconsistências causadas pelo Double Invoke em Strict Mode
            const inCurrentList = page > 1 ? prevMovies.some((existing) => existing.id === genreMovie.id) : false;
            
            return !inPopular && !inCurrentList;
          });

          // Retorna dataset inicial limitado
          if (page === 1) {
            return uniqueMovies.slice(0, 12);
          }
          
          // Agrega dataset em caso de requisições subsequentes
          return [...prevMovies, ...uniqueMovies];
        });
      } catch (error) {
        console.error(`Erro ao buscar filmes de ${title}:`, error);
      } finally {
        setIsLoadingMore(false);
      }
    };

    fetchGenreMovies();
  }, [genreId, featuredMovies, page]); 

  const handleLoadMore = () => setPage((prev) => prev + 1);

  // Omitir UI em caso de ausência de dados iniciais
  if (movies.length === 0 && page === 1) return null;

  return (
    <MovieRow 
      title={title} 
      movies={movies} 
      onLoadMore={handleLoadMore} 
      isLoadingMore={isLoadingMore} 
    />
  );
}

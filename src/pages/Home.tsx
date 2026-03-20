import { useState, useEffect } from 'react';
import { movieService } from '../services/tmdb';
import type { Movie } from '../types/movie';

import { MovieRow } from '../components/MovieRow/MovieRow';
import { CategoryRow } from '../components/CategoryRow/CategoryRow';

export function Home() {
  // Estado local para a listagem inicial em destaque
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const popularData = await movieService.getPopular();
        // Filtra os filmes populares retornando apenas os melhores avaliados
        const eliteMovies = popularData
          .filter(movie => movie.vote_average >= 6.0)
          .slice(0, 12);
        
        setMovies(eliteMovies);
      } catch (error) {
        console.error("Erro ao buscar filmes:", error);
      }
    };

    fetchMovies();
  }, []);

  return (
    <>
      {/* Seção Hero: Componentização tipográfica e visual superior */}
      <header className="px-[5%] pt-12 pb-6 relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-white text-3xl sm:text-5xl font-extralight tracking-tight leading-tight">
            Explore o futuro do <br className="hidden sm:block" /> 
            <span className="font-bold text-neon-pink drop-shadow-neon uppercase tracking-widest">Cinema</span>
          </h1>
          <p className="text-gray-400 mt-4 text-sm sm:text-base max-w-lg font-light leading-relaxed">
            Descubra filmes, explore tendências e acompanhe o que está em alta no universo do cinema.
          </p>
          <div className="w-16 h-0.5 bg-neon-pink mt-8 rounded-full shadow-neon opacity-60"></div>
        </div>
        
        {/* Gradiente de profundidade no background hero */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none"></div>
      </header>

      {/* Listagens em carrossel baseadas em Gênero */}
      <div className="mt-4 pb-12 space-y-8">
        {movies.length > 0 ? (
          <>
            <MovieRow title="Filmes Populares" movies={movies} />
            
            <CategoryRow title="Ficção Científica" genreId={878} featuredMovies={movies} />
            <CategoryRow title="Comédias" genreId={35} featuredMovies={movies} />
            <CategoryRow title="Romance" genreId={10749} featuredMovies={movies} />
          </>
        ) : (
          <div className="px-[5%] text-neon-pink animate-pulse font-light tracking-widest text-xs">
            SINCRONIZANDO DADOS DO TMDB...
          </div>
        )}
      </div>
    </>
  );
}

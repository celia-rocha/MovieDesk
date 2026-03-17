import { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { MovieCard } from '../MovieCard/MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
}

export function MovieRow({ title, movies }: MovieRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const scrollAmount = rowRef.current.clientWidth * 0.8;
      rowRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  return (
    <section className="py-6 px-[5%] relative group">
      {/* Título da Fileira */}
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-neon-pink rounded-full shadow-neon"></span>
        {title}
      </h2>

      <div className="relative flex items-center">
        {/* Botão Voltar */}
        <button 
          onClick={() => handleScroll('left')}
          className="absolute -left-4 z-30 p-2 bg-black/60 border border-white/5 rounded-full text-white/50 hover:text-neon-pink hover:border-neon-pink transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Container de Filmes */}
        <div 
          ref={rowRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>

        {/* Botão Próximo */}
        <button 
          onClick={() => handleScroll('right')}
          className="absolute -right-4 z-30 p-2 bg-black/60 border border-white/5 rounded-full text-white/50 hover:text-neon-pink hover:border-neon-pink transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}


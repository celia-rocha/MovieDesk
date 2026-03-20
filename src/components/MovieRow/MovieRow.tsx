import { useRef } from 'react';
import { ChevronLeft, ChevronRight, PlusCircle, Loader2 } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { MovieCard } from '../MovieCard/MovieCard';

interface MovieRowProps {
  title: string;
  movies: Movie[];
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export function MovieRow({ title, movies, onLoadMore, isLoadingMore }: MovieRowProps) {
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
      {/* Title Header */}
      <h2 className="text-white text-xl sm:text-2xl font-bold mb-6 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-neon-pink rounded-full shadow-neon"></span>
        {title}
      </h2>

      <div className="relative flex items-center">
        {/* Left Navigation Control */}
        <button 
          onClick={() => handleScroll('left')}
          className="absolute -left-4 z-30 p-2 bg-black/60 border border-white/5 rounded-full text-white/50 hover:text-neon-pink hover:border-neon-pink transition-all cursor-pointer backdrop-blur-md"
        >
          <ChevronLeft size={20} />
        </button>

        {/* Horizontal Scroll Container */}
        <div 
          ref={rowRef}
          className="flex gap-4 sm:gap-6 overflow-x-auto pb-4 no-scrollbar scroll-smooth items-stretch"
        >
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}

          {/* Load More Trigger */}
          {onLoadMore && (
            <button 
              onClick={onLoadMore}
              disabled={isLoadingMore}
              className="group relative bg-dark-card rounded-xl border border-white/5 hover:border-neon-pink/30 w-[160px] sm:w-[200px] shrink-0 transition-all duration-300 hover:shadow-neon flex items-center justify-center flex-col gap-3 min-h-[240px] sm:min-h-[300px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoadingMore ? (
                <Loader2 className="w-8 h-8 text-neon-pink animate-spin" />
              ) : (
                <>
                  <PlusCircle className="w-10 h-10 text-white/50 group-hover:text-neon-pink transition-colors duration-300" />
                  <span className="text-white/60 font-light text-sm group-hover:text-white transition-colors duration-300">
                    Carregar mais
                  </span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Navigation Control */}
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


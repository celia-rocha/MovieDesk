import { Star } from 'lucide-react';
import type { Movie } from '../../types/movie';
import { movieService } from '../../services/tmdb';

interface MovieCardProps {
  movie: Movie;
}

export function MovieCard({ movie }: MovieCardProps) {
  // Extraímos apenas o ano da data de lançamento (ex: "2024-05-22" -> "2024")
  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  
  // Formatamos a nota para ter apenas uma casa decimal (ex: 8.438 -> 8.4)
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

  return (
    <div className="group relative bg-dark-card rounded-xl overflow-hidden cursor-pointer border border-white/5 hover:border-neon-pink/30 w-[160px] sm:w-[200px] shrink-0 transition-all duration-300 hover:shadow-neon">
      {/* Imagem do Poster */}
      <div className="aspect-[2/3] w-full overflow-hidden">
        <img 
          src={movieService.getImageUrl(movie.poster_path, 'w342')} 
          alt={movie.title}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      </div>

      {/* Info básica - Mantendo o tom marinho original */}
      <div className="p-3 bg-dark-card border-t border-white/5">
        <h3 className="text-white font-medium text-xs truncate">
          {movie.title}
        </h3>
        <div className="flex items-center justify-between mt-1">
          <span className="text-text-muted text-[10px]">{releaseYear}</span>
          <div className="flex items-center gap-1">
            <Star size={10} className="text-neon-pink fill-neon-pink" />
            <span className="text-white text-[10px]">{rating}</span>
          </div>
        </div>
      </div>
    </div>

  );
}

import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Play, Star, Clock, Calendar, ArrowLeft, Heart } from 'lucide-react';
import { movieService } from '../services/tmdb';
import type { MovieDetails, Video } from '../types/movie';

export function Movie() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // Estado local
  const [movie, setMovie] = useState<MovieDetails | null>(null);
  const [loading, setLoading] = useState(true);
  
  // NOVO: Estado para saber se este filme é favorito ou não
  const [isFavorite, setIsFavorite] = useState(false);

  // Busca os detalhes quando a página carrega
  useEffect(() => {
    const fetchMovie = async () => {
      try {
        if (id) {
          const data = await movieService.getMovieDetails(Number(id));
          setMovie(data);
        }
      } catch (error) {
        console.error("Erro ao buscar filme:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovie();
  }, [id]);

  // Função provisória para simular o clique no coração
  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Tela de "Pensando..."
  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-neon-pink animate-pulse font-light tracking-widest text-xs">
          BUSCANDO INFOS NO TMDB...
        </div>
      </div>
    );
  }

  // Se der erro ou o filme não existir
  if (!movie) {
    return <div className="text-center mt-32 text-white">Filme não encontrado.</div>;
  }

  // Criando Links de Imagem
  const backdropUrl = movieService.getImageUrl(movie.backdrop_path, 'original');
  const posterUrl = movieService.getImageUrl(movie.poster_path, 'w500');
  
  // Detetive do Trailer: Acha qual o vídeo oficial é o Trailer do YouTube!
  const trailer = movie.videos?.results.find(
    (vid: Video) => vid.site === 'YouTube' && vid.type === 'Trailer'
  );

  const releaseYear = movie.release_date ? movie.release_date.split('-')[0] : 'N/A';
  const rating = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
  
  // Formatar tempo (ex: 130 -> 2h 10m)
  const hours = Math.floor(movie.runtime / 60);
  const minutes = movie.runtime % 60;
  const duration = `${hours}h ${minutes}m`;

  return (
    <div className="relative w-full flex flex-col justify-center min-h-[calc(100vh-80px)]">
      
      {/* IMAGEM BACKDROP (TELA CHEIA TOTALMENTE FIXA E IMERSIVA) */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-top bg-no-repeat opacity-40 pointer-events-none"
        style={{ backgroundImage: `url(${backdropUrl})` }}
      >
        <div className="absolute inset-0 bg-dark-bg/30"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/95 via-dark-bg/70 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-r from-dark-bg via-dark-bg/60 to-transparent"></div>
      </div>

      {/* CONTEÚDO PRINCIPAL DA TELA */}
      <div className="relative z-10 container mx-auto px-4 sm:px-[5%] pt-10 sm:pt-12 pb-12 w-full flex-grow flex flex-col">
        
        {/* Botão de Voltar Dinâmico */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 group cursor-pointer mb-6"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 group-hover:text-neon-pink transition-transform duration-300" />
          <span className="text-base font-normal">Voltar</span>
        </button>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 lg:gap-16 items-center md:items-start">
        
          {/* PÔSTER - LADO ESQUERDO / CENTRALIZADO NO MOBILE */}
          <div className="w-[180px] sm:w-[240px] md:w-full md:max-w-[340px] shrink-0 mx-auto md:mx-0 rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(255,45,117,0.15)] border border-white/10">
            <img 
              src={posterUrl} 
              alt={movie.title} 
              className="w-full h-auto object-cover"
            />
          </div>

        {/* TEXTOS - LADO DIREITO */}
        <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left mt-4 md:mt-10">
          
          <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4 text-[10px] sm:text-xs font-bold uppercase tracking-widest text-neon-pink">
             {movie.genres.map(g => (
               <span key={g.id} className="bg-neon-pink/10 px-4 py-1 rounded-full border border-neon-pink/20">
                 {g.name}
               </span>
             ))}
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white leading-tight mb-2 drop-shadow-neon">
            {movie.title}
          </h1>

          {movie.tagline && (
             <p className="text-gray-400 text-lg sm:text-xl font-light italic mb-6">
                "{movie.tagline}"
             </p>
          )}

          <div className="flex items-center gap-6 mb-8 text-sm sm:text-base text-gray-300 font-light">
             <div className="flex items-center gap-2">
               <Star className="text-neon-pink fill-neon-pink" size={18} />
               <span className="text-white font-medium">{rating}</span>
             </div>
             <div className="flex items-center gap-2">
               <Clock className="text-gray-400" size={18} />
               <span>{duration}</span>
             </div>
             <div className="flex items-center gap-2">
               <Calendar className="text-gray-400" size={18} />
               <span>{releaseYear}</span>
             </div>
          </div>

          <div className="w-full max-w-3xl mb-4 sm:mb-10">
             <h3 className="text-white text-base sm:text-lg font-semibold mb-2 sm:mb-3">Sinopse</h3>
             <p className="text-gray-400 leading-relaxed font-light text-sm sm:text-base text-justify md:text-left">
               {movie.overview || "Infelizmente o TMDB ainda não possui uma sinopse em português para este filme."}
             </p>
          </div>

          <div className="flex flex-row justify-center md:justify-start items-center gap-3 mt-auto pt-4 pb-4">
             {/* 1. Botão Assistir Trailer */}
             {trailer ? (
                <a 
                  href={`https://www.youtube.com/watch?v=${trailer.key}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-neon-pink text-white px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm shadow-neon hover:scale-105 transition-all duration-300 w-auto"
                >
                  <Play size={18} className="fill-white" />
                  <span>Trailer</span>
                </a>
             ) : (
                <button disabled className="flex items-center justify-center gap-2 bg-white/5 text-white/50 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-semibold uppercase tracking-widest text-xs sm:text-sm border border-white/10 cursor-not-allowed w-auto">
                  <Play size={18} />
                  <span>Indisponível</span>
                </button>
             )}

             {/* 2. Botão de Favoritar */}
             <button 
               onClick={toggleFavorite}
               className={`flex items-center justify-center gap-2 px-5 sm:px-8 py-2.5 sm:py-3 rounded-full font-bold uppercase tracking-widest text-xs sm:text-sm border transition-all duration-300 cursor-pointer w-auto ${
                 isFavorite 
                   ? 'bg-neon-pink/10 border-neon-pink text-neon-pink shadow-[0_0_15px_rgba(255,45,117,0.2)]'
                   : 'bg-dark-card border-white/10 text-white/70 hover:border-white/30 hover:text-white hover:bg-white/5'
               }`}
             >
               <Heart size={18} className={isFavorite ? "fill-neon-pink text-neon-pink" : "text-white/70 group-hover:text-white"} />
               <span>{isFavorite ? 'Salvo' : 'Favoritar'}</span>
             </button>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}

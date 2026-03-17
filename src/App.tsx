import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header/Header';
import { movieService } from './services/tmdb'; // Importamos o nosso "garçom"
import type { Movie } from './types/movie'; // Importamos o "contrato" do filme

import { MovieRow } from './components/MovieRow/MovieRow';

function App() {
  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const data = await movieService.getPopular();
        
        // Curadoria: Filtramos filmes com nota baixa (< 6.0) 
        // e pegamos apenas os 12 primeiros da lista
        const eliteMovies = data
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
    <Router>
      <div className="min-h-screen bg-dark-bg text-white">
        <Header />
        
        <main className="pt-20">
          <Routes>
            <Route path="/" element={
              <div className="py-6 space-y-4">
                {/* Seção Hero Refatorada: Mais elegante e equilibrada */}
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
                  
                  {/* Detalhe de luz de fundo para profundidade */}
                  <div className="absolute -top-24 -left-24 w-96 h-96 bg-neon-pink/5 blur-[120px] rounded-full pointer-events-none"></div>
                </header>

                {/* Fileira de Filmes Reais */}
                <div className="mt-4">
                  {movies.length > 0 ? (
                    <MovieRow title="Filmes Populares" movies={movies} />
                  ) : (
                    <div className="px-[5%] text-neon-pink animate-pulse font-light tracking-widest text-xs">
                      SINCRONIZANDO DADOS DO TMDB...
                    </div>
                  )}
                </div>
              </div>
            } />

          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;


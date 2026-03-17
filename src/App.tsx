import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header/Header';
import { movieService } from './services/tmdb'; // Importamos o nosso "garçom"
import type { Movie } from './types/movie'; // Importamos o "contrato" do filme

import { MovieRow } from './components/MovieRow/MovieRow';
import { MovieCard } from './components/MovieCard/MovieCard';
import { CategoryRow } from './components/CategoryRow/CategoryRow';

function App() {
  // Estado (memória) que guarda os filmes da página principal
  const [movies, setMovies] = useState<Movie[]>([]);

  // Estados (memórias) que controlam a Barra de Pesquisa
  const [searchResults, setSearchResults] = useState<Movie[]>([]); // Lista de filmes achados
  const [isSearching, setIsSearching] = useState(false);          // Site está em modo "pesquisa"?
  const [currentQuery, setCurrentQuery] = useState('');           // O que o usuário digitou?
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // 1. Buscando e guardando os Populares
        const popularData = await movieService.getPopular();
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

  // O "Telefone": Esta função atende a ligação que vem lá do <Header />
  // Quando o usuário pesquisa, ela pega o nome do filme e chama o "TMDB API"
  const handleSearch = async (query: string) => {
    // Se o usuário apagar o texto, voltamos pra página inicial
    if (!query || query.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    // Se tem pesquisa, avisamos o site e fazemos a requisição pra API
    setIsSearching(true);
    setCurrentQuery(query);
    
    try {
      const results = await movieService.searchMovies(query);
      setSearchResults(results);
    } catch (error) {
      console.error("Erro na busca de filmes:", error);
    }
  };

  return (
    <Router>
      <div className="min-h-screen bg-dark-bg text-white">
        {/* Passamos o "telefone" (onSearch) para o Header usar */}
        <Header onSearch={handleSearch} />
        
        <main className="pt-20">
          <Routes>
            <Route path="/" element={
              <div className="py-6 space-y-4">
                {isSearching ? (
                  // MODO PESQUISA: Se isSearching for "true", mostramos a lista de achados
                  <div className="pt-12 fade-in">
                    {searchResults.length > 0 ? (
                      <div className="px-[5%] space-y-6">
                        
                        {/* Botão de Voltar */}
                        <div className="flex items-center justify-between">
                          <button 
                            onClick={() => handleSearch('')}
                            className="flex items-center gap-2 text-text-muted hover:text-white transition-colors duration-300 group cursor-pointer"
                          >
                            <ArrowLeft size={16} className="group-hover:-translate-x-1 group-hover:text-neon-pink transition-transform duration-300" />
                            <span className="text-sm font-light">Voltar para Início</span>
                          </button>
                        </div>

                        {/* Título da Busca */}
                        <h2 className="text-xl sm:text-2xl font-semibold flex items-center mt-2">
                          <span className="w-1 h-6 bg-neon-pink mr-3 rounded-full shadow-neon"></span>
                          Resultados para: "{currentQuery}"
                        </h2>
                        
                        {/* Container Flexível (Grid) dos Resultados */}
                        <div className="flex flex-wrap gap-4 sm:gap-6 justify-center sm:justify-start pb-8">
                          {searchResults.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="px-[5%] mt-8 flex flex-col items-start gap-4 text-text-muted font-light">
                        <p>Ops! Não encontramos nenhum filme parecido com <span className="text-neon-pink">"{currentQuery}"</span>.</p>
                        
                        {/* Botão de Voltar (Também aparece quando não há resultados) */}
                        <button 
                          onClick={() => handleSearch('')}
                          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 group cursor-pointer mt-4"
                        >
                          <ArrowLeft size={16} className="group-hover:-translate-x-1 group-hover:text-neon-pink transition-transform duration-300" />
                          <span className="text-sm font-light">Voltar para Início</span>
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  // MODO NORMAL: Se estiver "false", mostramos a tela inicial que já criamos
                  <>
                    {/* Seção Hero Refatorada: Mais equilibrada */}
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

                    {/* Fileiras de Filmes */}
                    <div className="mt-4 pb-12 space-y-8">
                      {movies.length > 0 ? (
                        <>
                          {/* Os Gigantes (Populares são especiais e buscam primeiro) */}
                          <MovieRow title="Filmes Populares" movies={movies} />
                          
                          {/* O EXÉRCITO DE COMPONENTES INTELIGENTES: */}
                          {/* Cada um desses busca seus próprios filmes sozinhos */}
                          <CategoryRow title="Ficção Científica" genreId={878} featuredMovies={movies} />
                        </>
                      ) : (
                        <div className="px-[5%] text-neon-pink animate-pulse font-light tracking-widest text-xs">
                          SINCRONIZANDO DADOS DO TMDB...
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            } />

          </Routes>
        </main>
      </div>
    </Router>
  );
}


export default App;


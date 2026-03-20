import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header/Header';
import { movieService } from './services/tmdb';
import type { Movie } from './types/movie';

import { MovieCard } from './components/MovieCard/MovieCard';
import { Home } from './pages/Home';

function App() {
  // Estados para gerenciamento e controle da barra de pesquisa global
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');

  // Processa a pesquisa iniciada no componente Header
  const handleSearch = async (query: string) => {
    // Reseta o estado de pesquisa se a input estiver vazia
    if (!query || query.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
    // Atualiza o modo de pesquisa e executa a requisição na API
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
        <Header onSearch={handleSearch} />
        
        <main className="pt-20">
          <Routes>
            <Route path="/" element={
              <div className="py-6 space-y-4">
                {isSearching ? (
                  // Exibição condicional: Resultados da pesquisa ativa
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
                        
                        {/* Retorno à visualização padrão */}
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
                  // Exibição padrão: Rota da tela inicial
                  <Home />
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


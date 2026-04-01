import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Header } from './components/Header/Header';
import { Login } from './components/Login/Login'; // Nome amigável e fácil de achar
import { movieService } from './services/tmdb';
import type { Movie as MovieType } from './types/movie';

import { MovieCard } from './components/MovieCard/MovieCard';
import { Home } from './pages/Home';
import { Movie } from './pages/Movie';
import { Profile } from './pages/Profile'; // Nova página de Perfil!

function App() {
  // Estados de Busca Original
  const [searchResults, setSearchResults] = useState<MovieType[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [currentQuery, setCurrentQuery] = useState('');
  
  // NOVO: Estado que diz se a tela de login tá aberta (visível) ou não
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Processa a pesquisa iniciada no componente Header
  const handleSearch = async (query: string) => {
    if (!query || query.trim() === '') {
      setIsSearching(false);
      setSearchResults([]);
      return;
    }
    
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
      <div className="min-h-screen bg-dark-bg text-white relative">
        {/* Passamos o abridor do login pro Header, onde fica o botão! */}
        <Header onSearch={handleSearch} onOpenLogin={() => setIsLoginModalOpen(true)} />
        
        {/* Renderiza o nosso painel de login! Ele só fica visível se isOpen for true */}
        <Login 
          isOpen={isLoginModalOpen} 
          onClose={() => setIsLoginModalOpen(false)} 
        />
        
        <main className="pt-20">
          <Routes>
            {/* Rota do Perfil */}
            <Route path="/profile" element={<Profile />} />

            {/* 1. NOSSA ROTA MÁGICA: Aqui interceptamos a URL /movie/... */}
            <Route path="/movie/:id" element={<Movie />} />

            {/* 2. ROTA NORMAL (A TELA INICIAL) */}
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


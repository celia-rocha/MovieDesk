import { useState } from 'react';
import type { FormEvent } from 'react';
import { User, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onSearch: (query: string) => void;
  onOpenLogin: () => void; // Prop nova! A interface avisa que a Home vai ter essa função nova
}

export function Header({ onSearch, onOpenLogin }: HeaderProps) {
  // Estado local para controle da input de pesquisa
  const [searchQuery, setSearchQuery] = useState('');

  // Handle submit da barra de pesquisa
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault(); 
    
    // Dispara a prop onSearch se o parâmetro não for vazio
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
    }
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 glass px-4 sm:px-[5%] py-3 sm:py-4 flex justify-between items-center transition-all duration-300 bg-dark-bg/80">
      {/* Container de Logo Clicável (Volta pra Home) */}
      <Link to="/" className="font-poppins text-xl sm:text-2xl font-extrabold uppercase tracking-tighter shrink-0 cursor-pointer hover:opacity-80 transition-opacity">
        <span className="hidden min-[350px]:inline mr-1 text-white">MOVIE</span><span className="text-neon-pink shadow-neon">DESK</span>
      </Link>

      <div className="flex-1 flex justify-end items-center gap-2 sm:gap-6 ml-2">
        {/* Componente de Busca */}
        <form 
          onSubmit={handleSubmit}
          className="relative group flex-1 max-w-[180px] sm:max-w-xs transition-all duration-400"
        >
          <input 
            type="text" 
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full border border-neon-pink/20 py-1.5 sm:py-2 pl-3 pr-8 sm:px-6 rounded-full outline-none focus:border-neon-pink focus:shadow-neon transition-all text-xs sm:text-sm bg-dark-card text-white"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer z-10 hover:scale-110 transition-transform">
            <Search size={14} className="text-neon-pink/50 group-focus-within:text-neon-pink" />
          </button>
        </form>

        {/* --- LINKS E BOTÕES DA DIREITA --- */}

        {/* Botão de Perfil do Usuário */}
        <Link 
          to="/profile"
          className="group border border-neon-pink text-neon-pink p-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-neon-pink hover:text-white hover:shadow-neon transition-all duration-400 shrink-0 flex items-center gap-2"
        >
          <User size={16} className="text-neon-pink group-hover:text-white transition-colors" />
          <span className="hidden sm:inline">Perfil</span>
        </Link>

        {/* Componente de Login */}
        <button 
          onClick={onOpenLogin}
          className="border border-neon-pink text-neon-pink p-1.5 sm:px-4 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-neon-pink hover:text-white hover:shadow-neon transition-all duration-400 shrink-0 cursor-pointer"
        >
          <span className="hidden sm:inline z-10">Login</span>
          <User size={16} className="sm:hidden" />
        </button>
      </div>
    </header>
  );
}


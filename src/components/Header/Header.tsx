import { User, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="fixed top-0 left-0 w-full z-50 glass px-4 sm:px-[5%] py-3 sm:py-4 flex justify-between items-center transition-all duration-300 bg-dark-bg/80">
      {/* Logo: "MOVIE" some em telas muito pequenas */}
      <div className="font-poppins text-xl sm:text-2xl font-extrabold uppercase tracking-tighter shrink-0 cursor-pointer">
        <span className="hidden min-[350px]:inline mr-1">MOVIE</span><span className="text-neon-pink shadow-neon">DESK</span>
      </div>

      <div className="flex-1 flex justify-end items-center gap-2 sm:gap-6 ml-2">
        {/* Barra de Busca Flexível */}
        <div className="relative group flex-1 max-w-[140px] sm:max-w-xs transition-all duration-400">
          <input 
            type="text" 
            placeholder="Buscar..."
            className="w-full border border-neon-pink/20 py-1.5 sm:py-2 pl-3 pr-8 sm:px-6 rounded-full outline-none focus:border-neon-pink focus:shadow-neon transition-all text-xs sm:text-sm bg-dark-card text-white"
          />
          <Search size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neon-pink/50 group-focus-within:text-neon-pink pointer-events-none" />
        </div>

        {/* Botão de Login Adaptável */}
        <button className="border border-neon-pink text-neon-pink p-1.5 sm:px-5 sm:py-2 rounded-lg font-semibold text-[10px] sm:text-xs uppercase tracking-widest hover:bg-neon-pink hover:text-white hover:shadow-neon transition-all duration-400 shrink-0 cursor-pointer">
          <span className="hidden sm:inline">Login</span>
          <User size={16} className="sm:hidden" />
        </button>
      </div>
    </header>
  );
}


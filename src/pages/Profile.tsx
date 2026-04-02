import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, Heart, BookmarkPlus, CheckCircle2, Clock, Film, ArrowLeft, LogOut } from 'lucide-react';
import { auth } from '../services/firebase';
import { onAuthStateChanged, signOut, type User } from 'firebase/auth';

export function Profile() {
  const [activeTab, setActiveTab] = useState('favorites');
  const navigate = useNavigate();
  
  // Trazendo o "coração" do usuário para o Perfil
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Fica ouvindo ativamente: se tiver logado, pega os dados. Se não, avisa!
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe(); // Limpeza do react ao sair da página
  }, []);

  return (
    <div className="container mx-auto px-4 sm:px-[5%] py-8 animate-in fade-in duration-500">
      
      {/* Botão de Voltar para a página anterior */}
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-white/50 hover:text-white transition-colors duration-300 group cursor-pointer mb-6"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 group-hover:text-neon-pink transition-transform duration-300" />
        <span className="text-base font-normal">Voltar</span>
      </button>

      {/* 1. SEÇÃO PRINCIPAL DO PERFIL (HEADER) */}
      <div className="bg-dark-card border border-white/5 p-8 sm:p-10 rounded-3xl relative overflow-hidden mb-12 shadow-2xl">
        {/* Luzes de neon de fundo para o cartão */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon-pink/10 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6 sm:gap-10">
          
          {/* Avatar do Usuário */}
          <div className="shrink-0 relative group cursor-pointer">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full bg-gradient-to-tr from-neon-pink to-purple-600 p-[3px]">
              <div className="w-full h-full bg-dark-bg rounded-full flex items-center justify-center overflow-hidden border-4 border-dark-card">
                {/* Lógica Sênior: Se tiver foto no Google, mostra a foto. Senão mostra a primeira letra do nome */}
                {user?.photoURL ? (
                  <img 
                    src={user.photoURL} 
                    alt="Foto do usuário" 
                    className="w-full h-full object-cover" 
                    referrerPolicy="no-referrer" 
                  />
                ) : (
                  <span className="text-4xl font-light text-white/50">
                    {user?.displayName ? user.displayName.charAt(0).toUpperCase() : 'JD'}
                  </span>
                )}
              </div>
            </div>
            {/* Botão de editar foto que aparece ao passar o mouse */}
            <div className="absolute inset-0 bg-black/60 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Settings className="text-white" size={24} />
            </div>
          </div>

          {/* Textos e Estatísticas */}
          <div className="flex-1 text-center sm:text-left">
            {/* O Nome que puxa lá do Google */}
            <h1 className="text-3xl sm:text-5xl font-black text-white mb-2 tracking-tight">
              {user ? user.displayName : 'Cinéfilo Oculto'}
            </h1>
            <p className="text-text-muted font-light mb-4 sm:mb-6">
              {user ? user.email : 'Membro desde 2026'} • Cinéfilo de fim de semana
            </p>
            
            {/* Botão de Sair (Porque todo SaaS precisa deixar a pessoa ir embora!) */}
            {user && (
              <button 
                onClick={() => signOut(auth)}
                className="flex items-center gap-2 text-xs uppercase tracking-widest text-white/40 hover:text-neon-pink transition-colors mx-auto sm:mx-0 mb-6 bg-white/5 px-4 py-2 rounded-full border border-white/5 hover:border-neon-pink/30 cursor-pointer"
              >
                <LogOut size={14} />
                Desconectar
              </button>
            )}

            {/* Barrinha de Estatísticas Rápidas */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 sm:gap-8">
               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                 <Film className="text-neon-pink" size={20} />
                 <div className="text-left">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Assistidos</p>
                    <p className="text-lg font-bold text-white leading-none mt-1">0</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
                 <Clock className="text-purple-400" size={20} />
                 <div className="text-left">
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-semibold">Tempo de Tela</p>
                    <p className="text-lg font-bold text-white leading-none mt-1">0h</p>
                 </div>
               </div>
            </div>
          </div>

        </div>
      </div>


      {/* 2. NAVEGAÇÃO DE ABAS (TABS) */}
      <div className="flex items-center gap-6 border-b border-white/10 mb-8 overflow-x-auto no-scrollbar pb-1">
        
        <button 
          onClick={() => setActiveTab('favorites')}
          className={`pb-4 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === 'favorites' ? 'text-neon-pink border-b-2 border-neon-pink shadow-[0_4px_10px_rgba(255,45,117,0.3)]' : 'text-white/40 hover:text-white/80'}`}
        >
          <Heart size={18} className={activeTab === 'favorites' ? 'fill-neon-pink' : ''} />
          Filmes Favoritos
        </button>

        <button 
          onClick={() => setActiveTab('watchlist')}
          className={`pb-4 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === 'watchlist' ? 'text-neon-pink border-b-2 border-neon-pink shadow-[0_4px_10px_rgba(255,45,117,0.3)]' : 'text-white/40 hover:text-white/80'}`}
        >
          <BookmarkPlus size={18} />
          Quero Assistir
        </button>

        <button 
          onClick={() => setActiveTab('watched')}
          className={`pb-4 text-sm sm:text-base font-semibold transition-all duration-300 whitespace-nowrap flex items-center gap-2 ${activeTab === 'watched' ? 'text-neon-pink border-b-2 border-neon-pink shadow-[0_4px_10px_rgba(255,45,117,0.3)]' : 'text-white/40 hover:text-white/80'}`}
        >
          <CheckCircle2 size={18} />
          Já Assistidos
        </button>

      </div>


      {/* 3. CONTEÚDO DAS ABAS (MOCKUP VISUAL VAZIO) */}
      {/* Quando tivermos o banco de dados, aqui entrará o <MovieCard /> recheado de filmes */}
      <div className="min-h-[40vh] flex flex-col items-center justify-center p-8 border border-white/5 rounded-3xl bg-dark-card/30 border-dashed">
        
        {activeTab === 'favorites' && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-300">
            <Heart size={64} className="mx-auto text-white/5 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Nenhum Favorito ainda</h3>
            <p className="text-text-muted font-light max-w-sm mx-auto">Explore o catálogo e clique no coração nos filmes que mais te marcarem para construir seu mural de favoritos.</p>
          </div>
        )}

        {activeTab === 'watchlist' && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-300">
            <BookmarkPlus size={64} className="mx-auto text-white/5 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Sua lista está vazia</h3>
            <p className="text-text-muted font-light max-w-sm mx-auto">Sabe aquele filme que te indicaram? Salve ele aqui para não esquecer de assistir no fim de semana.</p>
          </div>
        )}

        {activeTab === 'watched' && (
          <div className="text-center animate-in fade-in zoom-in-95 duration-300">
            <CheckCircle2 size={64} className="mx-auto text-white/5 mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Seu diário cinematográfico</h3>
            <p className="text-text-muted font-light max-w-sm mx-auto">Marque os filmes como vistos para gerar suas estatísticas e lembrar exatamente de tudo o que você já assistiu.</p>
          </div>
        )}

      </div>

    </div>
  );
}

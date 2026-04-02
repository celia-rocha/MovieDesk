import { useState } from 'react';
import { X, Tv, Chrome, Mail, Lock } from 'lucide-react';

// O Poder do Back-end invadindo a tela! (Passo 4 Oficializado)
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import { useNavigate } from 'react-router-dom';

interface LoginProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Login({ isOpen, onClose }: LoginProps) {
  const navigate = useNavigate(); // O "Uber" do nosso React
  
  // Nossos estados para Email e Senha
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false); // Define se a pessoa está criando conta ou logando
  const [errorMsg, setErrorMsg] = useState('');

  // Função Sênior para chamar a janela do Google!
  const handleGoogleLogin = async () => {
    try {
      setErrorMsg('');
      const result = await signInWithPopup(auth, googleProvider);
      console.log("SUCESSO ABSOLUTO!", result.user.displayName, result.user.email);
      onClose(); 
      navigate('/profile'); 
    } catch (error) {
      console.error("Ops! Erro ao tentar login:", error);
      setErrorMsg("Infelizmente o Google encontrou um erro. Tente novamente!");
    }
  };

  // Função Sênior para fazer Login/Cadastro com Email e Senha
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Preencha os campos de email e senha.');
      return;
    }

    try {
      if (isRegistering) {
        // Criar Conta
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("CONTA CRIADA COM SUCESSO!");
      } else {
        // Logar
        await signInWithEmailAndPassword(auth, email, password);
        console.log("LOGIN COM E-MAIL FEITO COM SUCESSO!");
      }
      onClose();
      navigate('/profile');
    } catch (error: any) {
      console.error("Erro no Email/Senha:", error);
      setErrorMsg('Autenticação falhou. Tente novamente!');
    }
  };

  // Se o modal não estiver aberto, não renderizamos nada
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* 1. O Fundo Escuro Desfocado (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-md transition-opacity duration-300"
        onClick={onClose}
      ></div>

      {/* 2. O Cartão de Login (Efeito Glassmorphism / Vidro) */}
      <div className="relative w-full max-w-md bg-dark-bg/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-[0_0_50px_rgba(255,45,117,0.15)] animate-in fade-in zoom-in-95 duration-300 overflow-hidden">
        
        {/* Detalhe de Luz Neon no topo do Modal (Efeito Premium) */}
        <div className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-neon-pink to-transparent opacity-50 shadow-[0_0_20px_rgba(255,45,117,1)]"></div>

        {/* Botão de Fechar */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-white/50 hover:text-white hover:rotate-90 transition-all duration-300 cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Cabeçalho do Modal */}
        <div className="text-center mb-8 mt-2">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-dark-card border border-white/10 rounded-full flex items-center justify-center shadow-neon">
              <Tv className="text-neon-pink" size={24} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight mb-2">
             MovieDesk
          </h2>
          <p className="text-sm font-light text-text-muted">
            {isRegistering ? 'Crie sua conta para favoritar filmes.' : 'Sua biblioteca pessoal definitiva.'}
          </p>
        </div>

        {/* Botões Sociais (Google) */}
        <div className="space-y-3 mb-6">
          <button 
            type="button"
            onClick={handleGoogleLogin}
            className="cursor-pointer w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 px-4 rounded-xl hover:bg-gray-200 transition-colors duration-300 group"
          >
            {/* Ícone Genérico para representar rede social */}
            <Chrome className="text-black group-hover:scale-110 transition-transform" size={20} />
            Continuar com o Google
          </button>
        </div>

        {/* Divisor "OU" */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-[1px] bg-white/10"></div>
          <span className="text-xs font-medium text-white/40 uppercase tracking-widest">
            ou {isRegistering ? 'crie com email' : 'usando email'}
          </span>
          <div className="flex-1 h-[1px] bg-white/10"></div>
        </div>

        {/* Formulário de Email e Senha */}
        <form className="space-y-4" onSubmit={handleEmailAuth}>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-white/70 uppercase tracking-wider ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={16} className="text-white/40 group-focus-within:text-neon-pink transition-colors" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                required
                className="w-full bg-dark-card border border-white/10 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,45,117,0.2)] transition-all duration-300"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-between ml-1">
              <label className="text-xs font-semibold text-white/70 uppercase tracking-wider">Senha</label>
              {!isRegistering && (
                <a href="#" className="text-xs text-neon-pink hover:text-white transition-colors duration-300 font-light">Esqueceu?</a>
              )}
            </div>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={16} className="text-white/40 group-focus-within:text-neon-pink transition-colors" />
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="w-full bg-dark-card border border-white/10 text-white text-sm rounded-xl py-3 pl-10 pr-4 focus:outline-none focus:border-neon-pink focus:shadow-[0_0_15px_rgba(255,45,117,0.2)] transition-all duration-300"
              />
            </div>
          </div>

          {/* Mensagem de Erro Dinâmica */}
          {errorMsg && (
            <p className="text-neon-pink text-xs text-center font-medium animate-in fade-in">{errorMsg}</p>
          )}

          {/* Botão de Entrar/Criar */}
          <button 
            type="submit"
            className="cursor-pointer w-full bg-neon-pink text-white font-bold tracking-widest uppercase text-sm py-3.5 rounded-xl shadow-[0_0_20px_rgba(255,45,117,0.4)] hover:shadow-[0_0_30px_rgba(255,45,117,0.6)] hover:bg-[#ff1a66] transition-all duration-300 mt-2"
          >
            {isRegistering ? 'Criar Conta' : 'Entrar'}
          </button>
        </form>

        {/* Rodapé do Modal (Alterne entre Criar e Logar) */}
        <p className="text-center text-xs text-white/50 font-light mt-8">
          {isRegistering ? 'Já tem conta?' : 'Ainda não tem conta?'} {' '}
          <button 
            type="button" 
            onClick={() => setIsRegistering(!isRegistering)}
            className="font-semibold text-white hover:text-neon-pink transition-colors cursor-pointer"
          >
            {isRegistering ? 'Faça Login' : 'Crie uma agora'}
          </button>
        </p>

      </div>
    </div>
  );
}

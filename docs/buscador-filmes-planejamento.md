# Projeto: Buscador de Filmes — Planejamento Completo

## Sobre este documento

Este é o planejamento completo do projeto **Buscador de Filmes**, um site que consome a API do TMDB (The Movie Database) para exibir, buscar e organizar filmes. O projeto será desenvolvido em **4 fases**, cada uma construída em cima da anterior.

**Importante para o agente:** Este projeto é de aprendizado. A aluna está aprendendo React com TypeScript e este é o primeiro projeto dela que consome uma API real. Siga o ritmo descrito aqui: explique cada conceito antes de implementar, implemente uma coisa por vez, e espere a confirmação de que ela entendeu antes de avançar. Nunca gere todo o código de uma vez.

---

## Stack do Projeto

- **React 18+** com **TypeScript**
- **Vite** como bundler
- **Tailwind CSS** para estilização (com suporte a temas neon e dark)
- **Firebase Authentication** (fase 2) — login com Google
- **Cloud Firestore** (fase 3 e 4) — banco de dados para listas do usuário
- **React Router DOM** — navegação entre páginas
- **API:** TMDB v3 (The Movie Database)

---

## Tema Visual

O layout deve seguir um estilo **dark mode com acentos neon rosa/magenta**. Inspiração: cyberpunk, neon, dark UI moderna.

- Fundo principal: tons escuros (#0d0d0d, #1a1a2e, #16213e)
- Cor de destaque: rosa neon (#ff2d75), magenta (#e91e8c), rosa claro (#ff6b9d)
- Textos: branco (#ffffff) e cinza claro (#b0b0b0)
- Cards: fundo semi-transparente com borda sutil neon
- Hover: efeito glow rosa nos cards e botões
- Fonte: Inter, Poppins ou similar (Google Fonts)

---

## Sobre a API do TMDB

### O que é o TMDB?

O TMDB (The Movie Database) é um banco de dados gratuito e colaborativo de filmes e séries. Ele oferece uma API REST que permite buscar informações sobre filmes, séries, atores, imagens, trailers e muito mais. É a mesma base de dados usada por vários aplicativos de streaming e sites de cinema.

### Como funciona a autenticação

A API do TMDB usa um **Bearer Token** (também chamado de "API Read Access Token") para autenticar as requisições. A aluna já possui essa chave. Ela deve ser enviada no header de toda requisição:

```
Authorization: Bearer SEU_TOKEN_AQUI
```

**Regra de segurança:** a chave NUNCA deve ficar exposta no código que sobe pro GitHub. Ela deve ficar num arquivo `.env` na raiz do projeto:

```
VITE_TMDB_TOKEN=eyJhbGciOi...
```

E ser acessada no código assim:

```typescript
const TOKEN = import.meta.env.VITE_TMDB_TOKEN;
```

O arquivo `.env` deve estar no `.gitignore`.

### Base URL da API

Todas as requisições usam a mesma base:

```
https://api.themoviedb.org/3
```

### Como montar as imagens (posters e backdrops)

A API retorna apenas o **caminho** da imagem (ex: `/r3pPehX4ik8NLYPpbDRAh0YRtMb.jpg`). Para exibir a imagem completa, você precisa concatenar com a base URL de imagens:

```
https://image.tmdb.org/t/p/{tamanho}{caminho}
```

Tamanhos disponíveis para posters:

- `w92` — miniatura
- `w154` — pequeno
- `w185` — médio
- `w342` — card padrão (usar este nos cards)
- `w500` — grande
- `w780` — muito grande
- `original` — tamanho original

Exemplo completo:

```
https://image.tmdb.org/t/p/w342/r3pPehX4ik8NLYPpbDRAh0YRtMb.jpg
```

Para backdrops (imagens de fundo):

- `w300`, `w780`, `w1280`, `original`

### Endpoints que vamos usar no projeto

#### 1. Filmes em Tendência (Trending)

```
GET /trending/movie/week?language=pt-BR
```

Retorna os filmes mais populares da semana. Ótimo para o banner/hero da homepage.

#### 2. Filmes Populares

```
GET /movie/popular?language=pt-BR&page=1
```

Lista de filmes ordenados por popularidade. Atualiza diariamente.

#### 3. Filmes Mais Bem Avaliados

```
GET /movie/top_rated?language=pt-BR&page=1
```

Filmes com as melhores notas dos usuários do TMDB.

#### 4. Filmes em Cartaz (Lançamentos)

```
GET /movie/now_playing?language=pt-BR&page=1
```

Filmes que estão atualmente em cartaz nos cinemas.

#### 5. Próximos Lançamentos

```
GET /movie/upcoming?language=pt-BR&page=1
```

Filmes que vão estrear em breve.

#### 6. Buscar Filme por Nome

```
GET /search/movie?query=nome+do+filme&language=pt-BR&page=1
```

Busca filmes pelo título. O parâmetro `query` é o texto que o usuário digitou.

#### 7. Detalhes de um Filme

```
GET /movie/{movie_id}?language=pt-BR
```

Retorna todas as informações detalhadas de um filme específico: sinopse completa, gêneros, duração, data de lançamento, nota, etc.

#### 8. Créditos de um Filme (Elenco)

```
GET /movie/{movie_id}/credits?language=pt-BR
```

Retorna o elenco (cast) e a equipe técnica (crew) do filme.

#### 9. Vídeos de um Filme (Trailers)

```
GET /movie/{movie_id}/videos?language=pt-BR
```

Retorna os trailers e teasers do filme (geralmente do YouTube).

#### 10. Lista de Gêneros

```
GET /genre/movie/list?language=pt-BR
```

Retorna a lista completa de gêneros (Ação, Comédia, Drama, etc.) com seus IDs. Útil para converter os `genre_ids` que vêm nos filmes.

### Estrutura de dados de um filme (resposta da API)

Quando você busca uma lista de filmes (popular, trending, etc.), cada filme vem assim:

```json
{
  "id": 550,
  "title": "Clube da Luta",
  "original_title": "Fight Club",
  "overview": "Um homem deprimido que sofre de insônia...",
  "poster_path": "/r3pPehX4ik8NLYPpbDRAh0YRtMb.jpg",
  "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  "release_date": "1999-10-15",
  "vote_average": 8.438,
  "vote_count": 29696,
  "genre_ids": [18, 53, 35],
  "popularity": 134.463,
  "adult": false,
  "original_language": "en"
}
```

Campos que vamos usar:

- `id` — identificador único do filme (usado para buscar detalhes)
- `title` — título traduzido (pt-BR)
- `overview` — sinopse traduzida
- `poster_path` — caminho do poster (precisa concatenar com base URL)
- `backdrop_path` — imagem de fundo (para banners)
- `release_date` — data de lançamento (formato YYYY-MM-DD)
- `vote_average` — nota média (0 a 10)
- `genre_ids` — array de IDs dos gêneros

Quando você busca os **detalhes** de um filme específico (`/movie/{id}`), vem com mais informações:

```json
{
  "id": 550,
  "title": "Clube da Luta",
  "overview": "Um homem deprimido...",
  "poster_path": "/r3pPehX4ik8NLYPpbDRAh0YRtMb.jpg",
  "backdrop_path": "/hZkgoQYus5vegHoetLkCJzb17zJ.jpg",
  "release_date": "1999-10-15",
  "vote_average": 8.438,
  "vote_count": 29696,
  "runtime": 139,
  "status": "Released",
  "tagline": "Má conduta. Caos. Sabão.",
  "budget": 63000000,
  "revenue": 100853753,
  "genres": [
    { "id": 18, "name": "Drama" },
    { "id": 53, "name": "Thriller" }
  ],
  "production_companies": [...]
}
```

Campos extras nos detalhes:

- `runtime` — duração em minutos
- `tagline` — frase de efeito do filme
- `genres` — array de objetos com nome do gênero (ao invés de só IDs)
- `budget` e `revenue` — orçamento e receita

---

## FASE 1 — Homepage + Busca + Detalhes do Filme

### Objetivo

Criar a tela principal do site com visual neon/dark, exibindo filmes da API do TMDB em diferentes categorias, com busca funcional e página de detalhes. Ninguém precisa estar logado.

### O que a aluna vai aprender nesta fase

- `useEffect` — buscar dados quando a página carrega
- `useState` — armazenar os filmes retornados pela API
- `fetch` com async/await — fazer requisições HTTP
- `map` — renderizar listas de dados
- React Router — navegar entre páginas
- Variáveis de ambiente — proteger a chave da API
- TypeScript interfaces — tipar os dados da API

### Estrutura de pastas sugerida (Mobile-First + Tailwind)

```
src/
├── components/
│   ├── Header/
│   │   └── Header.tsx
│   ├── MovieCard/
│   │   └── MovieCard.tsx
│   ├── MovieRow/
│   │   └── MovieRow.tsx
│   ├── SearchBar/
│   │   └── SearchBar.tsx
│   └── Footer/
│       └── Footer.tsx
├── pages/
│   ├── Home/
│   │   └── Home.tsx
│   ├── MovieDetails/
│   │   └── MovieDetails.tsx
│   └── Search/
│       └── Search.tsx
├── services/
│   └── tmdb.ts
├── types/
│   └── movie.ts
├── App.tsx
├── index.css
└── main.tsx
```

### Passo a passo detalhado

#### Passo 1.1 — Criar o projeto e configurar o ambiente

**O que fazer:**

1. Criar o projeto com Vite: `npm create vite@latest buscador-filmes -- --template react-ts`
2. Instalar dependências: `npm install`
3. Instalar React Router: `npm install react-router-dom`
4. Criar o arquivo `.env` na raiz com a chave da API
5. Adicionar `.env` no `.gitignore`
6. Criar o repositório no GitHub
7. Fazer o primeiro commit

**Explicar antes de codar:**

- O que é uma variável de ambiente e por que usamos
- Como o Vite lê variáveis de ambiente (prefixo `VITE_`)
- Por que a chave da API não pode ir pro GitHub

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.2 — Criar o arquivo de tipos TypeScript

**O que fazer:**

1. Criar `src/types/movie.ts`
2. Definir a interface `Movie` com os campos que a API retorna
3. Definir a interface `MovieDetails` com os campos extras

**Explicar antes de codar:**

- O que é uma interface no TypeScript
- Por que tipamos os dados que vêm da API
- A diferença entre os dados de lista e os dados de detalhe

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.3 — Criar o serviço de conexão com a API

**O que fazer:**

1. Criar `src/services/tmdb.ts`
2. Criar constantes: `BASE_URL`, `TOKEN`, `IMAGE_BASE_URL`
3. Criar uma função auxiliar `fetchTMDB(endpoint)` que monta a URL e faz o fetch com o header de autenticação
4. Criar funções individuais: `getTrending()`, `getPopular()`, `getTopRated()`, `getNowPlaying()`, `searchMovies(query)`, `getMovieDetails(id)`

**Explicar antes de codar:**

- Como funciona o `fetch` com `async/await`
- O que é um header HTTP e por que mandamos o `Authorization`
- Como a API retorna os dados (o campo `results` dentro da resposta)
- O que é o `try/catch` e por que usamos

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.4 — Testar a conexão com a API

**O que fazer:**

1. No `App.tsx`, usar `useEffect` para chamar `getPopular()`
2. Exibir os dados no `console.log` para confirmar que a conexão funciona
3. Verificar no DevTools (aba Network) a requisição sendo feita
4. Verificar no Console os dados retornados

**Explicar antes de codar:**

- O que é `useEffect` e quando ele executa
- O array de dependências `[]` (executar só uma vez)
- Como abrir o DevTools e verificar a aba Network

**Parar aqui. Só avança quando os dados aparecerem no console.**

---

#### Passo 1.5 — Criar o componente Header

**O que fazer:**

1. Criar `Header.tsx` com o logo/nome do site e a barra de busca
2. Estilizar com o tema neon/dark
3. A barra de busca por enquanto só exibe, não funciona ainda

**Explicar antes de codar:**

- Componentização: por que separar o Header
- Props: como o componente recebe dados do pai (por enquanto pode ser vazio)

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.6 — Criar o componente MovieCard

**O que fazer:**

1. Criar `MovieCard.tsx` que recebe um filme via props
2. Exibir: poster, título, nota (vote_average) e ano de lançamento
3. Estilizar com o tema neon (card escuro, borda glow no hover)
4. O card deve ser clicável (vai navegar para a página de detalhes depois)

**Explicar antes de codar:**

- Como passar dados via props em TypeScript (tipando com a interface Movie)
- Como montar a URL completa da imagem do poster
- Como extrair só o ano da data (`release_date.split("-")[0]`)
- Como formatar a nota (ex: 8.4 ao invés de 8.438)

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.7 — Criar o componente MovieRow (carrossel horizontal)

**O que fazer:**

1. Criar `MovieRow.tsx` que recebe um título (ex: "Populares") e uma lista de filmes
2. Renderizar os MovieCards em uma linha horizontal com scroll
3. Estilizar com scroll horizontal suave

**Explicar antes de codar:**

- O método `map()` para renderizar listas
- A prop `key` e por que o React precisa dela
- CSS `overflow-x: auto` para scroll horizontal

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.8 — Montar a Home page

**O que fazer:**

1. Criar `Home.tsx`
2. Usar `useState` para armazenar cada categoria de filmes
3. Usar `useEffect` para buscar todas as categorias ao carregar a página
4. Banner/hero com o filme trending principal (backdrop como background)
5. Seções com MovieRow: Trending, Populares, Mais Bem Avaliados, Em Cartaz

**Explicar antes de codar:**

- Múltiplos `useState` (um para cada categoria)
- Estado de loading enquanto a API responde
- Como montar o banner com a imagem de fundo do filme em destaque

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.9 — Configurar React Router

**O que fazer:**

1. Instalar e configurar `BrowserRouter` no `main.tsx`
2. Definir as rotas no `App.tsx`: `/` (Home), `/movie/:id` (Detalhes), `/search` (Busca)
3. Fazer o MovieCard navegar para `/movie/{id}` ao ser clicado

**Explicar antes de codar:**

- O que é roteamento no React (SPA — Single Page Application)
- Rotas dinâmicas com parâmetros (`:id`)
- `useNavigate` para navegar programaticamente
- `Link` vs `useNavigate`

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.10 — Criar a página de Detalhes do Filme

**O que fazer:**

1. Criar `MovieDetails.tsx`
2. Usar `useParams()` para pegar o ID da URL
3. Usar `useEffect` para buscar os detalhes do filme pela API
4. Exibir: backdrop como fundo, poster, título, tagline, sinopse, gêneros, nota, duração, data de lançamento
5. Loading state enquanto busca os dados

**Explicar antes de codar:**

- `useParams()` — como pegar parâmetros da URL
- A diferença entre os dados de lista e os dados de detalhe
- Como exibir a duração em formato legível (ex: "2h 19min")

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.11 — Implementar a busca de filmes

**O que fazer:**

1. Criar `SearchBar.tsx` funcional com `useState` para o texto digitado
2. Ao submeter a busca, navegar para `/search?q=texto`
3. Criar `Search.tsx` que lê o parâmetro da URL e chama `searchMovies(query)`
4. Exibir os resultados em grid de MovieCards
5. Tratar caso sem resultados

**Explicar antes de codar:**

- `useSearchParams` para ler query strings da URL
- Debounce (conceito) — por que não buscar a cada tecla (pode implementar simples com setTimeout)
- Formulários controlados no React (input controlado por useState)

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.12 — Responsividade e ajustes finais

**O que fazer:**

1. Garantir que o layout funciona em mobile, tablet e desktop
2. Media queries para ajustar grid de cards e tamanho de fontes
3. Adicionar efeito de loading (spinner ou skeleton)
4. Tratar erros da API (mostrar mensagem amigável se a API falhar)

**Explicar antes de codar:**

- Media queries e breakpoints comuns
- O conceito de mobile-first

**Parar aqui e confirmar que entendeu.**

---

#### Passo 1.13 — Deploy e README

**O que fazer:**

1. Configurar o `vite.config.ts` com o `base` correto para GitHub Pages
2. Instalar `gh-pages`: `npm install --save-dev gh-pages`
3. Adicionar scripts de deploy no `package.json`
4. Fazer o deploy
5. Escrever o README com: descrição, screenshot, tecnologias usadas, como rodar localmente, link do deploy

**Explicar antes de codar:**

- Como o deploy funciona no GitHub Pages com SPA (problema do refresh em rotas)
- A importância de um README bem feito pro portfólio

**FIM DA FASE 1. Confirmar que tudo funciona antes de ir pra Fase 2.**

---

## FASE 2 — Autenticação com Google (Firebase Auth)

### Objetivo

Permitir que o usuário crie uma conta e faça login usando sua conta do Google. Isso vai ser necessário para as fases 3 e 4, onde o usuário salva suas listas pessoais.

### O que a aluna vai aprender nesta fase

- Firebase — configuração de projeto
- Firebase Authentication — login com Google
- Context API do React — estado global de autenticação
- Proteção de rotas — redirecionar se não estiver logado
- `onAuthStateChanged` — listener de mudança de estado de login

### Passo a passo detalhado

#### Passo 2.1 — Criar projeto no Firebase

**O que fazer:**

1. Acessar https://console.firebase.google.com
2. Criar um novo projeto (ex: "buscador-filmes")
3. Ativar o Authentication e habilitar o provedor "Google"
4. Registrar o app web no Firebase e copiar as configurações
5. Instalar o Firebase no projeto: `npm install firebase`
6. Criar `src/services/firebase.ts` com a configuração

**Explicar antes de codar:**

- O que é o Firebase e por que estamos usando (backend sem backend)
- O que é autenticação e por que precisamos dela
- A diferença entre Authentication (quem é o usuário) e Firestore (dados do usuário)
- As configurações do Firebase NÃO são secretas (são públicas, diferente da chave do TMDB)

**Parar aqui e confirmar que entendeu.**

---

#### Passo 2.2 — Criar o AuthContext

**O que fazer:**

1. Criar `src/contexts/AuthContext.tsx`
2. Criar o contexto com `createContext`
3. Criar o `AuthProvider` que usa `onAuthStateChanged` para escutar mudanças de login
4. Prover o estado do usuário (user, loading) para toda a aplicação
5. Envolver o `App` com o `AuthProvider`

**Explicar antes de codar:**

- O que é Context API e por que usamos (evitar prop drilling)
- O que é `onAuthStateChanged` (listener em tempo real do Firebase)
- O padrão Provider/Consumer
- O hook `useContext` para consumir o contexto

**Parar aqui e confirmar que entendeu.**

---

#### Passo 2.3 — Criar funções de login e logout

**O que fazer:**

1. No `firebase.ts`, criar `signInWithGoogle()` usando `GoogleAuthProvider` e `signInWithPopup`
2. Criar `logout()` usando `signOut`
3. Exportar essas funções

**Explicar antes de codar:**

- O fluxo do login com Google (popup abre, usuário escolhe conta, Firebase recebe o token)
- O que acontece internamente quando o login é feito

**Parar aqui e confirmar que entendeu.**

---

#### Passo 2.4 — Implementar no Header

**O que fazer:**

1. Adicionar no Header: se não logado, mostrar botão "Entrar com Google"
2. Se logado, mostrar foto do usuário, nome e botão "Sair"
3. Conectar os botões às funções de login/logout

**Explicar antes de codar:**

- Renderização condicional (`user ? ... : ...`)
- Como acessar dados do usuário do Firebase (`user.displayName`, `user.photoURL`, `user.email`)

**Parar aqui e confirmar que entendeu.**

---

#### Passo 2.5 — Criar a página de Perfil

**O que fazer:**

1. Criar `src/pages/Profile/Profile.tsx`
2. Exibir foto, nome e email do usuário
3. Adicionar rota `/profile` no Router
4. Proteger a rota: se não logado, redirecionar para Home
5. Adicionar link pro perfil no Header (quando logado)

**Explicar antes de codar:**

- Proteção de rotas: componente `PrivateRoute` que checa se está logado
- `Navigate` do React Router para redirecionar

**Parar aqui e confirmar que entendeu.**

---

#### Passo 2.6 — Testes e deploy

**O que fazer:**

1. Testar login e logout
2. Testar o estado persistido (se recarregar a página, continua logado?)
3. Testar a proteção de rota do perfil
4. Atualizar o deploy
5. Atualizar o README com as novas features

**FIM DA FASE 2. Confirmar que tudo funciona antes de ir pra Fase 3.**

---

## FASE 3 — Listas Pessoais (Já Assisti / Quero Assistir)

### Objetivo

Permitir que o usuário logado marque filmes como "Já Assisti" ou "Quero Assistir" e dê uma nota (1 a 5 estrelas) nos filmes que já assistiu. Os dados ficam salvos no Firestore.

### O que a aluna vai aprender nesta fase

- Cloud Firestore — criar, ler, atualizar e deletar dados (CRUD)
- Modelagem de dados no Firestore (coleções e documentos)
- Operações assíncronas com Firestore
- Componente de avaliação por estrelas

### Estrutura de dados no Firestore

```
users/
  └── {userId}/
      └── movies/
          └── {movieId}/
              ├── movieId: number
              ├── title: string
              ├── posterPath: string
              ├── voteAverage: number
              ├── releaseDate: string
              ├── status: "watched" | "watchlist"
              ├── userRating: number | null  (1 a 5, só pra "watched")
              ├── addedAt: timestamp
              └── updatedAt: timestamp
```

### Passo a passo detalhado

#### Passo 3.1 — Configurar o Firestore

**O que fazer:**

1. No Firebase Console, ativar o Cloud Firestore
2. Configurar as regras de segurança (só o próprio usuário pode ler/escrever seus dados)
3. Adicionar a configuração do Firestore no `firebase.ts`

**Explicar antes de codar:**

- O que é o Firestore (banco NoSQL orientado a documentos)
- Diferença entre coleção e documento
- O que são as regras de segurança e por que são importantes
- A estrutura de dados que vamos usar e por que organizamos assim

**Parar aqui e confirmar que entendeu.**

---

#### Passo 3.2 — Criar o serviço de filmes do usuário

**O que fazer:**

1. Criar `src/services/userMovies.ts`
2. Criar funções:
   - `addToWatchlist(userId, movie)` — adicionar à lista "Quero Assistir"
   - `markAsWatched(userId, movie)` — marcar como "Já Assisti"
   - `removeMovie(userId, movieId)` — remover da lista
   - `rateMovie(userId, movieId, rating)` — dar nota de 1 a 5
   - `getUserMovie(userId, movieId)` — verificar se o filme já está na lista
   - `getUserMovies(userId, status)` — buscar todos os filmes de uma lista

**Explicar antes de codar:**

- `addDoc`, `setDoc`, `getDoc`, `getDocs`, `updateDoc`, `deleteDoc` do Firestore
- `collection`, `doc`, `query`, `where` — como consultar dados
- Por que usamos o ID do filme do TMDB como ID do documento

**Parar aqui e confirmar que entendeu.**

---

#### Passo 3.3 — Criar os botões de ação no MovieCard e MovieDetails

**O que fazer:**

1. Na página de detalhes do filme, adicionar dois botões: "Quero Assistir" e "Já Assisti"
2. Se o usuário não estiver logado, o botão abre um alerta pedindo para fazer login
3. Se já está na lista, mudar o visual do botão (ex: "Na sua lista ✓")
4. Usar `useEffect` para verificar se o filme já está na lista quando a página carrega

**Explicar antes de codar:**

- Chamadas assíncronas no clique do botão
- Feedback visual (loading no botão enquanto salva)
- Verificação de estado: o filme já está na lista?

**Parar aqui e confirmar que entendeu.**

---

#### Passo 3.4 — Criar o componente de avaliação por estrelas

**O que fazer:**

1. Criar `src/components/StarRating/StarRating.tsx`
2. Exibir 5 estrelas clicáveis
3. Hover mostra preview da nota
4. Clique salva a nota no Firestore
5. Exibir a nota atual se já avaliou

**Explicar antes de codar:**

- Estado local para o hover vs estado real (nota salva)
- Como o componente recebe e envia dados (props e callbacks)
- Ícones de estrela (pode usar caracteres unicode ou SVG simples)

**Parar aqui e confirmar que entendeu.**

---

#### Passo 3.5 — Integrar a avaliação na página de detalhes

**O que fazer:**

1. Quando o filme tem status "watched", exibir o componente StarRating
2. Quando o usuário dá uma nota, salvar no Firestore
3. Exibir a nota do usuário ao lado da nota do TMDB

**Parar aqui e confirmar que entendeu.**

---

#### Passo 3.6 — Testes e deploy

**O que fazer:**

1. Testar adicionar filme à watchlist
2. Testar marcar como assistido
3. Testar dar nota
4. Testar remover da lista
5. Testar com usuário deslogado (botões devem pedir login)
6. Atualizar deploy e README

**FIM DA FASE 3. Confirmar que tudo funciona antes de ir pra Fase 4.**

---

## FASE 4 — Página do Usuário (Minhas Listas)

### Objetivo

Criar a página de perfil completa do usuário com suas duas listas: "Já Assisti" e "Quero Assistir". Permitir ordenação, remoção e visualização organizada.

### O que a aluna vai aprender nesta fase

- Tabs/abas para alternar entre listas
- Ordenação de arrays (`sort`)
- Filtros
- Gerenciamento de estado mais complexo
- UX de listas interativas

### Passo a passo detalhado

#### Passo 4.1 — Criar as abas na página de Perfil

**O que fazer:**

1. Adicionar duas abas na página de Perfil: "Já Assisti" e "Quero Assistir"
2. Usar `useState` para controlar qual aba está ativa
3. Buscar os filmes da aba ativa no Firestore

**Explicar antes de codar:**

- Componente de abas (tab) com estado
- Como buscar dados filtrados do Firestore

**Parar aqui e confirmar que entendeu.**

---

#### Passo 4.2 — Exibir a lista "Já Assisti"

**O que fazer:**

1. Exibir os filmes que o usuário marcou como assistidos
2. Mostrar: poster (miniatura), título, nota do TMDB, nota do usuário (estrelas), data que adicionou
3. Botão para remover da lista
4. Permitir ordenar por: nota do usuário (maior → menor), data que adicionou (mais recente), título (A-Z)

**Explicar antes de codar:**

- O método `sort()` em arrays JavaScript
- Como funciona a comparação para ordenar (números vs strings)
- Estado para controlar o critério de ordenação atual

**Parar aqui e confirmar que entendeu.**

---

#### Passo 4.3 — Exibir a lista "Quero Assistir"

**O que fazer:**

1. Exibir os filmes que o usuário quer assistir
2. Mostrar: poster, título, nota do TMDB, gênero, data que adicionou
3. Botão para mover para "Já Assisti" (muda o status no Firestore)
4. Botão para remover da lista
5. Permitir ordenar por: data que adicionou, nota do TMDB, título

**Explicar antes de codar:**

- Atualização de documento no Firestore (mudar status de "watchlist" para "watched")
- Feedback visual quando move o filme de lista

**Parar aqui e confirmar que entendeu.**

---

#### Passo 4.4 — Estatísticas do usuário

**O que fazer:**

1. No topo do perfil, mostrar um resumo:
   - Total de filmes assistidos
   - Total na lista de desejos
   - Nota média que o usuário dá
   - Gênero mais assistido (se possível)
2. Visual com cards de estatísticas no tema neon

**Explicar antes de codar:**

- Como calcular médias e contagens a partir de uma lista
- O método `reduce()` para agregar dados

**Parar aqui e confirmar que entendeu.**

---

#### Passo 4.5 — Ajustes finais e polish

**O que fazer:**

1. Animações de transição ao mudar de aba
2. Confirmação antes de remover um filme (modal simples)
3. Estado vazio: mensagem amigável quando a lista está vazia
4. Responsividade da página de perfil
5. Limpar console.logs e código morto

**Parar aqui e confirmar que entendeu.**

---

#### Passo 4.6 — Deploy final e README completo

**O que fazer:**

1. Deploy final no GitHub Pages
2. README completo com:
   - Descrição do projeto
   - Screenshots de cada tela (Home, Detalhes, Busca, Perfil)
   - Tecnologias usadas
   - Features implementadas
   - Como rodar localmente
   - Link do deploy
3. Atualizar o card no portfólio pessoal

**FIM DA FASE 4. Projeto completo.**

---

## Resumo das Fases

| Fase | Foco                        | Conceitos Principais                                      |
| ---- | --------------------------- | --------------------------------------------------------- |
| 1    | Homepage + Busca + Detalhes | useEffect, useState, fetch, map, Router, TypeScript       |
| 2    | Autenticação Google         | Firebase Auth, Context API, proteção de rotas             |
| 3    | Listas pessoais             | Firestore CRUD, componente de estrelas, estado assíncrono |
| 4    | Página do usuário           | Ordenação, filtros, reduce, tabs, UX de listas            |

## Regras Gerais para o Agente

1. **Nunca gere todo o código de uma fase de uma vez.** Siga os passos.
2. **Explique o conceito antes de mostrar o código.** A aluna precisa entender o "porquê".
3. **Espere confirmação** antes de avançar para o próximo passo.
4. **Use TypeScript sempre.** Tipe todas as props, estados e retornos de funções.
5. **Componentize desde o início** (diferente do projeto anterior que ficou tudo no Home.tsx).
6. **Mantenha o tema visual** dark/neon rosa em todos os componentes.
7. **Não use bibliotecas de UI** (Material UI, Chakra, etc.) — o CSS é manual para aprendizado.
8. **Commits frequentes** com mensagens descritivas em português.
9. **Nenhum arquivo de estudo/resumo** dentro do repositório.
10. **A chave da API vai no .env** e nunca no código direto.

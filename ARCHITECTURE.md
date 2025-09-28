# CapyUniverse - Arquitetura Refatorada

## 🏗️ Estrutura Modular

### 1. Context API & Estado Global
- **`useApp.tsx`**: Context principal com reducer para estado global
- Estados centralizados: API key, favoritos, loading, navegação, busca, offline
- Persistência automática no localStorage
- Detecção de status online/offline

### 2. Custom Hooks
- **`useGestures.tsx`**: Gestos nativos (swipe, long press, pull-to-refresh)
- **`useGemini.tsx`**: Integração com API Gemini + tratamento offline
- **`useApp.tsx`**: Hook principal para acessar estado global

### 3. Componentes Separados
- **`Header.tsx`**: Cabeçalho com indicador offline
- **`BottomNav.tsx`**: Navegação inferior com estados ativos
- **`HomePage.tsx`**: Página inicial com destaques
- **`ToolsPage.tsx`**: Lista de ferramentas com busca/filtros
- **`ExplorerPage.tsx`**: Exploração de coleções
- **`ProfilePage.tsx`**: Configurações e favoritos
- **`ApiKeyModal.tsx`**: Modal de configuração da API

### 4. Componentes Mobile-First
- **`PullToRefresh.tsx`**: Pull-to-refresh nativo
- **`SwipeableCard.tsx`**: Cards com gestos de swipe
- **`ErrorBoundary.tsx`**: Tratamento de erros em nível de componente

## 🎯 Melhorias UX/UI

### Gestos Nativos
- ✅ Swipe horizontal entre abas
- ✅ Pull-to-refresh nas listas
- ✅ Long press para favoritar
- ✅ Swipe em cards para ações rápidas

### Feedback Tátil
- ✅ Vibração em ações importantes
- ✅ Animações de transição suaves
- ✅ Estados visuais claros

### Modo Offline
- ✅ Indicador de status offline
- ✅ Mensagens contextuais
- ✅ Funcionalidade degradada graceful

### Acessibilidade
- ✅ ARIA labels em todos os botões
- ✅ Focus rings visíveis
- ✅ Navegação por teclado
- ✅ Contraste adequado

## 🔧 Arquitetura de Dados

### Estado Global (useApp)
```typescript
interface AppState {
  apiKey: string;
  favorites: string[];
  isLoading: boolean;
  activeTab: 'home' | 'tools' | 'explorer' | 'profile';
  searchQuery: string;
  selectedCategory: string;
  isOffline: boolean;
}
```

### Ações do Reducer
- `SET_API_KEY`: Configura chave da API
- `TOGGLE_FAVORITE`: Adiciona/remove favoritos
- `SET_LOADING`: Controla estados de loading
- `SET_ACTIVE_TAB`: Navegação entre abas
- `SET_SEARCH_QUERY`: Busca de ferramentas
- `SET_CATEGORY`: Filtro por categoria
- `SET_OFFLINE`: Status de conectividade

## 📱 Componentes Reutilizáveis

### SwipeableCard
- Swipe left/right para ações
- Feedback visual das ações
- Customizável (ícones, cores, labels)

### PullToRefresh
- Threshold configurável
- Animações suaves
- Feedback visual do progresso

### ErrorBoundary
- Captura erros em runtime
- Interface de recuperação
- Logs detalhados para debug

## 🚀 Benefícios da Refatoração

1. **Separação de Responsabilidades**: Cada componente tem uma função específica
2. **Reutilização**: Componentes modulares e reutilizáveis
3. **Manutenibilidade**: Código mais limpo e organizados
4. **Performance**: Estado otimizado e re-renders controlados
5. **UX Mobile**: Gestos nativos e feedback tátil
6. **Robustez**: Error boundaries e tratamento de erros
7. **Acessibilidade**: Suporte completo a tecnologias assistivas

## 📦 Estrutura de Arquivos

```
src/
├── components/
│   ├── CapyUniverse.tsx      # Componente principal
│   ├── Header.tsx            # Cabeçalho
│   ├── BottomNav.tsx         # Navegação inferior
│   ├── HomePage.tsx          # Página inicial
│   ├── ToolsPage.tsx         # Lista de ferramentas
│   ├── ExplorerPage.tsx      # Exploração
│   ├── ProfilePage.tsx       # Perfil/configurações
│   ├── ApiKeyModal.tsx       # Modal da API
│   ├── PullToRefresh.tsx     # Pull-to-refresh
│   ├── SwipeableCard.tsx     # Cards com gestos
│   └── ErrorBoundary.tsx     # Tratamento de erros
├── hooks/
│   ├── useApp.tsx            # Context + estado global
│   ├── useGestures.tsx       # Gestos nativos
│   └── useGemini.tsx         # API Gemini
└── ...
```

Esta arquitetura fornece uma base sólida, escalável e focada na experiência mobile-first do CapyUniverse.
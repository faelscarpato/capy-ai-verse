import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface AppState {
  apiKey: string;
  favorites: string[];
  isLoading: boolean;
  activeTab: 'home' | 'tools' | 'explorer' | 'profile';
  searchQuery: string;
  selectedCategory: string;
  isOffline: boolean;
}

type AppAction = 
  | { type: 'SET_API_KEY'; payload: string }
  | { type: 'TOGGLE_FAVORITE'; payload: string }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ACTIVE_TAB'; payload: AppState['activeTab'] }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'SET_OFFLINE'; payload: boolean };

const initialState: AppState = {
  apiKey: '',
  favorites: [],
  isLoading: false,
  activeTab: 'home',
  searchQuery: '',
  selectedCategory: 'Todos',
  isOffline: false
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_API_KEY':
      return { ...state, apiKey: action.payload };
    case 'TOGGLE_FAVORITE':
      const favorites = state.favorites.includes(action.payload)
        ? state.favorites.filter(id => id !== action.payload)
        : [...state.favorites, action.payload];
      return { ...state, favorites };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ACTIVE_TAB':
      return { ...state, activeTab: action.payload };
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    case 'SET_OFFLINE':
      return { ...state, isOffline: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const savedApiKey = localStorage.getItem('capyuniverse-api-key');
    const savedFavorites = localStorage.getItem('capyuniverse-favorites');
    
    if (savedApiKey) dispatch({ type: 'SET_API_KEY', payload: savedApiKey });
    if (savedFavorites) {
      JSON.parse(savedFavorites).forEach((id: string) => 
        dispatch({ type: 'TOGGLE_FAVORITE', payload: id })
      );
    }

    const updateOnlineStatus = () => dispatch({ type: 'SET_OFFLINE', payload: !navigator.onLine });
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
    };
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
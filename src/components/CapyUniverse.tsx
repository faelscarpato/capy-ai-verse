import React, { useState, useRef, useEffect, useCallback } from 'react';
import { AppProvider } from '@/hooks/useApp';
import { ErrorBoundary } from './ErrorBoundary';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { PullToRefresh } from './PullToRefresh';
import { HomePage } from './HomePage';
import { ToolsPage } from './ToolsPage';
import { ExplorerPage } from './ExplorerPage';
import { ProfilePage } from './ProfilePage';
import { ApiKeyModal } from './ApiKeyModal';
import { useApp } from '@/hooks/useApp';
import { useGestures } from '@/hooks/useGestures';
import { toast } from '@/hooks/use-toast';

const TABS = ['home', 'tools', 'explorer', 'profile'] as const;
type Tab = (typeof TABS)[number];

const CapyUniverseContent: React.FC = () => {
  const { state, dispatch } = useApp();
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const refreshTimeout = useRef<NodeJS.Timeout | null>(null);

  const handleTabChange = useCallback((direction: 1 | -1) => {
    const currentIndex = TABS.indexOf(state.activeTab);
    const newIndex = currentIndex + direction;

    if (newIndex >= 0 && newIndex < TABS.length) {
      dispatch({ type: 'SET_ACTIVE_TAB', payload: TABS[newIndex] });
    }
  }, [dispatch, state.activeTab]);

  const { attachGestures } = useGestures({
    onSwipeLeft: () => handleTabChange(1),
    onSwipeRight: () => handleTabChange(-1),
  });

  useEffect(() => {
    const cleanup = attachGestures(containerRef.current);
    return () => {
      cleanup();
      if (refreshTimeout.current) {
        clearTimeout(refreshTimeout.current);
      }
    };
  }, [attachGestures]);

  const handleRefresh = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    refreshTimeout.current = setTimeout(() => {
      dispatch({ type: 'SET_LOADING', payload: false });
      toast({ title: "Atualizado!", description: "Conteúdo atualizado com sucesso." });
    }, 1000);
  };

  const renderPage = () => {
    switch (state.activeTab) {
      case 'home': return <HomePage />;
      case 'tools': return <ToolsPage />;
      case 'explorer': return <ExplorerPage />;
      case 'profile': return <ProfilePage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-background" ref={containerRef}>
      <Header onSettingsClick={() => setIsApiKeyModalOpen(true)} />
      
      <main className="pt-16 pb-20 px-4">
        <PullToRefresh onRefresh={handleRefresh}>
          {renderPage()}
        </PullToRefresh>
      </main>

      <BottomNav />
      
      <ApiKeyModal 
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
      />
    </div>
  );
};

export default function CapyUniverse() {
  return (
    <ErrorBoundary>
      <AppProvider>
        <CapyUniverseContent />
      </AppProvider>
    </ErrorBoundary>
  );
}
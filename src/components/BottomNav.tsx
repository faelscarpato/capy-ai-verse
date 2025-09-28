import React from 'react';
import { Button } from '@/components/ui/button';
import { Home, Zap, Search, User } from 'lucide-react';
import { useApp } from '@/hooks/useApp';

export const BottomNav: React.FC = () => {
  const { state, dispatch } = useApp();

  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'tools', icon: Zap, label: 'Ferramentas' }, 
    { id: 'explorer', icon: Search, label: 'Explorar' },
    { id: 'profile', icon: User, label: 'Perfil' }
  ] as const;

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border elevation-2">
      <div className="grid grid-cols-4 h-16">
        {tabs.map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: tab.id })}
            className={`flex flex-col items-center justify-center h-full gap-1 rounded-none focus-ring ${
              state.activeTab === tab.id 
                ? 'text-primary bg-primary/10' 
                : 'text-muted-foreground hover:text-foreground'
            }`}
            aria-label={tab.label}
          >
            <tab.icon className="h-5 w-5" />
            <span className="text-xs font-medium">{tab.label}</span>
          </Button>
        ))}
      </div>
    </nav>
  );
};
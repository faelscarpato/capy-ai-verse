import React from 'react';
import { Button } from '@/components/ui/button';
import { Settings, WifiOff } from 'lucide-react';
import { useApp } from '@/hooks/useApp';

interface HeaderProps {
  onSettingsClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick }) => {
  const { state } = useApp();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-primary backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold text-primary-foreground">CapyUniverse</h1>
          {state.isOffline && (
            <WifiOff className="h-4 w-4 text-primary-foreground/70" />
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onSettingsClick}
          className="text-primary-foreground hover:bg-white/20 focus-ring"
          aria-label="Configurações"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );
};
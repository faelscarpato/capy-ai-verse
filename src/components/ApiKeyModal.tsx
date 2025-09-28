import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useApp } from '@/hooks/useApp';
import { toast } from '@/hooks/use-toast';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();

  const handleSave = () => {
    if (state.apiKey.trim()) {
      localStorage.setItem('capyuniverse-api-key', state.apiKey.trim());
      onClose();
      toast({
        title: "Chave API salva!",
        description: "Sua chave foi armazenada com segurança no dispositivo.",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Configurar Chave API do Gemini</DialogTitle>
          <DialogDescription>
            Para usar as ferramentas de IA, você precisa de uma chave API do Google Gemini.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chave API</label>
            <Input
              type="password"
              placeholder="Cole sua chave API aqui..."
              value={state.apiKey}
              onChange={(e) => dispatch({ type: 'SET_API_KEY', payload: e.target.value })}
              className="focus-ring"
            />
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Como obter sua chave:</h4>
            <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
              <li>Acesse o <a href="https://aistudio.google.com" target="_blank" rel="noopener" className="text-primary hover:underline">Google AI Studio</a></li>
              <li>Faça login com sua conta Google</li>
              <li>Clique em "Get API Key"</li>
              <li>Crie uma nova chave API</li>
              <li>Cole a chave aqui</li>
            </ol>
          </div>
          
          <div className="bg-muted/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground">
              🔒 <strong>Privacidade:</strong> Sua chave é salva apenas localmente no seu navegador. 
              Nunca enviamos sua chave para nossos servidores.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onClose}
            className="flex-1 focus-ring"
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSave}
            disabled={!state.apiKey.trim()}
            className="flex-1 focus-ring"
          >
            Salvar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
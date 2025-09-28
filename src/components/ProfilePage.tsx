import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Settings, Heart } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { toast } from '@/hooks/use-toast';

export const ProfilePage: React.FC = () => {
  const { state, dispatch } = useApp();

  const handleSaveApiKey = () => {
    if (state.apiKey.trim()) {
      localStorage.setItem('capyuniverse-api-key', state.apiKey.trim());
      toast({
        title: "Chave API salva!",
        description: "Sua chave foi armazenada com segurança no dispositivo.",
      });
    }
  };

  const handleClearData = () => {
    localStorage.removeItem('capyuniverse-api-key');
    localStorage.removeItem('capyuniverse-favorites');
    localStorage.removeItem('capyuniverse-history');
    dispatch({ type: 'SET_API_KEY', payload: '' });
    state.favorites.forEach(id => dispatch({ type: 'TOGGLE_FAVORITE', payload: id }));
    toast({
      title: "Dados limpos",
      description: "Todos os dados locais foram removidos."
    });
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Perfil</h2>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Configurações da API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Chave Google Gemini API</label>
            <Input
              type="password"
              placeholder="Insira sua chave API..."
              value={state.apiKey}
              onChange={(e) => dispatch({ type: 'SET_API_KEY', payload: e.target.value })}
              className="focus-ring"
            />
          </div>
          <Button 
            onClick={handleSaveApiKey}
            disabled={!state.apiKey.trim()}
            className="w-full focus-ring"
          >
            Salvar Chave API
          </Button>
          <p className="text-xs text-muted-foreground">
            Sua chave é salva localmente no navegador e usada apenas para chamadas diretas à API Gemini.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Ferramentas Favoritas ({state.favorites.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {state.favorites.length > 0 ? (
            <div className="space-y-2">
              {state.favorites.map((toolId) => (
                <div 
                  key={toolId}
                  className="flex items-center gap-3 p-3 rounded-lg bg-muted/50"
                >
                  <div className="flex-1">
                    <p className="font-medium text-sm">{toolId}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">
              Nenhuma ferramenta favoritada ainda
            </p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive"
            onClick={handleClearData}
            className="w-full focus-ring"
          >
            Limpar Todos os Dados Locais
          </Button>
          <p className="text-xs text-muted-foreground mt-2">
            Isso remove chaves API, favoritos e histórico permanentemente.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
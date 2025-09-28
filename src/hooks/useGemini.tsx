import { useState, useCallback } from 'react';
import { toast } from '@/hooks/use-toast';
import { useApp } from './useApp';

export const useGemini = () => {
  const { state } = useApp();
  const [isLoading, setIsLoading] = useState(false);

  const callAPI = useCallback(async (prompt: string): Promise<string> => {
    if (!state.apiKey) {
      toast({
        title: "Chave API necessária",
        description: "Configure sua chave do Google Gemini primeiro.",
        variant: "destructive"
      });
      return 'Chave API não encontrada.';
    }

    if (state.isOffline) {
      toast({
        title: "Modo offline",
        description: "Esta funcionalidade requer conexão com a internet.",
        variant: "destructive"
      });
      return 'Funcionalidade indisponível offline.';
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${state.apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
          })
        }
      );

      const data = await response.json();
      
      if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('Resposta da API inválida');
      }
    } catch (error: any) {
      toast({
        title: "Erro na API",
        description: `Falha ao processar: ${error.message}`,
        variant: "destructive"
      });
      return `Erro: ${error.message}`;
    } finally {
      setIsLoading(false);
    }
  }, [state.apiKey, state.isOffline]);

  return { callAPI, isLoading };
};
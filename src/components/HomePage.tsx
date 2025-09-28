import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Brain, Code2 } from 'lucide-react';
import { useApp } from '@/hooks/useApp';

const toolsData = [
  { id: "capyresumo", name: "CapyResumo", description: "Resuma qualquer texto em segundos", category: "Produtividade", icon: FileText },
  { id: "capyexplica", name: "CapyExplica", description: "Explique conceitos complexos de forma simples", category: "Educação", icon: Brain },
  { id: "capyide", name: "CapyIDE", description: "Gere código profissional", category: "Desenvolvimento", icon: Code2 }
];

export const HomePage: React.FC = () => {
  const { dispatch } = useApp();

  return (
    <div className="space-y-8">
      <section className="text-center py-12 bg-gradient-primary rounded-xl text-primary-foreground">
        <h2 className="text-3xl font-bold mb-4">Bem-vindo ao CapyUniverse</h2>
        <p className="text-lg opacity-90 mb-6 px-4">
          Sua plataforma de IA generativa para produtividade e aprendizado
        </p>
        <Button 
          onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'tools' })}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          Explorar Ferramentas
        </Button>
      </section>

      <section>
        <h3 className="text-xl font-semibold mb-4">Destaques</h3>
        <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x">
          {toolsData.map((tool) => {
            const Icon = tool.icon;
            return (
              <Card 
                key={tool.id}
                className="flex-shrink-0 w-64 cursor-pointer hover:scale-105 transition-transform ripple snap-start elevation-1"
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-base">{tool.name}</CardTitle>
                      <Badge variant="secondary" className="text-xs">{tool.category}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-sm">{tool.description}</CardDescription>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
};
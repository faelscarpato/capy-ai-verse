import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Brain, Code2 } from 'lucide-react';
import { useApp } from '@/hooks/useApp';

const toolsData = [
  { id: "capyresumo", name: "CapyResumo", icon: FileText },
  { id: "capyexplica", name: "CapyExplica", icon: Brain },
  { id: "capyide", name: "CapyIDE", icon: Code2 }
];

export const ExplorerPage: React.FC = () => {
  const { state, dispatch } = useApp();

  const collections = [
    { title: 'Mais Usadas', tools: toolsData },
    { title: 'Recentes', tools: toolsData.slice(1) },
    { title: 'Favoritas', tools: toolsData.filter(t => state.favorites.includes(t.id)) }
  ];

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Explorar Coleções</h2>
      
      {collections.map((collection, index) => (
        <div key={index} className="mb-8">
          <h3 className="text-lg font-semibold mb-4">{collection.title}</h3>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x">
            {collection.tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card 
                  key={tool.id}
                  className="flex-shrink-0 w-48 cursor-pointer hover:scale-105 transition-transform ripple snap-start elevation-1"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-sm truncate">{tool.name}</CardTitle>
                    </div>
                  </CardHeader>
                </Card>
              );
            })}
          </div>
        </div>
      ))}

      <Card className="bg-gradient-accent text-accent-foreground">
        <CardContent className="p-6 text-center">
          <h3 className="text-lg font-semibold mb-2">Descubra sua ferramenta perfeita</h3>
          <p className="text-sm opacity-90 mb-4">
            Explore todas as possibilidades do CapyUniverse
          </p>
          <Button 
            variant="secondary"
            onClick={() => dispatch({ type: 'SET_ACTIVE_TAB', payload: 'tools' })}
            className="focus-ring"
          >
            Ver Todas
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { 
  Home, 
  Settings, 
  Search, 
  User, 
  Plus, 
  Sparkles, 
  MessageSquare, 
  Image, 
  FileText,
  Code2,
  Zap,
  Brain,
  ChevronDown,
  ChevronRight,
  Heart,
  Filter,
  X
} from 'lucide-react';

// Importação das imagens geradas
import capyResumoHero from '@/assets/capyresumo-hero.jpg';
import capyExplicaHero from '@/assets/capyexplica-hero.jpg';
import capyIdeIcon from '@/assets/capyide-icon.jpg';

// Importação dos modais das ferramentas
import { 
  CapyResumoModal, 
  CapyExplicaModal, 
  CapyIDEModal, 
  CapyFlashcardsModal, 
  CapyIMGModal, 
  CapyChatModal 
} from './ToolModals';

// Dados reais das ferramentas do CapyUniverse
const toolsData = [
  {
    id: "capyresumo",
    name: "CapyResumo",
    description: "Resuma qualquer texto em segundos com IA avançada.",
    category: "Produtividade",
    imageUrl: capyResumoHero,
    icon: FileText,
    prompts: ["Resuma o seguinte texto de forma clara e concisa: ${textToSummarize}"]
  },
  {
    id: "capyexplica",
    name: "CapyExplica", 
    description: "Explique conceitos complexos de forma simples e didática.",
    category: "Educação",
    imageUrl: capyExplicaHero,
    icon: Brain,
    prompts: ["Explique o conceito de '${conceptToExplain}' de forma simples, como se fosse para uma criança de 10 anos."]
  },
  {
    id: "capyide",
    name: "CapyIDE",
    description: "Gere código profissional a partir de descrições naturais.",
    category: "Desenvolvimento", 
    imageUrl: capyIdeIcon,
    icon: Code2,
    prompts: ["Gere código em ${language} para: ${description}. Inclua comentários explicativos."]
  },
  {
    id: "capyflashcards",
    name: "CapyFlashcards",
    description: "Crie flashcards inteligentes para qualquer assunto.",
    category: "Educação",
    imageUrl: capyExplicaHero, 
    icon: Sparkles,
    prompts: ["Crie flashcards sobre '${topic}' com pergunta e resposta, formato JSON."]
  },
  {
    id: "capyimg",
    name: "CapyIMG",
    description: "Gere imagens incríveis com IA generativa.",
    category: "Criatividade",
    imageUrl: capyIdeIcon,
    icon: Image,
    prompts: ["Descreva uma imagem de: ${imageDescription}"]
  },
  {
    id: "capychat",
    name: "CapyChat", 
    description: "Converse com uma IA inteligente sobre qualquer assunto.",
    category: "Geral",
    imageUrl: capyResumoHero,
    icon: MessageSquare,
    prompts: ["${userMessage}"]
  }
];

const categories = ["Todos", "Produtividade", "Educação", "Desenvolvimento", "Criatividade", "Geral"];

// Componente principal da PWA CapyUniverse
export default function CapyUniverse() {
  // Estados principais da aplicação
  const [activeTab, setActiveTab] = useState<'home' | 'tools' | 'explorer' | 'profile'>('home');
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [isFabSheetOpen, setIsFabSheetOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState<string | null>(null);

  // Estados para os modais das ferramentas
  const [activeToolModal, setActiveToolModal] = useState<string | null>(null);

  // Estados para interações touch
  const [isPulling, setIsPulling] = useState(false);
  const [pullDistance, setPullDistance] = useState(0);
  const touchStartY = useRef(0);
  const isFilterDrawerOpen = useRef(false);

  // Carrega dados do localStorage na inicialização
  useEffect(() => {
    const savedApiKey = localStorage.getItem('capyuniverse-api-key');
    const savedFavorites = localStorage.getItem('capyuniverse-favorites');
    
    if (savedApiKey) setApiKey(savedApiKey);
    if (savedFavorites) setFavorites(JSON.parse(savedFavorites));

    // Registra o service worker
    registerServiceWorker();
  }, []);

  // Registra o service worker para funcionalidade offline
  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        await navigator.serviceWorker.register('/sw.js');
        console.log('Service Worker registrado com sucesso');
      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
      }
    }
  };

  // Salva a chave da API no localStorage
  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('capyuniverse-api-key', apiKey.trim());
      setIsApiKeyModalOpen(false);
      toast({
        title: "Chave API salva!",
        description: "Sua chave foi armazenada com segurança no dispositivo.",
      });
    }
  };

  // Chama a API do Google Gemini
  const callGeminiAPI = async (prompt: string): Promise<string> => {
    const savedApiKey = localStorage.getItem('capyuniverse-api-key');
    
    if (!savedApiKey) {
      toast({
        title: "Chave API necessária",
        description: "Configure sua chave do Google Gemini primeiro.",
        variant: "destructive"
      });
      setIsApiKeyModalOpen(true);
      return 'Chave API não encontrada. Configure nas configurações.';
    }

    try {
      setIsLoading(true);
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${savedApiKey}`,
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
      console.error('Erro na API Gemini:', error);
      toast({
        title: "Erro na API",
        description: `Falha ao processar: ${error.message}`,
        variant: "destructive"
      });
      return `Erro na chamada API: ${error.message}`;
    } finally {
      setIsLoading(false);
    }
  };

  // Executa ferramenta com prompt personalizado
  const handleToolAction = async (toolId: string, customInput?: string) => {
    const tool = toolsData.find(t => t.id === toolId);
    if (!tool) return;

    // Abre o modal específico da ferramenta
    setActiveToolModal(toolId);
    setIsFabSheetOpen(false); // Fecha FAB sheet se estiver aberto
  };

  // Alterna favorito
  const toggleFavorite = (toolId: string) => {
    const newFavorites = favorites.includes(toolId)
      ? favorites.filter(id => id !== toolId)
      : [...favorites, toolId];
    
    setFavorites(newFavorites);
    localStorage.setItem('capyuniverse-favorites', JSON.stringify(newFavorites));
    
    toast({
      title: favorites.includes(toolId) ? "Removido dos favoritos" : "Adicionado aos favoritos",
      description: `${toolsData.find(t => t.id === toolId)?.name}`,
    });
  };

  // Filtra ferramentas baseado na busca e categoria
  const filteredTools = toolsData.filter(tool => {
    const matchesSearch = tool.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tool.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'Todos' || tool.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Handles para interações touch
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY.current;
    
    if (diff > 0 && window.scrollY === 0 && activeTab === 'tools') {
      setIsPulling(true);
      setPullDistance(Math.min(diff, 100));
    }
  };

  const handleTouchEnd = () => {
    if (isPulling && pullDistance > 50) {
      // Simula pull-to-refresh
      setIsLoading(true);
      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: "Atualizado!",
          description: "Ferramentas atualizadas com sucesso."
        });
      }, 2000);
    }
    setIsPulling(false);
    setPullDistance(0);
  };

  // Limpa dados locais
  const handleClearLocalData = () => {
    localStorage.removeItem('capyuniverse-api-key');
    localStorage.removeItem('capyuniverse-favorites');
    localStorage.removeItem('capyuniverse-history');
    setApiKey('');
    setFavorites([]);
    toast({
      title: "Dados limpos",
      description: "Todos os dados locais foram removidos."
    });
  };

  // Componente do Header
  const Header = () => (
    <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-primary backdrop-blur-lg border-b border-border/50">
      <div className="flex items-center justify-between px-4 py-3">
        <h1 className="text-xl font-bold text-primary-foreground">CapyUniverse</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsApiKeyModalOpen(true)}
          className="text-primary-foreground hover:bg-white/20 focus-ring"
          aria-label="Configurar chave API"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </div>
    </header>
  );

  // Componente da Navigation Bar inferior
  const BottomNav = () => (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border elevation-2">
      <div className="grid grid-cols-4 h-16">
        {[
          { id: 'home', icon: Home, label: 'Home' },
          { id: 'tools', icon: Zap, label: 'Ferramentas' }, 
          { id: 'explorer', icon: Search, label: 'Explorar' },
          { id: 'profile', icon: User, label: 'Perfil' }
        ].map((tab) => (
          <Button
            key={tab.id}
            variant="ghost"
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex flex-col items-center justify-center h-full gap-1 rounded-none focus-ring ${
              activeTab === tab.id 
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

  // Floating Action Button
  const FloatingActionButton = () => (
    <Button
      onClick={() => setIsFabSheetOpen(true)}
      className="fixed bottom-20 right-4 z-40 h-14 w-14 rounded-full bg-gradient-accent hover:scale-105 transition-all elevation-fab focus-ring"
      aria-label="Nova ação"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );

  return (
    <div className="min-h-screen bg-background" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
      <Header />
      
      {/* Conteúdo principal com padding para header/nav */}
      <main className="pt-16 pb-20 px-4">
        {/* Página Home */}
        {activeTab === 'home' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <section className="text-center py-12 bg-gradient-primary rounded-xl text-primary-foreground">
              <h2 className="text-3xl font-bold mb-4">Bem-vindo ao CapyUniverse</h2>
              <p className="text-lg opacity-90 mb-6 px-4">
                Sua plataforma de IA generativa para produtividade e aprendizado
              </p>
              <Button 
                onClick={() => setActiveTab('tools')}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                Explorar Ferramentas
              </Button>
            </section>

            {/* Carrossel de Destaques */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Destaques</h3>
              <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x">
                {toolsData.slice(0, 3).map((tool) => {
                  const Icon = tool.icon;
                  return (
                    <Card 
                      key={tool.id}
                      className="flex-shrink-0 w-64 cursor-pointer hover:scale-105 transition-transform ripple snap-start elevation-1"
                      onClick={() => handleToolAction(tool.id)}
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

            {/* Acordeão de Informações */}
            <section>
              <h3 className="text-xl font-semibold mb-4">Sobre o CapyUniverse</h3>
              <div className="space-y-2">
                {[
                  {
                    id: 'processing',
                    title: 'Processamento Local',
                    content: 'Seus dados ficam no seu dispositivo. Processamento seguro e privado.'
                  },
                  {
                    id: 'ai',
                    title: 'IA Real via Gemini', 
                    content: 'Integração direta com Google Gemini para resultados de qualidade.'
                  },
                  {
                    id: 'privacy',
                    title: 'Privacidade',
                    content: 'Chaves API armazenadas localmente. Nenhum dado enviado para nossos servidores.'
                  },
                  {
                    id: 'free',
                    title: 'Uso Livre',
                    content: 'Use quantas vezes quiser. Apenas sua cota da API Google se aplica.'
                  }
                ].map((item) => (
                  <Card key={item.id} className="overflow-hidden">
                    <Button
                      variant="ghost"
                      onClick={() => setExpandedAccordion(expandedAccordion === item.id ? null : item.id)}
                      className="w-full justify-between p-4 h-auto"
                      aria-expanded={expandedAccordion === item.id}
                    >
                      <span className="font-medium">{item.title}</span>
                      {expandedAccordion === item.id ? 
                        <ChevronDown className="h-4 w-4" /> : 
                        <ChevronRight className="h-4 w-4" />
                      }
                    </Button>
                    {expandedAccordion === item.id && (
                      <div className="px-4 pb-4">
                        <p className="text-muted-foreground">{item.content}</p>
                      </div>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          </div>
        )}

        {/* Página Ferramentas */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {/* Pull to refresh indicator */}
            {isPulling && (
              <div className="text-center py-2">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              </div>
            )}

            {/* Busca */}
            <div className="relative">
              <Input
                placeholder="Buscar ferramentas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-4 pr-10 focus-ring"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-6 w-6"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Filtros por categoria */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="flex-shrink-0 snap-start focus-ring"
                >
                  {selectedCategory === category && <Filter className="h-3 w-3 mr-1" />}
                  {category}
                </Button>
              ))}
            </div>

            {/* Grade de ferramentas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoading ? (
                // Skeleton loading
                Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-lg"></div>
                        <div className="space-y-2 flex-1">
                          <div className="h-4 bg-muted rounded w-3/4"></div>
                          <div className="h-3 bg-muted rounded w-1/2"></div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-3 bg-muted rounded mb-2"></div>
                      <div className="h-3 bg-muted rounded w-2/3"></div>
                    </CardContent>
                  </Card>
                ))
              ) : (
                filteredTools.map((tool) => {
                  const Icon = tool.icon;
                  const isFavorited = favorites.includes(tool.id);
                  
                  return (
                    <Card 
                      key={tool.id}
                      className="group cursor-pointer hover:scale-105 transition-all ripple elevation-1 relative"
                      onClick={() => handleToolAction(tool.id)}
                      onTouchStart={(e) => {
                        // Tap & hold para favoritar
                        const timer = setTimeout(() => {
                          toggleFavorite(tool.id);
                        }, 500);
                        
                        const cleanup = () => {
                          clearTimeout(timer);
                          document.removeEventListener('touchend', cleanup);
                          document.removeEventListener('touchmove', cleanup);
                        };
                        
                        document.addEventListener('touchend', cleanup);
                        document.addEventListener('touchmove', cleanup);
                      }}
                    >
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(tool.id);
                        }}
                        className="absolute top-2 right-2 p-1 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus-ring z-10"
                        aria-label={isFavorited ? "Remover dos favoritos" : "Adicionar aos favoritos"}
                      >
                        <Heart className={`h-4 w-4 ${isFavorited ? 'fill-current text-red-500' : ''}`} />
                      </Button>

                      <CardHeader className="pb-2">
                        <div className="flex items-center gap-3">
                          <div className="p-3 bg-primary/10 rounded-xl">
                            <Icon className="h-6 w-6 text-primary" />
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-base">{tool.name}</CardTitle>
                            <Badge variant="secondary" className="text-xs mt-1">
                              {tool.category}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-sm mb-3">
                          {tool.description}
                        </CardDescription>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="w-full focus-ring"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleToolAction(tool.id);
                          }}
                        >
                          Usar Ferramenta
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })
              )}
            </div>

            {filteredTools.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhuma ferramenta encontrada</p>
              </div>
            )}
          </div>
        )}

        {/* Página Explorer */}
        {activeTab === 'explorer' && (
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-6">Explorar Coleções</h2>
              
              {/* Coleções horizontais */}
              {[
                { title: 'Mais Usadas', tools: toolsData.slice(0, 4) },
                { title: 'Recentes', tools: toolsData.slice(2, 6) },
                { title: 'Favoritas', tools: toolsData.filter(t => favorites.includes(t.id)).slice(0, 4) }
              ].map((collection, index) => (
                <div key={index} className="mb-8">
                  <h3 className="text-lg font-semibold mb-4">{collection.title}</h3>
                  <div className="flex gap-4 overflow-x-auto scrollbar-hide snap-x">
                    {collection.tools.map((tool) => {
                      const Icon = tool.icon;
                      return (
                        <Card 
                          key={tool.id}
                          className="flex-shrink-0 w-48 cursor-pointer hover:scale-105 transition-transform ripple snap-start elevation-1"
                          onClick={() => handleToolAction(tool.id)}
                        >
                          <CardHeader className="pb-2">
                            <div className="flex items-center gap-2">
                              <Icon className="h-5 w-5 text-primary" />
                              <CardTitle className="text-sm truncate">{tool.name}</CardTitle>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <CardDescription className="text-xs line-clamp-2">
                              {tool.description}
                            </CardDescription>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </section>

            {/* Banner de descoberta */}
            <Card className="bg-gradient-accent text-accent-foreground">
              <CardContent className="p-6 text-center">
                <h3 className="text-lg font-semibold mb-2">Descubra sua ferramenta perfeita</h3>
                <p className="text-sm opacity-90 mb-4">
                  Explore todas as possibilidades do CapyUniverse
                </p>
                <Button 
                  variant="secondary"
                  onClick={() => setActiveTab('tools')}
                  className="focus-ring"
                >
                  Ver Todas
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Página Profile */}
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Perfil</h2>
            
            {/* Configuração da API Key */}
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
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    className="focus-ring"
                  />
                </div>
                <Button 
                  onClick={handleSaveApiKey}
                  disabled={!apiKey.trim()}
                  className="w-full focus-ring"
                >
                  Salvar Chave API
                </Button>
                <p className="text-xs text-muted-foreground">
                  Sua chave é salva localmente no navegador e usada apenas para chamadas diretas à API Gemini.
                </p>
              </CardContent>
            </Card>

            {/* Favoritos */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5" />
                  Ferramentas Favoritas ({favorites.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                {favorites.length > 0 ? (
                  <div className="space-y-2">
                    {favorites.map((toolId) => {
                      const tool = toolsData.find(t => t.id === toolId);
                      if (!tool) return null;
                      const Icon = tool.icon;
                      
                      return (
                        <div 
                          key={toolId}
                          className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 cursor-pointer hover:bg-muted transition-colors ripple"
                          onClick={() => handleToolAction(toolId)}
                        >
                          <Icon className="h-5 w-5 text-primary" />
                          <div className="flex-1">
                            <p className="font-medium text-sm">{tool.name}</p>
                            <p className="text-xs text-muted-foreground">{tool.category}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-center py-8">
                    Nenhuma ferramenta favoritada ainda
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
              <CardHeader>
                <CardTitle>Histórico Recente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {JSON.parse(localStorage.getItem('capyuniverse-history') || '[]').slice(0, 5).map((item: any) => (
                    <div key={item.id} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-sm">{item.tool}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(item.timestamp).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {item.result.slice(0, 100)}...
                      </p>
                    </div>
                  ))}
                  {JSON.parse(localStorage.getItem('capyuniverse-history') || '[]').length === 0 && (
                    <p className="text-muted-foreground text-center py-8">
                      Nenhum histórico encontrado
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Limpar dados */}
            <Card>
              <CardHeader>
                <CardTitle className="text-destructive">Zona de Perigo</CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="destructive"
                  onClick={handleClearLocalData}
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
        )}
      </main>

      {/* Modal de API Key */}
      <Dialog open={isApiKeyModalOpen} onOpenChange={setIsApiKeyModalOpen}>
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
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
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
              onClick={() => setIsApiKeyModalOpen(false)}
              className="flex-1 focus-ring"
            >
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveApiKey}
              disabled={!apiKey.trim()}
              className="flex-1 focus-ring"
            >
              Salvar
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bottom Sheet do FAB */}
      {isFabSheetOpen && (
        <div className="fixed inset-0 z-50 bg-background/50 backdrop-blur-sm" onClick={() => setIsFabSheetOpen(false)}>
          <div className="fixed bottom-0 left-0 right-0 bg-surface rounded-t-xl p-6 space-y-4 elevation-2">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-lg">Ação Rápida</h3>
              <Button variant="ghost" size="sm" onClick={() => setIsFabSheetOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Resumir', icon: FileText, action: () => setActiveToolModal('capyresumo') },
                { label: 'Explicar', icon: Brain, action: () => setActiveToolModal('capyexplica') },
                { label: 'Flashcards', icon: Sparkles, action: () => setActiveToolModal('capyflashcards') },
                { label: 'Gerar Código', icon: Code2, action: () => setActiveToolModal('capyide') }
              ].map((item) => (
                <Button
                  key={item.label}
                  variant="outline"
                  onClick={() => {
                    item.action();
                    setIsFabSheetOpen(false);
                  }}
                  className="h-16 flex flex-col gap-2 focus-ring"
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
      )}

      <FloatingActionButton />
      <BottomNav />

      {/* Modais das Ferramentas */}
      <CapyResumoModal 
        isOpen={activeToolModal === 'capyresumo'}
        onClose={() => setActiveToolModal(null)}
        toolId="capyresumo"
        onApiCall={callGeminiAPI}
      />

      <CapyExplicaModal 
        isOpen={activeToolModal === 'capyexplica'}
        onClose={() => setActiveToolModal(null)}
        toolId="capyexplica"
        onApiCall={callGeminiAPI}
      />

      <CapyIDEModal 
        isOpen={activeToolModal === 'capyide'}
        onClose={() => setActiveToolModal(null)}
        toolId="capyide"
        onApiCall={callGeminiAPI}
      />

      <CapyFlashcardsModal 
        isOpen={activeToolModal === 'capyflashcards'}
        onClose={() => setActiveToolModal(null)}
        toolId="capyflashcards"
        onApiCall={callGeminiAPI}
      />

      <CapyIMGModal 
        isOpen={activeToolModal === 'capyimg'}
        onClose={() => setActiveToolModal(null)}
        toolId="capyimg"
        onApiCall={callGeminiAPI}
      />

      <CapyChatModal 
        isOpen={activeToolModal === 'capychat'}
        onClose={() => setActiveToolModal(null)}
        toolId="capychat"
        onApiCall={callGeminiAPI}
      />
    </div>
  );
}
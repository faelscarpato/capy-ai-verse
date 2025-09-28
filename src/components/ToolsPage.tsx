import React, { useState, useMemo } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SwipeableCard } from './SwipeableCard';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Filter, X, Heart, FileText, Brain, Code2, Sparkles, Image, MessageSquare, BarChart, Scale, Clock, User, Search, BookOpen, Mail, PenTool, Grid, Calculator, DollarSign, Target, Calendar, Zap, HelpCircle, ChefHat, Video, TrendingUp, Sun, GraduationCap, CheckSquare, Globe, Users, Megaphone, LucideIcon } from 'lucide-react';
import { useApp } from '@/hooks/useApp';
import { useGemini } from '@/hooks/useGemini';
import { ToolModal } from './ToolModals';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

interface ToolCardProps {
  tool: Tool;
  isFavorited: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenModal: (id: string) => void;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, isFavorited, onToggleFavorite, onOpenModal }) => {
  const Icon = tool.icon;
  
  return (
    <SwipeableCard
      onSwipeRight={() => onToggleFavorite(tool.id)}
      leftAction={{ 
        icon: <Heart className="h-5 w-5" />, 
        color: isFavorited ? 'bg-red-500' : 'bg-gray-500', 
        label: isFavorited ? 'Remover' : 'Favoritar' 
      }}
      className="group cursor-pointer hover:scale-105 transition-all ripple elevation-1"
    >
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
          onClick={() => onOpenModal(tool.id)}
        >
          Usar Ferramenta
        </Button>
      </CardContent>
    </SwipeableCard>
  );
};

const toolsData: Tool[] = [
  { id: "capyaudiencias", name: "CapyAudiencias", description: "Analise e resuma atas de audiência com precisão jurídica de IA", category: "Jurídico", icon: FileText },
  { id: "capybula", name: "CapyBula", description: "Consulte informações detalhadas sobre medicamentos de forma rápida e segura", category: "Saúde e Bem-Estar", icon: Heart },
  { id: "capybyte", name: "CapyByte", description: "Diagnósticos precisos e soluções para os teus problemas tecnológicos", category: "Diagnóstico e Suporte", icon: Code2 },
  { id: "capychart", name: "CapyChart", description: "Transforme dados brutos em Dashboards Inteligentes com IA", category: "Análise de Dados", icon: BarChart },
  { id: "capychat", name: "CapyChat", description: "Converse com uma IA sobre qualquer tópico que desejar", category: "Chatbots Especializados", icon: MessageSquare },
  { id: "capyconciliador", name: "CapyConciliador", description: "Receba sugestões de acordo geradas por IA para resolver disputas", category: "Jurídico", icon: Scale },
  { id: "capycontrato", name: "CapyContrato", description: "Crie modelos de contrato personalizados com a assistência da IA", category: "Documentos e PDFs", icon: FileText },
  { id: "capycopy", name: "CapyCopy", description: "Gere textos de anúncio que vendem, com a lábia de uma capivara publicitária", category: "Mídia & Marketing", icon: Megaphone },
  { id: "capyclt", name: "CapyCLT", description: "Converse com as leis trabalhistas", category: "Jurídico", icon: Scale },
  { id: "capycronos", name: "CapyCronos", description: "Automatize a identificação e o gerenciamento de prazos jurídicos", category: "Jurídico", icon: Clock },
  { id: "capycurriculo", name: "CapyCurrículo", description: "Melhore o seu currículo com sugestões personalizadas da IA", category: "Carreira e RH", icon: User },
  { id: "capydados", name: "CapyDados", description: "Obtenha insights e análises a partir dos seus conjuntos de dados", category: "Análise de Dados", icon: BarChart },
  { id: "capydebate", name: "CapyDebate", description: "Treine as suas capacidades de argumentação com um debatedor IA", category: "Aprendizagem e Educação", icon: MessageSquare },
  { id: "capydetector", name: "CapyDetector", description: "Verifique se um texto foi provavelmente gerado por IA", category: "Análise e Compreensão", icon: Search },
  { id: "capydidatica", name: "CapyDidática", description: "Crie planos de aula estruturados e criativos com a ajuda da IA", category: "Aprendizagem e Educação", icon: BookOpen },
  { id: "capydoc", name: "CapyDoc", description: "Extraia informações e interaja com o conteúdo de documentos", category: "Documentos e PDFs", icon: FileText },
  { id: "capyemail", name: "CapyEmail", description: "Crie e-mails profissionais e eficazes para diversas finalidades", category: "Criação de Conteúdo", icon: Mail },
  { id: "capyescritor", name: "CapyEscritor", description: "Obtenha ajuda para escrever artigos, posts, e mais", category: "Criação de Conteúdo", icon: PenTool },
  { id: "capyexcel", name: "CapyExcel", description: "Aprenda fórmulas e truques de Excel com um tutor IA", category: "Aprendizagem e Educação", icon: Grid },
  { id: "capyexplica", name: "CapyExplica", description: "Descomplique qualquer tema com explicações claras e adaptadas", category: "Análise e Compreensão", icon: Brain },
  { id: "capyfiscal", name: "CapyFiscal", description: "Tire dúvidas e obtenha informações sobre questões fiscais e tributárias", category: "Finanças e Negócios", icon: Calculator },
  { id: "capyfix", name: "CapyFix", description: "Descreva seu problema, cole seu código e deixe a IA encontrar a solução", category: "Desenvolvimento e TI", icon: Code2 },
  { id: "capyflashcards", name: "CapyFlashcards", description: "Crie flashcards para os teus estudos com a ajuda da Capy-IA!", category: "Aprendizagem e Educação", icon: Sparkles },
  { id: "capygrana", name: "CapyGrana", description: "O seu consultor financeiro pessoal com a sabedoria de uma capivara próspera!", category: "Finanças e Negócios", icon: DollarSign },
  { id: "capyhistoriador", name: "CapyHistoriador", description: "Desvende os segredos do passado com o nosso historiador IA", category: "Chatbots Especializados", icon: BookOpen },
  { id: "capyide", name: "CapyIDE", description: "Ambiente de desenvolvimento integrado com assistência de IA", category: "Desenvolvimento e TI", icon: Code2 },
  { id: "capymeditacao", name: "CapyMeditação", description: "Encontre a sua paz interior com meditações guiadas pela Capy-IA", category: "Bem-Estar e Mindfulness", icon: Heart },
  { id: "capymetas", name: "CapyMetas", description: "Defina e alcance os seus objetivos com a ajuda da Capy-IA", category: "Produtividade e Organização", icon: Target },
  { id: "capyminuta", name: "CapyMinuta", description: "Crie atas de reunião profissionais e bem estruturadas com IA", category: "Documentos e PDFs", icon: FileText },
  { id: "capyocr", name: "CapyOCR", description: "Extraia texto de qualquer imagem com a visão aguçada de uma capivara", category: "Análise e Compreensão", icon: Image },
  { id: "capypdf", name: "CapyPDF", description: "Converse com o conteúdo dos seus PDFs colando o texto", category: "Documentos e PDFs", icon: FileText },
  { id: "capyplanner", name: "CapyPlanner", description: "O teu estratega pessoal para conquistar qualquer objetivo", category: "Produtividade e Organização", icon: Calendar },
  { id: "capyprompt", name: "CapyPrompt", description: "O teu mestre de engenharia de prompts, com a astúcia de uma capivara!", category: "Ferramentas IA Avançadas", icon: Zap },
  { id: "capypsico", name: "CapyPsico", description: "Um espaço seguro para conversar e refletir com apoio emocional IA", category: "Chatbots Especializados", icon: Heart },
  { id: "capyquiz", name: "CapyQuiz", description: "Crie quizzes desafiantes e divertidos com a ajuda da IA", category: "Aprendizagem e Educação", icon: HelpCircle },
  { id: "capyreceita", name: "CapyReceita", description: "Receitas personalizadas com a ajuda da nossa capivara chef!", category: "Saúde e Bem-Estar", icon: ChefHat },
  { id: "capyresumo", name: "CapyResumo", description: "Transforme textos longos em resumos concisos e informativos", category: "Análise e Compreensão", icon: FileText },
  { id: "capyroteiro", name: "CapyRoteiro", description: "Crie estruturas e ideias para os teus roteiros de vídeo ou cinema", category: "Criação de Conteúdo", icon: Video },
  { id: "capyseo", name: "CapySEO", description: "Otimize o seu conteúdo para os motores de busca com a astúcia de uma capivara!", category: "Mídia & Marketing", icon: TrendingUp },
  { id: "capysolar", name: "CapySolar", description: "Estime o potencial de geração de energia solar para qualquer localização", category: "Engenharia & Arquitetura", icon: Sun },
  { id: "capysolucao", name: "CapySolução", description: "O teu professor de matemática particular, com a paciência de uma capivara", category: "Aprendizagem e Educação", icon: Calculator },
  { id: "capytcc", name: "CapyTCC", description: "O teu orientador de TCC com inteligência de capivara!", category: "Aprendizagem e Educação", icon: GraduationCap },
  { id: "capyteste", name: "CapyTeste", description: "Crie avaliações personalizadas com o poder da IA", category: "Aprendizagem e Educação", icon: CheckSquare },
  { id: "capytone", name: "CapyTone", description: "Ajuste o tom da sua comunicação para diferentes públicos e contextos", category: "Criação de Conteúdo", icon: Sparkles },
  { id: "capytradutor", name: "CapyTradutor", description: "Traduções inteligentes para um mundo sem fronteiras", category: "Aprendizagem e Educação", icon: Globe },
  { id: "capyvalor", name: "CapyValor", description: "O seu consultor de precificação inteligente para produtos e serviços", category: "Finanças e Negócios", icon: DollarSign },
  { id: "capyvagamatch", name: "CapyVagaMatch", description: "Analise a compatibilidade entre um CV e uma descrição de vaga", category: "Carreira e RH", icon: Users }
];

const categories = ["Todos", "Jurídico", "Saúde e Bem-Estar", "Análise de Dados", "Chatbots Especializados", "Documentos e PDFs", "Mídia & Marketing", "Carreira e RH", "Aprendizagem e Educação", "Análise e Compreensão", "Finanças e Negócios", "Desenvolvimento e TI", "Bem-Estar e Mindfulness", "Produtividade e Organização", "Ferramentas IA Avançadas", "Criação de Conteúdo", "Engenharia & Arquitetura"];

export const ToolsPage: React.FC = () => {
  const { state, dispatch } = useApp();
  const { callAPI } = useGemini();
  const [activeModal, setActiveModal] = useState<string | null>(null);

  const filteredTools = useMemo(() => {
    return toolsData.filter(tool => {
      const matchesSearch = tool.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
                           tool.description.toLowerCase().includes(state.searchQuery.toLowerCase());
      const matchesCategory = state.selectedCategory === 'Todos' || tool.category === state.selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [state.searchQuery, state.selectedCategory]);

  const toggleFavorite = (toolId: string) => {
    dispatch({ type: 'TOGGLE_FAVORITE', payload: toolId });
  };

  return (
    <div className="space-y-6">
      <div className="relative">
        <Input
          placeholder="Buscar ferramentas..."
          value={state.searchQuery}
          onChange={(e) => dispatch({ type: 'SET_SEARCH_QUERY', payload: e.target.value })}
          className="pl-4 pr-10 focus-ring"
        />
        {state.searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dispatch({ type: 'SET_SEARCH_QUERY', payload: '' })}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 h-6 w-6"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      <div className="flex gap-2 overflow-x-auto scrollbar-hide snap-x pb-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={state.selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => dispatch({ type: 'SET_CATEGORY', payload: category })}
            className="flex-shrink-0 snap-start focus-ring"
          >
            {state.selectedCategory === category && <Filter className="h-3 w-3 mr-1" />}
            {category}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTools.map((tool) => (
          <ToolCard
            key={tool.id}
            tool={tool}
            isFavorited={state.favorites.includes(tool.id)}
            onToggleFavorite={toggleFavorite}
            onOpenModal={setActiveModal}
          />
        ))}
      </div>

      {filteredTools.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">Nenhuma ferramenta encontrada</p>
        </div>
      )}

      {activeModal && (
        <ToolModal
          isOpen={true}
          onClose={() => setActiveModal(null)}
          tool={toolsData.find(t => t.id === activeModal)!}
          onApiCall={callAPI}
        />
      )}
    </div>
  );
};
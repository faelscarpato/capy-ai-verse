import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { 
  FileText, 
  Brain, 
  Code2, 
  Sparkles, 
  Image as ImageIcon, 
  MessageSquare,
  Send,
  Copy,
  Download,
  RefreshCw,
  Loader2,
  ChevronLeft,
  ChevronRight,
  User,
  Bot
} from 'lucide-react';

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  toolId: string;
  onApiCall: (prompt: string) => Promise<string>;
}

// Modal do CapyResumo - Resumir textos
export const CapyResumoModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onApiCall }) => {
  const [inputText, setInputText] = useState('');
  const [summaryType, setSummaryType] = useState('conciso');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSummarize = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Texto necessário",
        description: "Digite ou cole o texto que deseja resumir.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const summaryInstructions = {
      conciso: 'de forma concisa em 3-4 frases',
      detalhado: 'de forma detalhada mantendo os pontos principais',
      topicos: 'em tópicos organizados',
      executivo: 'como um resumo executivo profissional'
    };

    const prompt = `Resuma o seguinte texto ${summaryInstructions[summaryType as keyof typeof summaryInstructions]}:\n\n${inputText}`;
    const response = await onApiCall(prompt);
    setResult(response);
    setIsLoading(false);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    toast({ title: "Copiado!", description: "Resumo copiado para a área de transferência." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            CapyResumo - Resumir Texto
          </DialogTitle>
          <DialogDescription>
            Cole ou digite o texto que deseja resumir. A IA criará um resumo inteligente baseado no tipo selecionado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Resumo</label>
              <Select value={summaryType} onValueChange={setSummaryType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="conciso">Conciso (3-4 frases)</SelectItem>
                  <SelectItem value="detalhado">Detalhado</SelectItem>
                  <SelectItem value="topicos">Em Tópicos</SelectItem>
                  <SelectItem value="executivo">Resumo Executivo</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Texto para Resumir ({inputText.length} caracteres)
              </label>
              <Textarea
                placeholder="Cole ou digite o texto aqui..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[300px] resize-none"
              />
            </div>

            <Button 
              onClick={handleSummarize}
              disabled={!inputText.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Resumindo...
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4 mr-2" />
                  Resumir Texto
                </>
              )}
            </Button>
          </div>

          {/* Result Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Resumo Gerado</label>
              {result && (
                <Button variant="outline" size="sm" onClick={copyToClipboard}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
              )}
            </div>
            
            <Card className="min-h-[350px]">
              <CardContent className="p-4">
                {result ? (
                  <ScrollArea className="h-[320px]">
                    <div className="prose prose-sm max-w-none">
                      {result.split('\n').map((line, index) => (
                        <p key={index} className="mb-2">{line}</p>
                      ))}
                    </div>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[320px] text-muted-foreground">
                    <div className="text-center">
                      <FileText className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>O resumo aparecerá aqui</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal do CapyExplica - Explicar conceitos
export const CapyExplicaModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onApiCall }) => {
  const [concept, setConcept] = useState('');
  const [level, setLevel] = useState('intermediario');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleExplain = async () => {
    if (!concept.trim()) {
      toast({
        title: "Conceito necessário",
        description: "Digite o conceito que deseja explicar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const levelInstructions = {
      iniciante: 'para um iniciante completo, usando analogias simples',
      intermediario: 'para alguém com conhecimento básico',
      avancado: 'de forma técnica e detalhada',
      crianca: 'como se fosse para uma criança de 10 anos, com exemplos divertidos'
    };

    const prompt = `Explique o conceito "${concept}" ${levelInstructions[level as keyof typeof levelInstructions]}. Use exemplos práticos e uma linguagem clara.`;
    const response = await onApiCall(prompt);
    setResult(response);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            CapyExplica - Explicar Conceitos
          </DialogTitle>
          <DialogDescription>
            Digite um conceito e escolha o nível de explicação. A IA criará uma explicação didática e fácil de entender.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Input Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Conceito para Explicar</label>
              <Input
                placeholder="Ex: machine learning, fotossíntese, blockchain..."
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Nível de Explicação</label>
              <Select value={level} onValueChange={setLevel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="crianca">Para Criança (10 anos)</SelectItem>
                  <SelectItem value="iniciante">Iniciante</SelectItem>
                  <SelectItem value="intermediario">Intermediário</SelectItem>
                  <SelectItem value="avancado">Avançado</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleExplain}
            disabled={!concept.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Explicando...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Explicar Conceito
              </>
            )}
          </Button>

          {/* Result Section */}
          <Card className="min-h-[400px]">
            <CardHeader>
              <CardTitle className="text-base flex items-center justify-between">
                Explicação
                {result && (
                  <Button variant="outline" size="sm" onClick={() => {
                    navigator.clipboard.writeText(result);
                    toast({ title: "Copiado!", description: "Explicação copiada." });
                  }}>
                    <Copy className="h-3 w-3 mr-1" />
                    Copiar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {result ? (
                <ScrollArea className="h-[350px]">
                  <div className="prose prose-sm max-w-none">
                    {result.split('\n').map((line, index) => (
                      <p key={index} className="mb-3">{line}</p>
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <div className="flex items-center justify-center h-[350px] text-muted-foreground">
                  <div className="text-center">
                    <Brain className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>A explicação aparecerá aqui</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal do CapyIDE - Gerar código
export const CapyIDEModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onApiCall }) => {
  const [language, setLanguage] = useState('javascript');
  const [description, setDescription] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const languages = [
    { value: 'javascript', label: 'JavaScript' },
    { value: 'python', label: 'Python' },
    { value: 'react', label: 'React/JSX' },
    { value: 'html', label: 'HTML' },
    { value: 'css', label: 'CSS' },
    { value: 'java', label: 'Java' },
    { value: 'csharp', label: 'C#' },
    { value: 'php', label: 'PHP' },
    { value: 'sql', label: 'SQL' }
  ];

  const handleGenerateCode = async () => {
    if (!description.trim()) {
      toast({
        title: "Descrição necessária",
        description: "Descreva o código que deseja gerar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const prompt = `Gere código em ${language} para: ${description}. 

Requisitos:
- Inclua comentários explicativos
- Use boas práticas da linguagem
- Código limpo e bem estruturado
- Se necessário, inclua exemplo de uso

Código:`;

    const response = await onApiCall(prompt);
    setResult(response);
    setIsLoading(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code2 className="h-5 w-5 text-primary" />
            CapyIDE - Gerador de Código
          </DialogTitle>
          <DialogDescription>
            Descreva o que você quer programar e escolha a linguagem. A IA gerará código limpo e bem comentado.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Linguagem</label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {languages.map(lang => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descrição do Código</label>
              <Textarea
                placeholder="Descreva detalhadamente o que você quer programar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <Button 
              onClick={handleGenerateCode}
              disabled={!description.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando Código...
                </>
              ) : (
                <>
                  <Code2 className="h-4 w-4 mr-2" />
                  Gerar Código
                </>
              )}
            </Button>
          </div>

          {/* Code Result Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Código Gerado</label>
              {result && (
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(result);
                  toast({ title: "Copiado!", description: "Código copiado para área de transferência." });
                }}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
              )}
            </div>
            
            <Card className="min-h-[300px]">
              <CardContent className="p-0">
                {result ? (
                  <ScrollArea className="h-[400px]">
                    <pre className="p-4 text-sm overflow-x-auto bg-muted/50 rounded">
                      <code>{result}</code>
                    </pre>
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <Code2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>O código aparecerá aqui</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal do CapyFlashcards - Criar flashcards
export const CapyFlashcardsModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onApiCall }) => {
  const [topic, setTopic] = useState('');
  const [quantity, setQuantity] = useState('5');
  const [difficulty, setDifficulty] = useState('medio');
  const [flashcards, setFlashcards] = useState<Array<{question: string, answer: string}>>([]);
  const [currentCard, setCurrentCard] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGenerateFlashcards = async () => {
    if (!topic.trim()) {
      toast({
        title: "Tópico necessário",
        description: "Digite o assunto para criar os flashcards.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    const prompt = `Crie ${quantity} flashcards sobre "${topic}" com nível de dificuldade ${difficulty}.

Formato JSON:
[
  {"question": "Pergunta 1", "answer": "Resposta detalhada 1"},
  {"question": "Pergunta 2", "answer": "Resposta detalhada 2"}
]

Crie perguntas ${difficulty === 'facil' ? 'básicas e fundamentais' : difficulty === 'medio' ? 'intermediárias' : 'avançadas e complexas'}.`;

    const response = await onApiCall(prompt);
    
    try {
      // Tenta extrair JSON da resposta
      const jsonMatch = response.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        const cards = JSON.parse(jsonMatch[0]);
        setFlashcards(cards);
        setCurrentCard(0);
        setIsFlipped(false);
      } else {
        throw new Error('Formato inválido');
      }
    } catch {
      // Fallback: parse manual se JSON falhar
      const lines = response.split('\n').filter(line => line.trim());
      const cards = [];
      for (let i = 0; i < lines.length; i += 2) {
        if (lines[i] && lines[i + 1]) {
          cards.push({
            question: lines[i].replace(/^\d+\.?\s*/, '').replace('Q:', '').trim(),
            answer: lines[i + 1].replace('A:', '').replace('R:', '').trim()
          });
        }
      }
      setFlashcards(cards);
      setCurrentCard(0);
      setIsFlipped(false);
    }
    
    setIsLoading(false);
  };

  const nextCard = () => {
    setCurrentCard((prev) => (prev + 1) % flashcards.length);
    setIsFlipped(false);
  };

  const prevCard = () => {
    setCurrentCard((prev) => (prev - 1 + flashcards.length) % flashcards.length);
    setIsFlipped(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            CapyFlashcards - Criador de Flashcards
          </DialogTitle>
          <DialogDescription>
            Crie flashcards inteligentes para estudar qualquer assunto. Perfeito para memorização e revisão.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4 space-y-6">
          {/* Generation Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tópico de Estudo</label>
              <Input
                placeholder="Ex: História do Brasil, Química Orgânica..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Quantidade</label>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="3">3 flashcards</SelectItem>
                  <SelectItem value="5">5 flashcards</SelectItem>
                  <SelectItem value="8">8 flashcards</SelectItem>
                  <SelectItem value="10">10 flashcards</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Dificuldade</label>
              <Select value={difficulty} onValueChange={setDifficulty}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="facil">Fácil</SelectItem>
                  <SelectItem value="medio">Médio</SelectItem>
                  <SelectItem value="dificil">Difícil</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Button 
            onClick={handleGenerateFlashcards}
            disabled={!topic.trim() || isLoading}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando Flashcards...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4 mr-2" />
                Gerar Flashcards
              </>
            )}
          </Button>

          {/* Flashcard Display */}
          {flashcards.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  Flashcard {currentCard + 1} de {flashcards.length}
                </span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={prevCard}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" onClick={nextCard}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <Card 
                className="min-h-[300px] cursor-pointer transition-all duration-300 hover:scale-105"
                onClick={() => setIsFlipped(!isFlipped)}
              >
                <CardContent className="p-8 flex items-center justify-center text-center">
                  <div className="w-full">
                    <Badge variant="secondary" className="mb-4">
                      {isFlipped ? 'Resposta' : 'Pergunta'}
                    </Badge>
                    <p className="text-lg leading-relaxed">
                      {isFlipped 
                        ? flashcards[currentCard]?.answer 
                        : flashcards[currentCard]?.question
                      }
                    </p>
                    <p className="text-sm text-muted-foreground mt-4">
                      Clique para {isFlipped ? 'ver a pergunta' : 'ver a resposta'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal do CapyIMG - Gerar imagens
export const CapyIMGModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onApiCall }) => {
  const [description, setDescription] = useState('');
  const [style, setStyle] = useState('realistico');
  const [result, setResult] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const styles = [
    { value: 'realistico', label: 'Realístico' },
    { value: 'cartoon', label: 'Cartoon/Animação' },
    { value: 'artistico', label: 'Artístico' },
    { value: 'minimalista', label: 'Minimalista' },
    { value: 'cyberpunk', label: 'Cyberpunk' },
    { value: 'aquarela', label: 'Aquarela' }
  ];

  const handleGenerateImage = async () => {
    if (!description.trim()) {
      toast({
        title: "Descrição necessária",
        description: "Descreva a imagem que deseja gerar.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    // Primeiro, gera uma descrição melhorada via Gemini
    const prompt = `Melhore esta descrição para geração de imagem no estilo ${style}: "${description}"
    
Crie uma descrição detalhada, técnica e em inglês, otimizada para IA de geração de imagens.
Inclua detalhes sobre:
- Composição e enquadramento
- Iluminação e cores
- Estilo artístico
- Qualidade (4K, detailed, masterpiece)
    
Responda APENAS com a descrição melhorada em inglês:`;

    try {
      const enhancedDescription = await onApiCall(prompt);
      setResult(enhancedDescription);
      
      // Gera a imagem usando Pollinations
      const pollinations_url = `https://image.pollinations.ai/prompt/${encodeURIComponent(enhancedDescription)}?width=768&height=768&seed=${Math.floor(Math.random() * 1000000)}`;
      setImageUrl(pollinations_url);
      
      toast({
        title: "Imagem gerada!",
        description: "Sua imagem foi criada com sucesso."
      });
      
    } catch (error) {
      console.error('Erro ao gerar imagem:', error);
      toast({
        title: "Erro na geração",
        description: "Não foi possível gerar a imagem. Tente novamente.",
        variant: "destructive"
      });
    }
    
    setIsLoading(false);
  };

  const downloadImage = async () => {
    if (imageUrl) {
      try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = 'capyimg-generated.png';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        toast({ title: "Download iniciado!", description: "A imagem está sendo baixada." });
      } catch (error) {
        toast({ 
          title: "Erro no download", 
          description: "Não foi possível baixar a imagem.",
          variant: "destructive" 
        });
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <ImageIcon className="h-5 w-5 text-primary" />
            CapyIMG - Gerador de Imagens
          </DialogTitle>
          <DialogDescription>
            Descreva a imagem que você quer criar e escolha um estilo. A IA gerará uma imagem única baseada na sua descrição.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          {/* Input Section */}
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Estilo da Imagem</label>
              <Select value={style} onValueChange={setStyle}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {styles.map(styleOption => (
                    <SelectItem key={styleOption.value} value={styleOption.value}>
                      {styleOption.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descrição da Imagem</label>
              <Textarea
                placeholder="Descreva detalhadamente a imagem que você quer gerar..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[150px] resize-none"
              />
            </div>

            <Button 
              onClick={handleGenerateImage}
              disabled={!description.trim() || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Gerando Imagem...
                </>
              ) : (
                <>
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Gerar Imagem
                </>
              )}
            </Button>

            {result && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Prompt Otimizado</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{result}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Image Result Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Imagem Gerada</label>
              {imageUrl && (
                <Button variant="outline" size="sm" onClick={downloadImage}>
                  <Download className="h-3 w-3 mr-1" />
                  Baixar
                </Button>
              )}
            </div>
            
            <Card className="min-h-[400px]">
              <CardContent className="p-4">
                {imageUrl ? (
                  <div className="space-y-4">
                    <img 
                      src={imageUrl} 
                      alt="Imagem gerada" 
                      className="w-full rounded-lg object-cover"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[400px] text-muted-foreground">
                    <div className="text-center">
                      <ImageIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>A imagem aparecerá aqui</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// Modal do CapyChat - Chat com IA
export const CapyChatModal: React.FC<ToolModalProps> = ({ isOpen, onClose, onApiCall }) => {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string, timestamp: Date}>>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage = {
      role: 'user' as const,
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await onApiCall(inputMessage);
      
      const assistantMessage = {
        role: 'assistant' as const,
        content: response,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Erro no chat:', error);
      const errorMessage = {
        role: 'assistant' as const,
        content: 'Desculpe, ocorreu um erro. Tente novamente.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    }

    setIsLoading(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
    toast({ title: "Chat limpo", description: "Histórico de conversa removido." });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                CapyChat - Assistente IA
              </DialogTitle>
              <DialogDescription>
                Converse com a IA sobre qualquer assunto. Faça perguntas, peça ajuda ou tenha conversas interessantes.
              </DialogDescription>
            </div>
            {messages.length > 0 && (
              <Button variant="outline" size="sm" onClick={clearChat}>
                <RefreshCw className="h-3 w-3 mr-1" />
                Limpar
              </Button>
            )}
          </div>
        </DialogHeader>

        <div className="flex flex-col h-[500px]">
          {/* Messages Area */}
          <ScrollArea className="flex-1 p-4 border rounded-lg">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Comece uma conversa!</p>
                  <p className="text-sm">Pergunte qualquer coisa para a IA</p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message, index) => (
                  <div 
                    key={index}
                    className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user' ? 'bg-primary text-primary-foreground' : 'bg-muted'
                    }`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4" />
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                      <div className={`inline-block p-3 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted'
                      }`}>
                        <p className="whitespace-pre-wrap">{message.content}</p>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {message.timestamp.toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {isLoading && (
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                      <Bot className="h-4 w-4" />
                    </div>
                    <div className="bg-muted p-3 rounded-lg">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse"></div>
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-75"></div>
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-pulse delay-150"></div>
                      </div>
                    </div>
                  </div>
                )}
                
                <div ref={messagesEndRef} />
              </div>
            )}
          </ScrollArea>

          {/* Input Area */}
          <div className="flex gap-2 mt-4">
            <Textarea
              placeholder="Digite sua mensagem..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 min-h-[60px] max-h-[120px] resize-none"
              disabled={isLoading}
            />
            <Button 
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              size="lg"
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
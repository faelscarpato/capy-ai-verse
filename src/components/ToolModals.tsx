import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from '@/hooks/use-toast';
import { Copy, Loader2, LucideIcon } from 'lucide-react';

interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: LucideIcon;
}

interface ToolModalProps {
  isOpen: boolean;
  onClose: () => void;
  tool: Tool;
  onApiCall: (prompt: string) => Promise<string>;
}

interface SpecialInputProps {
  selectedOption: string;
  onSelectOption: (value: string) => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
  onImageSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const showCopySuccessToast = () => {
  toast({ title: "Copiado!", description: "Resultado copiado." });
};

export const ToolModal: React.FC<ToolModalProps> = ({ isOpen, onClose, tool, onApiCall }) => {
  const [inputText, setInputText] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getPromptForTool = (toolId: string, input: string, option?: string) => {
    const prompts: Record<string, string> = {
      capyaudiencias: `Analise a seguinte ata de audiência e extraia as informações de forma clara e organizada. Apresente as decisões tomadas, próximos passos e partes envolvidas em texto corrido e bem estruturado. Texto da Ata: "${input}"`,
      capybula: `Forneça informações completas sobre o medicamento "${input}" em texto corrido, incluindo indicações, contraindicações, efeitos colaterais e interações medicamentosas de forma clara e organizada.`,
      capybyte: `Você é o CapyByte, um Oráculo Tecnológico especialista em hardware e software. Um usuário descreveu o seguinte problema: "${input}". Forneça diagnóstico, causa raiz e solução passo a passo em texto claro e bem estruturado.`,
      capychart: `Você é o CapyChart, um especialista em análise e visualização de dados. Crie um dashboard completo e interativo em HTML para: ${input}. Responda apenas com o código HTML completo, sem comentários ou explicações.`,
      capychat: input,
      capyconciliador: `Aja como "CapyConciliador", um mediador experiente. Analise a seguinte descrição de caso e apresente 3 sugestões de acordo de forma clara e estruturada: "${input}"`,
      capycontrato: `Crie um modelo de contrato personalizado para: ${input}. Apresente o contrato em texto corrido, bem estruturado e completo.`,
      capycopy: `Aja como CapyCopywriter. Gere 3-5 variações de copy para um anúncio sobre: ${input}. Apresente cada variação de forma clara e numerada.`,
      capyclt: `Por favor, CapyCLT, faça um resumo dos pontos chave da CLT relacionados ao texto: "${input}". Apresente em texto corrido e bem organizado.`,
      capycronos: `Identifique e organize os prazos jurídicos no seguinte documento: "${input}". Apresente de forma clara e estruturada.`,
      capycurriculo: `Aja como CapyCurriculo, um especialista em recrutamento. Analise o seguinte CV e forneça sugestões de melhoria em texto claro e organizado: "${input}"`,
      capydados: `Você é um analista de documentos especialista. Analise o seguinte conteúdo e apresente insights de forma clara e estruturada: "${input}"`,
      capydebate: `Aja como um debatedor IA experiente. Vamos debater sobre: "${input}". Apresente argumentos de forma clara e estruturada.`,
      capydetector: `Aja como CapyDetector, um especialista em identificar a origem de textos. Analise se o seguinte texto foi gerado por IA e explique sua análise de forma clara: "${input}"`,
      capydidatica: `Aja como CapyDidatica, uma especialista em design instrucional. Crie um plano de aula estruturado e detalhado sobre: "${input}"`,
      capydoc: `Analise o seguinte documento e extraia as informações principais de forma clara e organizada: "${input}"`,
      capyemail: `Aja como CapyEmail, um assistente especialista em redação de e-mails. Crie um e-mail profissional e bem estruturado sobre: "${input}"`,
      capyescritor: `Aja como CapyEscritor, um assistente de escrita criativo. Escreva um texto bem estruturado e envolvente sobre: "${input}"`,
      capyexcel: `Aja como CapyExcel, um tutor especialista em Excel. Forneça ajuda clara e passo a passo para: "${input}"`,
      capyexplica: `Aja como CapyExplica, um especialista em simplificar conceitos complexos. Explique "${input}" de forma ${option || 'clara e didática'}, adaptando a linguagem ao nível solicitado.`,
      capyfiscal: `Aja como CapyFiscal, um assistente especializado em questões fiscais. Responda de forma clara e organizada sobre: "${input}"`,
      capyfix: `Aja como um programador sênior (CapyFix). Analise e proponha solução clara e detalhada para: "${input}"`,
      capyflashcards: `Você é o CapyFlashcards. Crie 5 flashcards sobre: "${input}". Apresente cada flashcard com pergunta e resposta de forma clara.`,
      capygrana: `Aja como CapyGrana, um consultor financeiro. Dê conselhos claros e práticos sobre: "${input}"`,
      capyhistoriador: `Aja como CapyHistoriador, um historiador erudito. Explique de forma clara e detalhada sobre: "${input}"`,
      capyide: `Gere código HTML completo e funcional para: ${input}. Responda apenas com o código HTML, sem comentários ou explicações.`,
      capymeditacao: `Aja como CapyMeditacao, um guia de meditação. Crie uma meditação guiada clara e relaxante sobre: "${input}"`,
      capymetas: `Aja como CapyMetas, um coach de produtividade. Ajude a definir metas claras e alcançáveis para: "${input}"`,
      capyminuta: `Aja como CapyMinuta, um assistente para redação de atas. Crie uma ata profissional e bem estruturada sobre: "${input}"`,
      capyocr: `Extraia todo o texto visível desta imagem de forma precisa e organizada: ${input}`,
      capypdf: `Você é o CapyPDF. Analise o conteúdo extraído de um PDF e apresente as informações de forma clara e organizada: "${input}"`,
      capyplanner: `Aja como CapyPlanner, um especialista em planejamento. Crie um plano detalhado e estruturado para: "${input}"`,
      capyprompt: `Como especialista em engenharia de prompts, ${option || 'refine e otimize'} este prompt: "${input}". Apresente o resultado de forma clara e prática.`,
      capypsico: `Aja como CapyPsico, um assistente de IA para apoio emocional. Responda de forma empática e construtiva ao usuário que disse: "${input}"`,
      capyquiz: `Você é o CapyQuiz. Gere um quiz estruturado e interessante sobre: "${input}"`,
      capyreceita: `Aja como CapyReceita, um chef criativo. Crie uma receita detalhada e clara com: "${input}"`,
      capyresumo: `Por favor, gere um resumo ${option || 'conciso'} do seguinte texto: "${input}"`,
      capyroteiro: `Aja como um assistente de escrita de roteiros. Crie um roteiro bem estruturado sobre: "${input}"`,
      capyseo: `Você é o CapySEO, um especialista em otimização para motores de busca. Analise e forneça sugestões claras para: "${input}"`,
      capysolar: `Aja como CapySolar, um especialista em energia fotovoltaica. Analise e forneça informações detalhadas sobre: "${input}"`,
      capysolucao: `Aja como um professor de matemática paciente (CapySolucao). Explique passo a passo a solução para: "${input}"`,
      capytcc: `Aja como um tutor de TCC experiente (CapyTCC). Forneça orientação clara e estruturada para: "${input}"`,
      capyteste: `Você é o CapyTeste. Crie uma avaliação bem estruturada sobre: "${input}"`,
      capytone: `Reescreva o seguinte texto para que ele tenha um tom ${option || 'profissional'}: "${input}"`,
      capytradutor: `Traduza o seguinte texto para ${option || 'inglês (se estiver em português) ou português (se estiver em inglês)'}: "${input}"`,
      capyvalor: `Você é CapyValor, um especialista em precificação. Sugira preços de forma clara e justificada para: "${input}"`,
      capyvagamatch: `Como um especialista em RH, analise a compatibilidade entre este currículo e vaga de forma clara e estruturada: "${input}"`
    };
    
    return prompts[toolId] || `Ajude com: ${input}`;
  };

  const handleSubmit = async () => {
    if (!inputText.trim() && !selectedImage) {
      toast({
        title: "Entrada necessária",
        description: "Digite algo ou selecione uma imagem.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      let prompt;
      if (tool.id === 'capyocr' && selectedImageBase64) {
        prompt = getPromptForTool(tool.id, selectedImageBase64, selectedOption);
      } else {
        prompt = getPromptForTool(tool.id, inputText, selectedOption);
      }
      const response = await onApiCall(prompt);
      setResult(response);
    } catch (error: any) {
      console.error("Erro na chamada da API:", error);
      toast({
        title: "Erro!",
        description: `Ocorreu um erro ao processar sua solicitação: ${error.message || 'Erro desconhecido'}`,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageBase64 = e.target?.result as string;
        setInputText(`[Imagem selecionada: ${file.name}]`);
        setSelectedImageBase64(imageBase64);
      };
      reader.readAsDataURL(file);
    }
  };

  const specialInputs: Record<string, React.FC<SpecialInputProps>> = {
    capyresumo: ({ selectedOption, onSelectOption }) => (
      <Select value={selectedOption} onValueChange={onSelectOption}>
        <SelectTrigger>
          <SelectValue placeholder="Tipo de resumo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="conciso">Conciso</SelectItem>
          <SelectItem value="detalhado">Detalhado</SelectItem>
          <SelectItem value="executivo">Executivo</SelectItem>
        </SelectContent>
      </Select>
    ),
    capytone: ({ selectedOption, onSelectOption }) => (
      <Select value={selectedOption} onValueChange={onSelectOption}>
        <SelectTrigger>
          <SelectValue placeholder="Tom desejado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="profissional">Profissional</SelectItem>
          <SelectItem value="casual">Casual</SelectItem>
          <SelectItem value="formal">Formal</SelectItem>
          <SelectItem value="amigável">Amigável</SelectItem>
        </SelectContent>
      </Select>
    ),
    capytradutor: ({ selectedOption, onSelectOption }) => (
      <Select value={selectedOption} onValueChange={onSelectOption}>
        <SelectTrigger>
          <SelectValue placeholder="Idioma de destino" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Detectar automaticamente</SelectItem>
          <SelectItem value="inglês">Inglês</SelectItem>
          <SelectItem value="espanhol">Espanhol</SelectItem>
          <SelectItem value="francês">Francês</SelectItem>
        </SelectContent>
      </Select>
    ),
    capyexplica: ({ selectedOption, onSelectOption }) => (
      <Select value={selectedOption} onValueChange={onSelectOption}>
        <SelectTrigger>
          <SelectValue placeholder="Tipo de explicação" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="criança">Para Criança</SelectItem>
          <SelectItem value="leigo">Para Leigos</SelectItem>
          <SelectItem value="facil">Fácil</SelectItem>
          <SelectItem value="tecnico">Técnico</SelectItem>
          <SelectItem value="academico">Acadêmico</SelectItem>
          <SelectItem value="resumido">Resumido</SelectItem>
          <SelectItem value="pontos importantes">Pontos Importantes</SelectItem>
          <SelectItem value="red flags">Red Flags</SelectItem>
        </SelectContent>
      </Select>
    ),
    capyprompt: ({ selectedOption, onSelectOption }) => (
      <Select value={selectedOption} onValueChange={onSelectOption}>
        <SelectTrigger>
          <SelectValue placeholder="Tipo de melhoria" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="refine e otimize">Refinar e Otimizar</SelectItem>
          <SelectItem value="gere variações criativas do">Variações Criativas</SelectItem>
          <SelectItem value="explique detalhadamente">Explicação Detalhada</SelectItem>
          <SelectItem value="ajuste o tom para ser mais profissional no">Tom Profissional</SelectItem>
          <SelectItem value="ajuste o tom para ser mais criativo no">Tom Criativo</SelectItem>
          <SelectItem value="ajuste o tom para ser mais técnico no">Tom Técnico</SelectItem>
        </SelectContent>
      </Select>
    ),
    capyocr: ({ fileInputRef, onImageSelect }) => (
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-primary transition-colors"
        onClick={() => fileInputRef.current?.click()}
      >
        <p className="text-gray-600">Clique para selecionar uma imagem</p>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onImageSelect}
          className="hidden"
        />
      </div>
    ),
  };

  const renderSpecialInputs = () => {
    const SpecialInput = specialInputs[tool.id];
    if (!SpecialInput) return null;

    return (
      <SpecialInput
        selectedOption={selectedOption}
        onSelectOption={setSelectedOption}
        fileInputRef={fileInputRef}
        onImageSelect={handleImageSelect}
      />
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <tool.icon className="h-5 w-5 text-primary" />
            {tool.name}
          </DialogTitle>
          <DialogDescription>
            {tool.description}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 py-4">
          <div className="space-y-4">
            {renderSpecialInputs()}
            
            {tool.id !== 'capyocr' && (
              <Textarea
                placeholder={`Digite sua entrada para ${tool.name}...`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            )}

            <Button 
              onClick={handleSubmit}
              disabled={(!inputText.trim() && !selectedImage) || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <tool.icon className="h-4 w-4 mr-2" />
                  Executar {tool.name}
                </>
              )}
            </Button>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Resultado</label>
              {result && (
                <Button variant="outline" size="sm" onClick={() => {
                  navigator.clipboard.writeText(result);
                  showCopySuccessToast();
                }}>
                  <Copy className="h-3 w-3 mr-1" />
                  Copiar
                </Button>
              )}
            </div>
            
            <Card className="min-h-[300px]">
              <CardContent className="p-4">
                {result ? (
                  <ScrollArea className="h-[280px]">
                    {tool.id === 'capyide' ? (
                      <div className="space-y-2">
                        <div className="border rounded p-2 bg-muted">
                          <iframe
                            srcDoc={result}
                            className="w-full h-40 border-0"
                            title="Preview"
                          />
                        </div>
                        <details className="text-xs">
                          <summary className="cursor-pointer font-medium">Ver Código</summary>
                          <pre className="mt-2 p-2 bg-muted rounded overflow-x-auto">
                            <code>{result}</code>
                          </pre>
                        </details>
                      </div>
                    ) : (
                      <div className="max-w-none whitespace-pre-wrap text-sm">
                        {result}
                      </div>
                    )}
                  </ScrollArea>
                ) : (
                  <div className="flex items-center justify-center h-[280px] text-muted-foreground">
                    <div className="text-center">
                      <tool.icon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                      <p>O resultado aparecerá aqui</p>
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
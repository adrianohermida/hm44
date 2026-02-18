import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Search, FileText, Plus, Target } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

export default React.memo(function IntencaoBuscaComTarefas({ keywords = [], escritorioId }) {
  const [analisando, setAnalisando] = useState(false);
  const [analise, setAnalise] = useState(null);
  const navigate = useNavigate();

  if (!keywords.length) return null;

  const analisarIntencao = async () => {
    if (keywords.length === 0) {
      toast.error('Adicione pelo menos uma palavra-chave');
      return;
    }

    setAnalisando(true);
    try {
      const resultado = await base44.integrations.Core.InvokeLLM({
        prompt: `ANÁLISE ESTRATÉGICA - Intenção de Busca & Criação de Tarefas

KEYWORDS: ${keywords.join(', ')}

OBJETIVO: Criar TAREFAS APLICÁVEIS para cada keyword.

Para CADA keyword, retorne:

1. CLASSIFICAÇÃO:
   - Intenção (informacional/transacional/navegacional)
   - Funil (ToFu/MoFu/BoFu)
   - Tipo de conteúdo ideal

2. TÍTULO OTIMIZADO (melhor opção com CTR estimado)

3. ESTRUTURA COMPLETA:
   - 5-7 H2s sequenciais e lógicos
   - Introdução sugerida (2-3 linhas)
   - Conclusão sugerida (2-3 linhas)

4. TAREFA ESPECÍFICA:
   - Tipo: "criar_artigo_novo" ou "otimizar_existente"
   - Prioridade: Alta/Média/Baixa
   - Razão (por que é importante)
   - Impacto esperado (tráfego, conversão)

Seja PRÁTICO e APLICÁVEL.`,
        response_json_schema: {
          type: "object",
          properties: {
            tarefas: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  keyword: { type: "string" },
                  intencao: { type: "string" },
                  funil: { type: "string" },
                  tipo_conteudo: { type: "string" },
                  titulo_otimizado: { type: "string" },
                  ctr_estimado: { type: "number" },
                  estrutura_h2: { type: "array", items: { type: "string" } },
                  introducao_sugerida: { type: "string" },
                  conclusao_sugerida: { type: "string" },
                  tipo_tarefa: { type: "string" },
                  prioridade: { type: "string" },
                  razao_importancia: { type: "string" },
                  impacto_esperado: { type: "string" }
                }
              }
            }
          }
        }
      });

      setAnalise(resultado.tarefas || []);
      toast.success(`${resultado.tarefas?.length || 0} tarefas criadas!`);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao analisar');
    } finally {
      setAnalisando(false);
    }
  };

  const criarArtigoComTarefa = async (tarefa) => {
    try {
      const topicosIniciais = [];
      
      if (tarefa.introducao_sugerida) {
        topicosIniciais.push({
          id: Date.now(),
          tipo: 'paragrafo',
          texto: tarefa.introducao_sugerida
        });
      }

      tarefa.estrutura_h2?.forEach((h2, i) => {
        topicosIniciais.push({
          id: Date.now() + i * 10 + 1,
          tipo: 'h2',
          texto: h2
        });
        topicosIniciais.push({
          id: Date.now() + i * 10 + 2,
          tipo: 'paragrafo',
          texto: `[Desenvolva: ${h2}]`
        });
      });

      if (tarefa.conclusao_sugerida) {
        topicosIniciais.push({
          id: Date.now() + 999,
          tipo: 'paragrafo',
          texto: tarefa.conclusao_sugerida
        });
      }

      const dados = {
        titulo: tarefa.titulo_otimizado,
        categoria: 'direito_consumidor',
        keywords: [tarefa.keyword],
        topicos: topicosIniciais,
        resumo: tarefa.razao_importancia,
        status: 'rascunho',
        escritorio_id: escritorioId
      };

      const novoArtigo = await base44.entities.Blog.create(dados);
      toast.success('Artigo completo pré-criado!');
      setTimeout(() => navigate(`/EditorBlog?id=${novoArtigo.id}`), 800);
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao criar artigo');
    }
  };

  const getFunilColor = (funil) => {
    if (funil?.includes('ToFu') || funil?.includes('topo')) return 'bg-yellow-100 text-yellow-800';
    if (funil?.includes('MoFu') || funil?.includes('meio')) return 'bg-orange-100 text-orange-800';
    if (funil?.includes('BoFu') || funil?.includes('fundo')) return 'bg-red-100 text-red-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getPrioridadeColor = (prioridade) => {
    if (prioridade?.toLowerCase() === 'alta') return 'bg-red-600';
    if (prioridade?.toLowerCase() === 'média') return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 border-2 border-indigo-200">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-700" />
          <h3 className="font-bold text-indigo-900">Tarefas de Conteúdo (IA)</h3>
        </div>
        <Button 
          size="sm" 
          onClick={analisarIntencao} 
          disabled={analisando || keywords.length === 0}
        >
          <Sparkles className={`w-3 h-3 mr-1 ${analisando ? 'animate-pulse' : ''}`} />
          {analisando ? 'Criando...' : 'Criar Tarefas'}
        </Button>
      </div>

      {keywords.length === 0 && (
        <p className="text-sm text-gray-500 italic">
          Adicione keywords para gerar tarefas estratégicas
        </p>
      )}

      {analise && analise.length > 0 && (
        <div className="space-y-3 mt-4">
          {analise.map((tarefa, idx) => (
            <div key={idx} className="border-2 border-indigo-300 rounded-lg p-4 bg-white">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span className="font-bold text-sm">{tarefa.keyword}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    <Badge className={getFunilColor(tarefa.funil)}>{tarefa.funil}</Badge>
                    <Badge className={`${getPrioridadeColor(tarefa.prioridade)} text-white`}>
                      {tarefa.prioridade}
                    </Badge>
                    <Badge variant="outline">{tarefa.tipo_conteudo}</Badge>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-2 rounded mb-2 text-xs">
                <p className="font-bold text-blue-900">{tarefa.titulo_otimizado}</p>
                <p className="text-blue-700 mt-1">CTR estimado: ~{tarefa.ctr_estimado}%</p>
              </div>

              <div className="bg-purple-50 p-2 rounded mb-2 text-xs">
                <p className="font-medium text-purple-900">💡 Por que criar:</p>
                <p className="text-gray-700">{tarefa.razao_importancia}</p>
              </div>

              <div className="bg-green-50 p-2 rounded mb-3 text-xs">
                <p className="font-medium text-green-900">📊 Impacto:</p>
                <p className="text-gray-700">{tarefa.impacto_esperado}</p>
              </div>

              <Button
                size="sm"
                onClick={() => criarArtigoComTarefa(tarefa)}
                className="w-full bg-indigo-600 hover:bg-indigo-700"
              >
                <Plus className="w-3 h-3 mr-1" />
                Criar Artigo Pré-Preenchido
              </Button>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
});
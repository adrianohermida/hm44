import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, AlertTriangle, CheckCircle, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MonitoramentoSEO({ escritorioId }) {
  const navigate = useNavigate();

  const { data: artigos = [] } = useQuery({
    queryKey: ['blog-monitoramento', escritorioId],
    queryFn: () => base44.entities.Blog.filter({ 
      escritorio_id: escritorioId,
      publicado: true 
    }, '-visualizacoes'),
    enabled: !!escritorioId
  });

  const analisarArtigo = (artigo) => {
    const problemas = [];
    const acoes = [];
    let prioridade = 'baixa';

    // Score SEO baixo
    if ((artigo.score_seo_atual || 0) < 70) {
      problemas.push('Score SEO abaixo de 70');
      acoes.push('Otimizar título, meta e keywords');
      prioridade = 'alta';
    }

    // Meta description ausente
    if (!artigo.meta_description || artigo.meta_description.length < 120) {
      problemas.push('Meta description ausente ou curta');
      acoes.push('Gerar meta description otimizada');
      if (prioridade !== 'alta') prioridade = 'média';
    }

    // ALT de imagem ausente
    if (artigo.imagem_capa && !artigo.imagem_alt) {
      problemas.push('Imagem sem descrição ALT');
      acoes.push('Gerar ALT text com IA');
      if (prioridade === 'baixa') prioridade = 'média';
    }

    // Keywords insuficientes
    if (!artigo.keywords || artigo.keywords.length < 3) {
      problemas.push('Menos de 3 keywords');
      acoes.push('Adicionar keywords relevantes');
      if (prioridade === 'baixa') prioridade = 'média';
    }

    // Baixa performance
    if (artigo.visualizacoes < 50 && artigo.created_date) {
      const diasPublicado = Math.floor((Date.now() - new Date(artigo.created_date).getTime()) / (1000 * 60 * 60 * 24));
      if (diasPublicado > 30) {
        problemas.push('Baixo tráfego orgânico');
        acoes.push('Revisar estratégia de keywords e promover');
        if (prioridade === 'baixa') prioridade = 'média';
      }
    }

    // A/B test sem conclusão
    if (artigo.ab_test_ativo && artigo.visualizacoes > 100) {
      const ctrA = (artigo.ab_cliques_a / artigo.visualizacoes) * 100;
      const ctrB = (artigo.ab_cliques_b / artigo.visualizacoes) * 100;
      if (Math.abs(ctrA - ctrB) > 1) {
        problemas.push('A/B test com vencedor claro');
        acoes.push(`Aplicar título ${ctrB > ctrA ? 'B' : 'A'} como definitivo`);
        if (prioridade === 'baixa') prioridade = 'média';
      }
    }

    return { problemas, acoes, prioridade, score: artigo.score_seo_atual || 0 };
  };

  const artigosComProblemas = artigos
    .map(artigo => ({ ...artigo, analise: analisarArtigo(artigo) }))
    .filter(a => a.analise.problemas.length > 0)
    .sort((a, b) => {
      const prioridadeOrdem = { alta: 3, média: 2, baixa: 1 };
      return prioridadeOrdem[b.analise.prioridade] - prioridadeOrdem[a.analise.prioridade];
    });

  const getPrioridadeColor = (prioridade) => {
    if (prioridade === 'alta') return 'bg-red-600';
    if (prioridade === 'média') return 'bg-yellow-600';
    return 'bg-green-600';
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-600" />
          <h3 className="font-bold text-lg">Monitoramento SEO em Tempo Real</h3>
        </div>
        <Badge className={artigosComProblemas.length > 0 ? 'bg-orange-600' : 'bg-green-600'} className="text-white">
          {artigosComProblemas.length} artigo(s) precisam atenção
        </Badge>
      </div>

      {artigosComProblemas.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-sm font-medium text-gray-700">Todos os artigos estão otimizados!</p>
          <p className="text-xs text-gray-500 mt-1">Nenhuma ação de SEO pendente no momento.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {artigosComProblemas.map(artigo => (
            <div key={artigo.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-sm">{artigo.titulo}</h4>
                    <Badge className={`${getPrioridadeColor(artigo.analise.prioridade)} text-white text-xs`}>
                      {artigo.analise.prioridade}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <span>Score: {artigo.analise.score}/100</span>
                    <span>•</span>
                    <span>{artigo.visualizacoes || 0} visualizações</span>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => navigate(`/EditorBlog?id=${artigo.id}`)}
                  variant="outline"
                >
                  <Edit className="w-3 h-3 mr-1" />
                  Editar
                </Button>
              </div>

              <div className="space-y-2">
                <div className="bg-red-50 p-2 rounded border border-red-200">
                  <p className="text-xs font-medium text-red-900 mb-1 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" />
                    Problemas Detectados:
                  </p>
                  <ul className="space-y-0.5">
                    {artigo.analise.problemas.map((prob, i) => (
                      <li key={i} className="text-xs text-red-700">• {prob}</li>
                    ))}
                  </ul>
                </div>

                <div className="bg-green-50 p-2 rounded border border-green-200">
                  <p className="text-xs font-medium text-green-900 mb-1 flex items-center gap-1">
                    <CheckCircle className="w-3 h-3" />
                    Ações Recomendadas:
                  </p>
                  <ul className="space-y-0.5">
                    {artigo.analise.acoes.map((acao, i) => (
                      <li key={i} className="text-xs text-green-700">• {acao}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
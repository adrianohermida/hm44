import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckSquare, AlertTriangle, Edit, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ChecklistOtimizacao({ artigo }) {
  const navigate = useNavigate();

  const avaliarArtigo = () => {
    const tarefas = [];

    // Meta description
    const metaLength = artigo.meta_description?.length || 0;
    if (metaLength < 150 || metaLength > 160) {
      tarefas.push({
        tipo: 'meta',
        descricao: metaLength === 0 ? 'Criar meta description' : 'Ajustar comprimento da meta (150-160 chars)',
        prioridade: 'alta',
        acao: 'Usar gerador de Meta IA'
      });
    }

    // ALT de imagem
    if (artigo.imagem_capa && !artigo.imagem_alt) {
      tarefas.push({
        tipo: 'alt',
        descricao: 'Adicionar descrição ALT na imagem',
        prioridade: 'alta',
        acao: 'Gerar ALT com IA'
      });
    }

    // Keywords
    if (!artigo.keywords || artigo.keywords.length < 3) {
      tarefas.push({
        tipo: 'keywords',
        descricao: 'Adicionar mais keywords (mínimo 3)',
        prioridade: 'média',
        acao: 'Analisar intenção de busca'
      });
    }

    // Score SEO baixo
    if ((artigo.score_seo_atual || 0) < 80) {
      tarefas.push({
        tipo: 'seo',
        descricao: `Melhorar score SEO (atual: ${artigo.score_seo_atual || 0}/100)`,
        prioridade: 'alta',
        acao: 'Usar Otimização Rápida'
      });
    }

    // Slug
    if ((artigo.score_slug || 0) < 80) {
      tarefas.push({
        tipo: 'slug',
        descricao: 'Otimizar slug para SEO',
        prioridade: 'média',
        acao: 'Gerar slug com IA'
      });
    }

    // Performance
    if (artigo.visualizacoes < 50 && artigo.publicado) {
      const diasPublicado = Math.floor((Date.now() - new Date(artigo.created_date).getTime()) / (1000 * 60 * 60 * 24));
      if (diasPublicado > 7) {
        tarefas.push({
          tipo: 'performance',
          descricao: 'Baixo tráfego orgânico',
          prioridade: 'média',
          acao: 'Revisar keywords e promover'
        });
      }
    }

    // A/B test
    if (artigo.ab_test_ativo && artigo.visualizacoes > 100) {
      const ctrA = ((artigo.ab_cliques_a || 0) / artigo.visualizacoes) * 100;
      const ctrB = ((artigo.ab_cliques_b || 0) / artigo.visualizacoes) * 100;
      if (Math.abs(ctrA - ctrB) > 1) {
        tarefas.push({
          tipo: 'ab',
          descricao: `A/B test conclusivo: Título ${ctrB > ctrA ? 'B' : 'A'} venceu`,
          prioridade: 'baixa',
          acao: 'Aplicar título vencedor'
        });
      }
    }

    return tarefas;
  };

  const tarefas = avaliarArtigo();
  const prioridadeAlta = tarefas.filter(t => t.prioridade === 'alta').length;

  const getPrioridadeColor = (prioridade) => {
    if (prioridade === 'alta') return 'bg-red-600';
    if (prioridade === 'média') return 'bg-yellow-600';
    return 'bg-green-600';
  };

  if (tarefas.length === 0) {
    return (
      <div className="flex items-center gap-2 text-sm text-green-600">
        <CheckSquare className="w-4 h-4" />
        <span>Otimizado</span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <AlertTriangle className="w-4 h-4 text-orange-600" />
        <span className="text-sm font-medium">
          {tarefas.length} {tarefas.length === 1 ? 'tarefa' : 'tarefas'}
        </span>
        {prioridadeAlta > 0 && (
          <Badge className="bg-red-600 text-white text-xs">
            {prioridadeAlta} urgente{prioridadeAlta > 1 ? 's' : ''}
          </Badge>
        )}
      </div>

      <div className="space-y-1">
        {tarefas.slice(0, 3).map((tarefa, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <Badge className={`${getPrioridadeColor(tarefa.prioridade)} text-white text-xs flex-shrink-0`}>
              {tarefa.prioridade}
            </Badge>
            <div className="flex-1">
              <p className="text-gray-700">{tarefa.descricao}</p>
              <p className="text-gray-500 italic">{tarefa.acao}</p>
            </div>
          </div>
        ))}
        {tarefas.length > 3 && (
          <p className="text-xs text-gray-500 italic">+{tarefas.length - 3} outras tarefas</p>
        )}
      </div>

      <Button
        size="sm"
        onClick={() => navigate(`/EditorBlog?id=${artigo.id}`)}
        className="w-full"
        variant="outline"
      >
        <Edit className="w-3 h-3 mr-1" />
        Otimizar Artigo
      </Button>
    </div>
  );
}
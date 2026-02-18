import React, { useState } from "react";
import { GripVertical, Trash2, Check, Sparkles } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import GerarParagrafoIA from "./GerarParagrafoIA";
import GerarImagemTopicoIA from "./GerarImagemTopicoIA";
import FerramentasRefinamentoIA from "./FerramentasRefinamentoIA";

export default function EditorTopicoInline({ topico, onChange, onRemove, dragHandleProps, titulo, categoria }) {
  const [editing, setEditing] = useState(!topico.texto);
  const [regenerando, setRegenerando] = useState(false);
  const [showGerarParagrafo, setShowGerarParagrafo] = useState(false);

  const regenerarTopico = async () => {
    setRegenerando(true);
    try {
      const prompt = topico.tipo === 'lista'
        ? `Título do artigo: ${titulo}\nCategoria: ${categoria}\n\nGere uma lista de 5-7 itens relacionados ao tema "${topico.texto || 'tópico atual'}". Retorne apenas os itens, um por linha.`
        : `Título do artigo: ${titulo}\nCategoria: ${categoria}\n\nReescreva e expanda este parágrafo de forma profissional e SEO-otimizada:\n\n"${topico.texto}"\n\nMantenha entre 100-150 palavras.`;

      const resultado = await base44.integrations.Core.InvokeLLM({ prompt });
      
      if (topico.tipo === 'lista') {
        const itens = resultado.split('\n').filter(i => i.trim()).map(i => i.replace(/^[-•*]\s*/, ''));
        onChange({ itens });
      } else {
        onChange({ texto: resultado.trim() });
      }
      
      toast.success('Tópico regenerado!');
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao regenerar');
    } finally {
      setRegenerando(false);
    }
  };

  const renderView = () => {
    if (topico.tipo === 'h1') return <h1 className="text-2xl font-bold">{topico.texto}</h1>;
    if (topico.tipo === 'h2') return <h2 className="text-xl font-bold">{topico.texto}</h2>;
    if (topico.tipo === 'h3') return <h3 className="text-lg font-bold">{topico.texto}</h3>;
    if (topico.tipo === 'h4') return <h4 className="text-base font-bold">{topico.texto}</h4>;
    if (topico.tipo === 'h5') return <h5 className="text-sm font-bold">{topico.texto}</h5>;
    if (topico.tipo === 'paragrafo') return <p className="text-gray-700">{topico.texto}</p>;
    if (topico.tipo === 'lista') {
      return <ul className="list-disc ml-6">{topico.itens?.map((item, i) => <li key={i}>{item}</li>)}</ul>;
    }
  };

  const renderEdit = () => {
    if (topico.tipo === 'lista') {
      return (
        <Textarea
          value={topico.itens?.join('\n') || ''}
          onChange={(e) => onChange({ itens: e.target.value.split('\n').filter(Boolean) })}
          placeholder="Um item por linha"
          rows={4}
        />
      );
    }
    
    return (
      <Textarea
        value={topico.texto || ''}
        onChange={(e) => onChange({ texto: e.target.value })}
        placeholder={`Digite o ${topico.tipo}...`}
        rows={topico.tipo === 'paragrafo' ? 4 : 2}
        autoFocus
      />
    );
  };

  const isHeading = topico.tipo === 'h2' || topico.tipo === 'h3' || topico.tipo === 'h4' || topico.tipo === 'h5';

  const alternarNivel = () => {
    const niveis = ['h2', 'h3', 'h4', 'h5'];
    const atual = niveis.indexOf(topico.tipo);
    const proximo = (atual + 1) % niveis.length;
    onChange({ tipo: niveis[proximo] });
    toast.success(`Alterado para ${niveis[proximo].toUpperCase()}`);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const citacao = e.dataTransfer.getData('text/plain');
    if (citacao && topico.texto) {
      onChange({ texto: topico.texto + citacao });
      toast.success('Citação inserida!');
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  return (
    <div 
      className="border rounded hover:bg-gray-50"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="group flex gap-2 p-3">
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex-1" onClick={() => !editing && setEditing(true)}>
          {editing ? renderEdit() : renderView()}
        </div>

        {isHeading && (
          <Button size="sm" variant="outline" onClick={alternarNivel} className="h-7">
            {topico.tipo.toUpperCase()}
          </Button>
        )}

        <div className="flex gap-1 opacity-0 group-hover:opacity-100">
          {topico.texto && topico.tipo === 'paragrafo' && (
            <FerramentasRefinamentoIA
              texto={topico.texto}
              onTextoRefinado={(novoTexto) => onChange({ texto: novoTexto })}
            />
          )}
          <Button 
            size="icon" 
            variant="ghost" 
            onClick={regenerarTopico}
            disabled={regenerando || !topico.texto}
            title="Regenerar com IA"
          >
            <Sparkles className={`w-4 h-4 text-purple-500 ${regenerando ? 'animate-pulse' : ''}`} />
          </Button>
          {editing ? (
            <Button size="icon" variant="ghost" onClick={() => setEditing(false)}>
              <Check className="w-4 h-4 text-green-600" />
            </Button>
          ) : null}
          <Button size="icon" variant="ghost" onClick={onRemove}>
            <Trash2 className="w-4 h-4 text-red-500" />
          </Button>
        </div>
      </div>

      {isHeading && !editing && (
        <div className="px-3 pb-3 flex gap-2 flex-wrap">
          <Button size="sm" variant="outline" onClick={() => setShowGerarParagrafo(!showGerarParagrafo)}>
            <Sparkles className="w-3 h-3 mr-1" />
            Gerar Parágrafo
          </Button>
          <GerarImagemTopicoIA 
            topico={topico}
            titulo={topico.texto}
            categoria={categoria}
            onImagemGerada={(img) => {
              // Imagem já será inserida automaticamente via evento
            }}
          />
        </div>
      )}

      {showGerarParagrafo && isHeading && (
        <div className="px-3 pb-3">
          <GerarParagrafoIA
            titulo={topico.texto}
            categoria={categoria}
            onParagrafoGerado={(paragrafos) => {
              setShowGerarParagrafo(false);
              // Parágrafos adicionados automaticamente via evento
              const event = new CustomEvent('adicionarParagrafos', { 
                detail: { paragrafos, aposTopicoId: topico.id }
              });
              window.dispatchEvent(event);
            }}
          />
        </div>
      )}
    </div>
  );
}
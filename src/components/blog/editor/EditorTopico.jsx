import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GripVertical, Trash2, Plus } from "lucide-react";

export default function EditorTopico({ topico, index, onChange, onRemove }) {
  const renderEditor = () => {
    switch (topico.tipo) {
      case 'h1':
      case 'h2':
      case 'h3':
        return (
          <Input
            value={topico.texto || ''}
            onChange={(e) => onChange({ texto: e.target.value })}
            placeholder={`Digite o ${topico.tipo.toUpperCase()}`}
            className={
              topico.tipo === 'h1' ? 'text-2xl font-bold' :
              topico.tipo === 'h2' ? 'text-xl font-semibold' :
              'text-lg font-medium'
            }
          />
        );
      
      case 'paragrafo':
        return (
          <Textarea
            value={topico.texto || ''}
            onChange={(e) => onChange({ texto: e.target.value })}
            placeholder="Digite o parágrafo"
            rows={4}
            className="resize-none"
          />
        );
      
      case 'lista':
        return (
          <div className="space-y-2">
            {(topico.itens || []).map((item, idx) => (
              <div key={idx} className="flex gap-2">
                <Input
                  value={item}
                  onChange={(e) => {
                    const novosItens = [...(topico.itens || [])];
                    novosItens[idx] = e.target.value;
                    onChange({ itens: novosItens });
                  }}
                  placeholder={`Item ${idx + 1}`}
                />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => {
                    const novosItens = (topico.itens || []).filter((_, i) => i !== idx);
                    onChange({ itens: novosItens });
                  }}
                >
                  <Trash2 className="w-4 h-4 text-red-500" />
                </Button>
              </div>
            ))}
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                const novosItens = [...(topico.itens || []), ''];
                onChange({ itens: novosItens });
              }}
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Adicionar Item
            </Button>
          </div>
        );
      
      default:
        return null;
    }
  };

  const getTipoLabel = () => {
    switch (topico.tipo) {
      case 'h1': return 'Título Principal';
      case 'h2': return 'Subtítulo';
      case 'h3': return 'Seção';
      case 'paragrafo': return 'Parágrafo';
      case 'lista': return 'Lista';
      default: return 'Bloco';
    }
  };

  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start gap-3">
        <div className="cursor-move mt-2">
          <GripVertical className="w-5 h-5 text-gray-400" />
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-500 uppercase">
              {getTipoLabel()}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={onRemove}
              className="h-6 w-6"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </Button>
          </div>
          
          {renderEditor()}
        </div>
      </div>
    </Card>
  );
}
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Zap, Search, Loader2, Clock } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function TemplatesSelectorPanel({ escritorioId, onSelect, onClose }) {
  const [search, setSearch] = React.useState('');

  const { data: templates = [], isLoading } = useQuery({
    queryKey: ['templates-selector', escritorioId],
    queryFn: () => base44.entities.TemplateResposta.filter({
      escritorio_id: escritorioId,
      ativo: true
    }, '-vezes_usado'),
    enabled: !!escritorioId
  });

  const filtrados = templates.filter(t =>
    t.nome.toLowerCase().includes(search.toLowerCase()) ||
    t.atalho?.toLowerCase().includes(search.toLowerCase())
  );

  const categorias = {
    boas_vindas: { label: 'Boas-vindas', color: 'bg-blue-100 text-blue-700' },
    confirmacao: { label: 'Confirmação', color: 'bg-green-100 text-green-700' },
    resolucao: { label: 'Resolução', color: 'bg-purple-100 text-purple-700' },
    follow_up: { label: 'Follow-up', color: 'bg-orange-100 text-orange-700' },
    outro: { label: 'Outro', color: 'bg-gray-100 text-gray-700' }
  };

  return (
    <div className="border-b border-[var(--border-primary)] bg-[var(--bg-elevated)] p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-[var(--brand-primary)]" />
          <h4 className="text-sm font-semibold text-[var(--text-primary)]">
            Templates Rápidos
          </h4>
        </div>
        <Button size="sm" variant="ghost" onClick={onClose}>
          <X className="w-3 h-3" />
        </Button>
      </div>

      <div className="relative mb-3">
        <Search className="absolute left-2 top-2.5 w-4 h-4 text-gray-400" />
        <Input
          placeholder="Buscar por nome ou atalho..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8"
        />
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-5 h-5 animate-spin text-[var(--brand-primary)]" />
        </div>
      ) : filtrados.length === 0 ? (
        <div className="text-center py-8">
          <Zap className="w-8 h-8 mx-auto text-gray-300 mb-2" />
          <p className="text-sm text-gray-500">
            {search ? 'Nenhum template encontrado' : 'Nenhum template cadastrado'}
          </p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {filtrados.map((template) => {
            const cat = categorias[template.categoria] || categorias.outro;
            
            return (
              <button
                key={template.id}
                onClick={() => onSelect(template)}
                className="w-full text-left p-3 rounded-lg border border-[var(--border-primary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-[var(--text-primary)]">
                        {template.nome}
                      </span>
                      {template.atalho && (
                        <Badge variant="outline" className="text-xs font-mono">
                          {template.atalho}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${cat.color}`}>
                        {cat.label}
                      </span>
                      {template.vezes_usado > 0 && (
                        <span className="text-xs text-gray-500 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {template.vezes_usado}x usado
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                <p className="text-xs text-[var(--text-secondary)] line-clamp-2">
                  {template.corpo.replace(/<[^>]*>/g, '').substring(0, 100)}...
                </p>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Star, Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function FiltrosSalvos({ filtrosAtuais, onAplicarFiltro }) {
  const queryClient = useQueryClient();
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [nomeFiltro, setNomeFiltro] = useState('');

  const { data: user } = useQuery({
    queryKey: ['me'],
    queryFn: () => base44.auth.me()
  });

  const { data: filtrosSalvos = [] } = useQuery({
    queryKey: ['filtros-salvos', user?.email],
    queryFn: () => base44.entities.FiltroSalvo.filter({ user_email: user.email }),
    enabled: !!user
  });

  const saveMutation = useMutation({
    mutationFn: (data) => base44.entities.FiltroSalvo.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['filtros-salvos']);
      toast.success('Filtro salvo');
      setShowSaveForm(false);
      setNomeFiltro('');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.FiltroSalvo.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['filtros-salvos']);
      toast.success('Filtro removido');
    }
  });

  const toggleFavoritoMutation = useMutation({
    mutationFn: ({ id, favorito }) => base44.entities.FiltroSalvo.update(id, { favorito }),
    onSuccess: () => queryClient.invalidateQueries(['filtros-salvos'])
  });

  const hasContent = filtrosSalvos.length > 0 || showSaveForm;
  
  if (!hasContent) return null;

  return (
    <div className="border-t border-[var(--border-primary)] pt-2 mt-2">
      <div className="flex items-center justify-between px-2 mb-2">
        <span className="text-xs font-semibold text-[var(--text-tertiary)] uppercase">
          Filtros Salvos
        </span>
        <Button
          variant="ghost"
          size="sm"
          className="h-6 px-2"
          onClick={() => setShowSaveForm(!showSaveForm)}
        >
          <Plus className="w-3.5 h-3.5" />
        </Button>
      </div>

      {showSaveForm && (
        <div className="px-2 mb-2">
          <Input
            placeholder="Nome do filtro..."
            value={nomeFiltro}
            onChange={(e) => setNomeFiltro(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter' && nomeFiltro.trim()) {
                saveMutation.mutate({
                  user_email: user.email,
                  nome: nomeFiltro,
                  filtros: filtrosAtuais
                });
              }
            }}
            disabled={saveMutation.isPending}
            className="h-7 text-sm"
          />
          {saveMutation.isPending && (
            <div className="text-xs text-[var(--text-tertiary)] mt-1">Salvando...</div>
          )}
        </div>
      )}

      <div className="space-y-0.5">
        {filtrosSalvos.map(filtro => (
          <div key={filtro.id} className="group flex items-center gap-1 px-2">
            <Button
              variant="ghost"
              size="sm"
              className="flex-1 justify-start h-7 px-2"
              onClick={() => onAplicarFiltro(filtro.filtros)}
            >
              <span className="text-sm truncate">{filtro.nome}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={cn("h-6 w-6 p-0 opacity-0 group-hover:opacity-100", filtro.favorito && "opacity-100")}
              onClick={() => toggleFavoritoMutation.mutate({ id: filtro.id, favorito: !filtro.favorito })}
            >
              <Star className={cn("w-3 h-3", filtro.favorito && "fill-yellow-400 text-yellow-400")} />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 text-red-500"
              onClick={() => deleteMutation.mutate(filtro.id)}
              disabled={deleteMutation.isPending}
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { StickyNote, Plus, Trash2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

function NotaItem({ nota, onDelete }) {
  return (
    <div className="p-3 border border-[var(--border-primary)] rounded-lg bg-yellow-50 dark:bg-yellow-950 relative group">
      <button
        onClick={() => onDelete(nota)}
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <Trash2 className="w-3 h-3 text-red-500 hover:text-red-700" />
      </button>
      <p className="text-xs text-[var(--text-primary)] mb-2 pr-6">{nota.texto}</p>
      <div className="flex items-center justify-between text-[10px] text-[var(--text-tertiary)]">
        <span>{nota.autor}</span>
        <span>{format(new Date(nota.data), 'dd/MM/yy HH:mm', { locale: ptBR })}</span>
      </div>
    </div>
  );
}

export default function NotasCard({ clienteId, escritorioId, notas = [] }) {
  const [novaNota, setNovaNota] = useState('');
  const [editando, setEditando] = useState(false);
  const queryClient = useQueryClient();

  const adicionarNotaMutation = useMutation({
    mutationFn: async (texto) => {
      const user = await base44.auth.me();
      const notasAtualizadas = [...(notas || []), {
        texto,
        data: new Date().toISOString(),
        autor: user.email
      }];
      
      return await base44.entities.Cliente.update(clienteId, {
        notas: notasAtualizadas
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cliente', clienteId]);
      setNovaNota('');
      setEditando(false);
      toast.success('Nota adicionada');
    }
  });

  const removerNotaMutation = useMutation({
    mutationFn: async (notaToRemove) => {
      const notasAtualizadas = notas.filter(n => n.data !== notaToRemove.data);
      return await base44.entities.Cliente.update(clienteId, {
        notas: notasAtualizadas
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['cliente', clienteId]);
      toast.success('Nota removida');
    }
  });

  const handleSalvar = () => {
    if (!novaNota.trim()) return;
    adicionarNotaMutation.mutate(novaNota);
  };

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-[var(--text-secondary)] flex items-center gap-2">
            <StickyNote className="w-4 h-4" />
            NOTAS ({notas?.length || 0})
          </CardTitle>
          {!editando && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setEditando(true)}
              className="h-7 w-7 p-0"
            >
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {editando && (
          <div className="space-y-2">
            <Textarea
              placeholder="Digite sua nota..."
              value={novaNota}
              onChange={(e) => setNovaNota(e.target.value)}
              className="min-h-[60px] text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button 
                size="sm" 
                onClick={handleSalvar} 
                disabled={!novaNota.trim()}
                className="flex-1"
              >
                Salvar
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => {
                  setEditando(false);
                  setNovaNota('');
                }}
              >
                Cancelar
              </Button>
            </div>
          </div>
        )}
        
        {notas && notas.length > 0 ? (
          <ScrollArea className="max-h-[240px]">
            <div className="space-y-2">
              {[...notas].reverse().map((nota, idx) => (
                <NotaItem 
                  key={idx} 
                  nota={nota}
                  onDelete={(n) => removerNotaMutation.mutate(n)}
                />
              ))}
            </div>
          </ScrollArea>
        ) : (
          <div className="text-center py-4 text-xs text-[var(--text-tertiary)]">
            Nenhuma nota registrada
          </div>
        )}
      </CardContent>
    </Card>
  );
}
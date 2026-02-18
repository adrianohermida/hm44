import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Download, Loader2, CheckCircle, Zap } from 'lucide-react';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

export default function ImportarEndpointsButton({ analise }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [provedorId, setProvedorId] = useState('');
  const [selecionarTodos, setSelecionarTodos] = useState(true);
  const [endpointsSelecionados, setEndpointsSelecionados] = useState([]);
  const queryClient = useQueryClient();

  const { data: provedores = [] } = useQuery({
    queryKey: ['provedores', analise.escritorio_id],
    queryFn: async () => {
      if (!analise.escritorio_id) return [];
      return await base44.entities.ProvedorAPI.filter({ 
        escritorio_id: analise.escritorio_id 
      });
    },
    enabled: modalOpen
  });

  const importarMutation = useMutation({
    mutationFn: async () => {
      const { data } = await base44.functions.invoke('criarEndpointsDeAnalise', {
        analise_id: analise.id,
        provedor_id: provedorId,
        selecionar_todos: selecionarTodos,
        endpoint_ids: selecionarTodos ? [] : endpointsSelecionados
      });
      return data;
    },
    onSuccess: (data) => {
      if (data.sucesso) {
        const msg = `${data.estatisticas.criados} criados, ${data.estatisticas.atualizados} atualizados, ${data.estatisticas.duplicados} duplicados`;
        toast.success(msg);
        queryClient.invalidateQueries(['endpoints']);
        setModalOpen(false);
      } else {
        toast.error(data.erro || 'Erro ao importar');
      }
    },
    onError: (error) => {
      toast.error('Erro: ' + error.message);
    }
  });

  const endpoints = analise.endpoints_extraidos || [];

  const toggleEndpoint = (index) => {
    setEndpointsSelecionados(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  return (
    <>
      <Button 
        onClick={() => setModalOpen(true)} 
        size="sm"
        disabled={!endpoints.length}
      >
        <Download className="w-4 h-4 mr-2" />
        Importar Endpoints
      </Button>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Importar Endpoints</DialogTitle>
            <DialogDescription>
              Selecione o provedor e os endpoints que deseja importar
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Provedor Destino</label>
              <Select value={provedorId} onValueChange={setProvedorId}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o provedor" />
                </SelectTrigger>
                <SelectContent>
                  {provedores.map(p => (
                    <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Checkbox 
                checked={selecionarTodos}
                onCheckedChange={setSelecionarTodos}
                id="todos"
              />
              <label htmlFor="todos" className="text-sm cursor-pointer">
                Selecionar todos ({endpoints.length} endpoints)
              </label>
            </div>

            {!selecionarTodos && (
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Endpoints Selecionados ({endpointsSelecionados.length})
                </label>
                <ScrollArea className="h-[300px] border rounded-lg">
                  <div className="p-2 space-y-1">
                    {endpoints.map((ep, index) => (
                      <div 
                        key={index}
                        className="flex items-center gap-2 p-2 hover:bg-[var(--bg-secondary)] rounded cursor-pointer"
                        onClick={() => toggleEndpoint(index)}
                      >
                        <Checkbox 
                          checked={endpointsSelecionados.includes(index)}
                          onCheckedChange={() => toggleEndpoint(index)}
                        />
                        <Badge className="text-xs">{ep.metodo}</Badge>
                        <code className="text-xs flex-1 truncate">{ep.path}</code>
                        {ep.prioridade_teste?.score > 70 && (
                          <Badge variant="secondary" className="text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            {ep.prioridade_teste.score}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setModalOpen(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => importarMutation.mutate()}
                disabled={importarMutation.isPending || !provedorId || (!selecionarTodos && !endpointsSelecionados.length)}
                className="bg-[var(--brand-primary)]"
              >
                {importarMutation.isPending ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Download className="w-4 h-4 mr-2" />
                )}
                Importar {selecionarTodos ? 'Todos' : endpointsSelecionados.length}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
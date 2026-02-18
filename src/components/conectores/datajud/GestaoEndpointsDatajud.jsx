import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search, Plus, Edit, Trash2, Database, CheckCircle, XCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function GestaoEndpointsDatajud({ escritorioId }) {
  const [filtro, setFiltro] = useState('');
  const [dialogAberto, setDialogAberto] = useState(false);
  const [endpointEditando, setEndpointEditando] = useState(null);
  const queryClient = useQueryClient();

  const { data: endpoints = [], isLoading } = useQuery({
    queryKey: ['endpoints-datajud', escritorioId],
    queryFn: async () => {
      const result = await base44.entities.EndpointAPI.filter({
        escritorio_id: escritorioId,
        tags: { $contains: 'datajud' }
      });
      return result;
    },
    enabled: !!escritorioId
  });

  const criarMutation = useMutation({
    mutationFn: async (data) => {
      return await base44.entities.EndpointAPI.create({
        ...data,
        escritorio_id: escritorioId,
        provedor_id: 'datajud_cnj',
        versao_api: 'V1',
        metodo: 'POST',
        path: '/_search',
        tags: ['datajud', 'cnj', 'custom']
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endpoints-datajud']);
      setDialogAberto(false);
      setEndpointEditando(null);
      toast.success('Endpoint criado');
    }
  });

  const atualizarMutation = useMutation({
    mutationFn: async ({ id, data }) => {
      return await base44.entities.EndpointAPI.update(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endpoints-datajud']);
      setDialogAberto(false);
      setEndpointEditando(null);
      toast.success('Endpoint atualizado');
    }
  });

  const deletarMutation = useMutation({
    mutationFn: async (id) => {
      return await base44.entities.EndpointAPI.delete(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endpoints-datajud']);
      toast.success('Endpoint removido');
    }
  });

  const toggleAtivoMutation = useMutation({
    mutationFn: async ({ id, ativo }) => {
      return await base44.entities.EndpointAPI.update(id, { ativo });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['endpoints-datajud']);
    }
  });

  const endpointsFiltrados = endpoints.filter(e =>
    !filtro ||
    e.nome?.toLowerCase().includes(filtro.toLowerCase()) ||
    e.categoria?.toLowerCase().includes(filtro.toLowerCase()) ||
    e.descricao?.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleSalvar = (formData) => {
    if (endpointEditando) {
      atualizarMutation.mutate({ id: endpointEditando.id, data: formData });
    } else {
      criarMutation.mutate(formData);
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Gestão de Endpoints DataJud
          </CardTitle>
          <Dialog open={dialogAberto} onOpenChange={setDialogAberto}>
            <DialogTrigger asChild>
              <Button onClick={() => setEndpointEditando(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Endpoint
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>
                  {endpointEditando ? 'Editar Endpoint' : 'Novo Endpoint'}
                </DialogTitle>
              </DialogHeader>
              <FormEndpoint
                endpoint={endpointEditando}
                onSalvar={handleSalvar}
                onCancelar={() => {
                  setDialogAberto(false);
                  setEndpointEditando(null);
                }}
              />
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-400" />
          <Input
            placeholder="Buscar endpoints..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
        </div>

        <ScrollArea className="h-[500px]">
          {isLoading ? (
            <p className="text-sm text-gray-500 p-4">Carregando...</p>
          ) : endpointsFiltrados.length === 0 ? (
            <p className="text-sm text-gray-500 p-4">
              {endpoints.length === 0 ? 'Nenhum endpoint cadastrado' : 'Nenhum resultado encontrado'}
            </p>
          ) : (
            <div className="space-y-3">
              {endpointsFiltrados.map((endpoint) => (
                <div key={endpoint.id} className="border rounded p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{endpoint.nome}</h4>
                        {endpoint.ativo ? (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">{endpoint.descricao}</p>
                      <div className="flex gap-2 mt-2">
                        <Badge variant="outline" className="text-xs">
                          {endpoint.categoria}
                        </Badge>
                        <code className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                          POST /{endpoint.path}
                        </code>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={endpoint.ativo}
                        onCheckedChange={(checked) =>
                          toggleAtivoMutation.mutate({ id: endpoint.id, ativo: checked })
                        }
                      />
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEndpointEditando(endpoint);
                          setDialogAberto(true);
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (confirm('Confirma exclusão?')) {
                            deletarMutation.mutate(endpoint.id);
                          }
                        }}
                      >
                        <Trash2 className="w-4 h-4 text-red-600" />
                      </Button>
                    </div>
                  </div>

                  {endpoint.parametros?.length > 0 && (
                    <div className="text-xs">
                      <strong>Parâmetros:</strong>{' '}
                      {endpoint.parametros.map(p => p.nome).join(', ')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function FormEndpoint({ endpoint, onSalvar, onCancelar }) {
  const [form, setForm] = useState({
    nome: endpoint?.nome || '',
    categoria: endpoint?.categoria || '',
    descricao: endpoint?.descricao || '',
    exemplo_payload: endpoint?.exemplo_payload ? JSON.stringify(endpoint.exemplo_payload, null, 2) : '',
    parametros_json: endpoint?.parametros ? JSON.stringify(endpoint.parametros, null, 2) : '[]'
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    try {
      const data = {
        nome: form.nome,
        categoria: form.categoria,
        descricao: form.descricao,
        exemplo_payload: form.exemplo_payload ? JSON.parse(form.exemplo_payload) : {},
        parametros: form.parametros_json ? JSON.parse(form.parametros_json) : []
      };
      onSalvar(data);
    } catch (error) {
      toast.error('JSON inválido');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <ScrollArea className="max-h-[60vh]">
        <div className="space-y-4 pr-4">
          <div>
            <Label>Nome do Endpoint</Label>
            <Input
              value={form.nome}
              onChange={(e) => setForm({ ...form, nome: e.target.value })}
              placeholder="Busca por CPF"
              required
            />
          </div>

          <div>
            <Label>Categoria</Label>
            <Input
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              placeholder="Busca por Documento"
            />
          </div>

          <div>
            <Label>Descrição</Label>
            <Textarea
              value={form.descricao}
              onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              placeholder="Localiza processos por CPF da parte"
              rows={2}
            />
          </div>

          <div>
            <Label>Exemplo de Payload (JSON)</Label>
            <Textarea
              value={form.exemplo_payload}
              onChange={(e) => setForm({ ...form, exemplo_payload: e.target.value })}
              placeholder='{"query": {"match": {"cpf": "12345678900"}}, "size": 10}'
              rows={6}
              className="font-mono text-xs"
            />
          </div>

          <div>
            <Label>Parâmetros (JSON Array)</Label>
            <Textarea
              value={form.parametros_json}
              onChange={(e) => setForm({ ...form, parametros_json: e.target.value })}
              placeholder='[{"nome": "cpf", "tipo": "string", "obrigatorio": true}]'
              rows={6}
              className="font-mono text-xs"
            />
          </div>
        </div>
      </ScrollArea>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancelar}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
}
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, User, Building2, FileText, Loader2, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { debounce } from 'lodash';

export default function AdicionarParteModal({ open, onClose, processoId, escritorioId, parte, onSave }) {
  const [tab, setTab] = useState(parte ? 'manual' : 'busca');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('todos');
  const [formData, setFormData] = useState(parte || {
    nome: '',
    cpf_cnpj: '',
    tipo_pessoa: 'fisica',
    tipo_parte: 'polo_ativo',
    qualificacao: ''
  });
  const [enriching, setEnriching] = useState(false);

  const normalize = (str) => str?.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '') || '';

  const debouncedUpdate = React.useMemo(
    () => debounce((val) => setDebouncedSearch(val), 300),
    []
  );

  React.useEffect(() => {
    debouncedUpdate(search);
  }, [search, debouncedUpdate]);

  const { data: clientes = [], isLoading: loadingC } = useQuery({
    queryKey: ['search-clientes', debouncedSearch],
    queryFn: async () => {
      const all = await base44.entities.Cliente.filter({ escritorio_id: escritorioId });
      const termo = normalize(debouncedSearch);
      const nums = debouncedSearch.replace(/\D/g, '');
      return all.filter(c => 
        normalize(c.nome_completo).includes(termo) ||
        c.cpf_cnpj?.includes(nums) ||
        normalize(c.email).includes(termo)
      );
    },
    enabled: debouncedSearch.length >= 2
  });

  const { data: partes = [], isLoading: loadingP } = useQuery({
    queryKey: ['search-partes', debouncedSearch],
    queryFn: async () => {
      const all = await base44.entities.ProcessoParte.filter({ escritorio_id: escritorioId });
      const termo = normalize(debouncedSearch);
      const nums = debouncedSearch.replace(/\D/g, '');
      return all.filter(p => 
        normalize(p.nome).includes(termo) ||
        p.cpf_cnpj?.includes(nums)
      ).filter(p => !p.oabs || p.oabs.length === 0);
    },
    enabled: debouncedSearch.length >= 2
  });

  const { data: advogados = [], isLoading: loadingA } = useQuery({
    queryKey: ['search-advogados', debouncedSearch],
    queryFn: async () => {
      const all = await base44.entities.ProcessoParte.filter({ escritorio_id: escritorioId });
      const termo = normalize(debouncedSearch);
      const nums = debouncedSearch.replace(/\D/g, '');
      return all.filter(p => {
        const hasOAB = p.oabs && p.oabs.length > 0;
        const isAdvPolo = p.polo_escavador === 'ADVOGADO';
        if (!hasOAB && !isAdvPolo) return false;
        return normalize(p.nome).includes(termo) || 
               p.cpf_cnpj?.includes(nums) ||
               p.oabs?.some(oab => oab.numero?.toString().includes(nums));
      });
    },
    enabled: debouncedSearch.length >= 2
  });

  const handleSelectExistente = (item, tipo) => {
    setFormData({
      ...formData,
      nome: item.nome_completo || item.nome,
      cpf_cnpj: item.cpf_cnpj || item.cpf || item.cnpj,
      tipo_pessoa: item.tipo_pessoa,
      cliente_id: tipo === 'cliente' ? item.id : item.cliente_id,
      email: item.email,
      telefone: item.telefone
    });
    setTab('manual');
    setSearch('');
    toast.success('Dados carregados. Complete e salve.');
  };

  const handleEnriquecer = async () => {
    if (!formData.cpf_cnpj) {
      toast.error('Informe CPF/CNPJ');
      return;
    }

    setEnriching(true);
    try {
      const { data } = await base44.functions.invoke('consultarCadastroDirectData', {
        documento: formData.cpf_cnpj.replace(/\D/g, ''),
        tipoPessoa: formData.tipo_pessoa,
        tipoConsulta: 'basica'
      });

      if (data.success) {
        const nome = formData.tipo_pessoa === 'fisica' ? data.data.nome : data.data.razaoSocial;
        setFormData({ ...formData, nome: nome || formData.nome, dados_completos_api: data.data });
        toast.success('Dados enriquecidos');
      }
    } catch {
      toast.error('Erro ao enriquecer');
    }
    setEnriching(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.nome?.trim()) {
      toast.error('Nome é obrigatório');
      return;
    }

    onSave({
      nome: formData.nome.trim(),
      cpf_cnpj: formData.cpf_cnpj?.replace(/\D/g, '') || null,
      tipo_pessoa: formData.tipo_pessoa,
      tipo_parte: formData.tipo_parte,
      qualificacao: formData.qualificacao?.trim() || null,
      cliente_id: formData.cliente_id || null,
      email: formData.email || null,
      telefone: formData.telefone || null,
      dados_completos_api: formData.dados_completos_api || null
    });
  };

  const isLoading = loadingC || loadingP || loadingA;
  
  const filteredClientes = filtroTipo === 'todos' || filtroTipo === 'clientes' ? clientes : [];
  const filteredPartes = filtroTipo === 'todos' || filtroTipo === 'partes' ? partes : [];
  const filteredAdvogados = filtroTipo === 'todos' || filtroTipo === 'advogados' ? advogados : [];
  
  const hasResults = filteredClientes.length > 0 || filteredPartes.length > 0 || filteredAdvogados.length > 0;
  const totalClientes = clientes.length;
  const totalPartes = partes.length;
  const totalAdvogados = advogados.length;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{parte ? 'Editar Parte' : 'Adicionar Parte'}</DialogTitle>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 overflow-hidden flex flex-col">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="busca" disabled={!!parte}>
              <Search className="w-4 h-4 mr-2" />
              Buscar Existente
            </TabsTrigger>
            <TabsTrigger value="manual">
              Preencher Manualmente
            </TabsTrigger>
          </TabsList>

          <TabsContent value="busca" className="flex-1 overflow-hidden">
            <div className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 w-4 h-4 text-[var(--text-tertiary)]" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Digite nome, CPF/CNPJ ou OAB (mín 2 caracteres)"
                  className="pl-9"
                />
                {isLoading && <Loader2 className="absolute right-3 top-3 w-4 h-4 animate-spin" />}
              </div>

              {search.length >= 2 && (totalClientes + totalPartes + totalAdvogados) > 0 && (
                <div className="flex gap-2">
                  <Badge 
                    variant={filtroTipo === 'todos' ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => setFiltroTipo('todos')}
                  >
                    Todos ({totalClientes + totalPartes + totalAdvogados})
                  </Badge>
                  {totalClientes > 0 && (
                    <Badge 
                      variant={filtroTipo === 'clientes' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFiltroTipo('clientes')}
                    >
                      Clientes ({totalClientes})
                    </Badge>
                  )}
                  {totalPartes > 0 && (
                    <Badge 
                      variant={filtroTipo === 'partes' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFiltroTipo('partes')}
                    >
                      Partes ({totalPartes})
                    </Badge>
                  )}
                  {totalAdvogados > 0 && (
                    <Badge 
                      variant={filtroTipo === 'advogados' ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => setFiltroTipo('advogados')}
                    >
                      Advogados ({totalAdvogados})
                    </Badge>
                  )}
                </div>
              )}

              <ScrollArea className="h-[400px] pr-4">
                {search.length < 2 && (
                  <div className="text-center py-12 text-[var(--text-secondary)]">
                    <Search className="w-12 h-12 mx-auto mb-3 text-[var(--text-tertiary)]" />
                    <p className="font-medium mb-1">Digite para buscar</p>
                    <p className="text-sm">Busque clientes ou partes existentes</p>
                  </div>
                )}

                {search.length >= 2 && isLoading && (
                  <div className="text-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-[var(--brand-primary)]" />
                    <p className="text-sm text-[var(--text-secondary)]">Buscando...</p>
                  </div>
                )}

                {search.length >= 2 && !isLoading && !hasResults && (
                  <div className="text-center py-12">
                    <p className="text-[var(--text-secondary)] mb-4">Nenhum resultado encontrado</p>
                    <Button onClick={() => setTab('manual')}>
                      Preencher Manualmente
                    </Button>
                  </div>
                )}

                {filteredClientes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] mb-2 px-2">
                      CLIENTES ({filteredClientes.length})
                    </h4>
                    {filteredClientes.map(c => (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => handleSelectExistente(c, 'cliente')}
                        className="w-full p-3 hover:bg-[var(--bg-secondary)] rounded-lg flex items-start gap-3 transition-colors"
                      >
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {c.tipo_pessoa === 'fisica' ? <User className="w-4 h-4 text-blue-600" /> : <Building2 className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{c.nome_completo}</p>
                          <div className="flex gap-2 mt-1">
                            {c.cpf_cnpj && <Badge variant="outline" className="text-xs">{c.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ'}: {c.cpf_cnpj}</Badge>}
                            {c.email && <span className="text-xs text-[var(--text-secondary)]">{c.email}</span>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredPartes.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] mb-2 px-2">
                      PARTES EM OUTROS PROCESSOS ({filteredPartes.length})
                    </h4>
                    {filteredPartes.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => handleSelectExistente(p, 'parte')}
                        className="w-full p-3 hover:bg-[var(--bg-secondary)] rounded-lg flex items-start gap-3 transition-colors"
                      >
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <FileText className="w-4 h-4 text-purple-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{p.nome}</p>
                          <div className="flex gap-2 mt-1">
                            {p.cpf_cnpj && <Badge variant="outline" className="text-xs">{p.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ'}: {p.cpf_cnpj}</Badge>}
                            {p.qualificacao && <Badge variant="secondary" className="text-xs">{p.qualificacao}</Badge>}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {filteredAdvogados.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-[var(--text-tertiary)] mb-2 px-2">
                      ADVOGADOS ({filteredAdvogados.length})
                    </h4>
                    {filteredAdvogados.map(a => (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => handleSelectExistente(a, 'parte')}
                        className="w-full p-3 hover:bg-[var(--bg-secondary)] rounded-lg flex items-start gap-3 transition-colors"
                      >
                        <div className="p-2 bg-amber-100 rounded-lg">
                          <User className="w-4 h-4 text-amber-600" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="font-medium text-sm">{a.nome}</p>
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {a.cpf_cnpj && <Badge variant="outline" className="text-xs">CPF: {a.cpf_cnpj}</Badge>}
                            {a.oabs?.map((oab, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                OAB/{oab.uf} {oab.numero}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="manual" className="flex-1 overflow-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Tipo de Pessoa *</Label>
                  <Select value={formData.tipo_pessoa} onValueChange={v => setFormData({...formData, tipo_pessoa: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fisica">Pessoa Física</SelectItem>
                      <SelectItem value="juridica">Pessoa Jurídica</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label>Polo *</Label>
                  <Select value={formData.tipo_parte} onValueChange={v => setFormData({...formData, tipo_parte: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="polo_ativo">Polo Ativo</SelectItem>
                      <SelectItem value="polo_passivo">Polo Passivo</SelectItem>
                      <SelectItem value="terceiro_interessado">Terceiro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label>CPF/CNPJ</Label>
                <div className="flex gap-2">
                  <Input
                    value={formData.cpf_cnpj}
                    onChange={e => setFormData({...formData, cpf_cnpj: e.target.value})}
                    placeholder={formData.tipo_pessoa === 'fisica' ? '000.000.000-00' : '00.000.000/0000-00'}
                  />
                  <Button 
                    type="button" 
                    size="icon"
                    variant="outline" 
                    onClick={handleEnriquecer}
                    disabled={enriching || !formData.cpf_cnpj}
                    title="Buscar dados na API"
                  >
                    {enriching ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              <div>
                <Label>Nome Completo *</Label>
                <Input
                  value={formData.nome}
                  onChange={e => setFormData({...formData, nome: e.target.value})}
                  placeholder="Nome da parte"
                  required
                />
              </div>

              <div>
                <Label>Qualificação</Label>
                <Input
                  value={formData.qualificacao}
                  onChange={e => setFormData({...formData, qualificacao: e.target.value})}
                  placeholder="Ex: Autor, Réu, Executado..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-[var(--brand-primary)]">
                  {parte ? 'Atualizar' : 'Adicionar'}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
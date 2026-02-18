import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { Search, Loader2, AlertCircle, Download, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { limparCNJ } from '@/components/utils/cnjUtils';

export default function ApensarProcessoModal({ open, onClose, processoAtual, onSave }) {
  const [data, setData] = React.useState({ relation_type: 'apenso', direction: 'filho' });
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProcesso, setSelectedProcesso] = React.useState(null);
  const [buscandoAPI, setBuscandoAPI] = React.useState(false);
  const [resultadoAPI, setResultadoAPI] = React.useState(null);

  const { data: processos, isLoading } = useQuery({
    queryKey: ['processos-search', searchTerm],
    queryFn: async () => {
      if (!searchTerm || searchTerm.length < 3) return [];
      
      const escritorio = await base44.entities.Escritorio.list();
      const allProcessos = await base44.entities.Processo.filter({
        escritorio_id: escritorio[0].id
      });

      const term = searchTerm.toLowerCase();
      return allProcessos.filter(p => 
        p.numero_cnj?.toLowerCase().includes(term) ||
        p.polo_ativo?.toLowerCase().includes(term) ||
        p.polo_passivo?.toLowerCase().includes(term)
      );
    },
    enabled: open && searchTerm.length >= 3
  });

  const handleSelect = (processo) => {
    // Bloquear seleção do próprio processo
    if (processo.id === processoAtual?.id) {
      toast.error('Não é possível apensar o processo nele mesmo');
      return;
    }
    
    setSelectedProcesso(processo);
    setData({ ...data, numero_cnj: processo.numero_cnj, processo_id: processo.id });
  };

  const handleConfirm = () => {
    if (!selectedProcesso) return;
    onSave(data);
  };

  const buscarNaAPI = async () => {
    const cnjLimpo = limparCNJ(searchTerm);
    if (cnjLimpo.length !== 20) {
      toast.error('CNJ inválido - deve ter 20 dígitos');
      return;
    }

    setBuscandoAPI(true);
    setResultadoAPI(null);

    try {
      const { data: resultado } = await base44.functions.invoke('buscarProcessoPorCNJ', {
        numero_cnj: cnjLimpo,
        forcar_busca: false
      });

      // Processo já existe
      if (resultado.processo_existente) {
        setResultadoAPI(resultado);
        
        if (resultado.dados_completos) {
          toast.info('Processo encontrado na base');
        } else {
          toast.warning('Processo incompleto - clique em Enriquecer');
        }
        return;
      }

      // Processo criado pela API
      if (resultado.processo_criado || resultado.sucesso) {
        toast.success(`Processo importado! ${resultado.fontes_salvas || 0} fontes encontradas`);
        setResultadoAPI(resultado);
        
        // Auto-selecionar processo recém importado
        const processoImportado = {
          id: cnjLimpo,
          numero_cnj: cnjLimpo,
          titulo: resultado.processo?.titulo,
          classe: resultado.processo?.classe,
          tribunal: resultado.processo?.tribunal
        };
        handleSelect(processoImportado);
      }
    } catch (error) {
      const errorMsg = error.response?.data?.error || error.message;
      toast.error(errorMsg);
      setResultadoAPI({ erro: errorMsg });
    } finally {
      setBuscandoAPI(false);
    }
  };

  const handleEnriquecer = async () => {
    const cnjLimpo = limparCNJ(searchTerm);
    setBuscandoAPI(true);

    try {
      const { data: resultado } = await base44.functions.invoke('buscarProcessoPorCNJ', {
        numero_cnj: cnjLimpo,
        forcar_busca: true
      });

      if (resultado.sucesso) {
        toast.success('Processo enriquecido com sucesso');
        setResultadoAPI({ ...resultado, dados_completos: true });
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBuscandoAPI(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Apensar Processo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Direção</Label>
            <Select value={data.direction} onValueChange={v => setData({...data, direction: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="filho">Apensar outro processo a este</SelectItem>
                <SelectItem value="pai">Apensar este a outro processo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Buscar Processo Existente</Label>
            <div className="relative mt-1">
              <Search className="absolute left-3 top-3 h-4 w-4 text-[var(--text-tertiary)]" />
              <Input 
                placeholder="Digite número CNJ, polo ativo ou polo passivo..." 
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {searchTerm.length >= 3 && (
            <div className="border rounded-lg">
              <ScrollArea className="h-[300px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-full">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--brand-primary)]" />
                  </div>
                ) : processos?.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center p-6 space-y-3">
                    <AlertCircle className="w-12 h-12 text-[var(--text-tertiary)]" />
                    <div>
                      <p className="text-sm text-[var(--text-secondary)] mb-1">Processo não encontrado na base</p>
                      <p className="text-xs text-[var(--text-tertiary)]">Buscar na API Escavador?</p>
                    </div>
                    <Button 
                      onClick={buscarNaAPI} 
                      disabled={buscandoAPI}
                      size="sm"
                      variant="outline"
                    >
                      {buscandoAPI ? (
                        <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buscando...</>
                      ) : (
                        <><Search className="w-4 h-4 mr-2" />Buscar na API</>
                      )}
                    </Button>
                  </div>
                ) : (
                  <div className="divide-y">
                    {processos?.map(processo => {
                      const isProcessoAtual = processo.id === processoAtual?.id;
                      return (
                        <div
                          key={processo.id}
                          onClick={() => handleSelect(processo)}
                          className={`p-4 transition-colors ${
                            isProcessoAtual 
                              ? 'bg-red-50 border-l-4 border-red-500 cursor-not-allowed opacity-60'
                              : selectedProcesso?.id === processo.id 
                                ? 'bg-[var(--brand-primary-50)] border-l-4 border-[var(--brand-primary)] cursor-pointer' 
                                : 'cursor-pointer hover:bg-[var(--bg-secondary)]'
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-mono text-sm font-semibold text-[var(--text-primary)]">
                                  {processo.numero_cnj}
                                </p>
                                {isProcessoAtual && (
                                  <Badge variant="destructive" className="text-xs">
                                    <ShieldAlert className="w-3 h-3 mr-1" />
                                    Processo Atual
                                  </Badge>
                                )}
                              </div>
                              <div className="mt-2 space-y-1">
                                {processo.polo_ativo && (
                                  <p className="text-xs text-[var(--text-secondary)]">
                                    <span className="font-medium">Polo Ativo:</span> {processo.polo_ativo}
                                  </p>
                                )}
                                {processo.polo_passivo && (
                                  <p className="text-xs text-[var(--text-secondary)]">
                                    <span className="font-medium">Polo Passivo:</span> {processo.polo_passivo}
                                  </p>
                                )}
                              </div>
                              <div className="flex gap-2 mt-2 flex-wrap">
                                {processo.status && (
                                  <Badge variant="outline" className="text-xs">
                                    {processo.status}
                                  </Badge>
                                )}
                                {processo.classe && (
                                  <Badge variant="outline" className="text-xs">
                                    {processo.classe}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </div>
          )}

          {resultadoAPI && (
            <Alert className={
              resultadoAPI.erro ? 'border-red-200 bg-red-50' :
              resultadoAPI.dados_completos ? 'border-green-200 bg-green-50' : 
              'border-yellow-200 bg-yellow-50'
            }>
              <div className="flex items-start gap-3">
                {resultadoAPI.erro ? (
                  <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                ) : resultadoAPI.dados_completos ? (
                  <Search className="w-5 h-5 text-green-600 mt-0.5 shrink-0" />
                ) : (
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 shrink-0" />
                )}
                
                <div className="flex-1 space-y-2">
                  <AlertDescription className="text-xs">
                    {resultadoAPI.erro 
                      ? resultadoAPI.erro
                      : resultadoAPI.mensagem || 'Processo encontrado na API'}
                  </AlertDescription>

                  {resultadoAPI.fontes_salvas > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      <Badge variant="outline" className="text-xs">
                        {resultadoAPI.fontes_salvas} fontes
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {resultadoAPI.partes_salvas} partes
                      </Badge>
                    </div>
                  )}

                  {!resultadoAPI.dados_completos && !resultadoAPI.erro && (
                    <Button 
                      onClick={handleEnriquecer}
                      size="sm"
                      variant="outline"
                      disabled={buscandoAPI}
                    >
                      {buscandoAPI ? (
                        <><Loader2 className="w-3 h-3 mr-2 animate-spin" />Enriquecendo...</>
                      ) : (
                        <><Download className="w-3 h-3 mr-2" />Enriquecer com API</>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Alert>
          )}

          {selectedProcesso && (
            <div className="bg-[var(--brand-primary-50)] border border-[var(--brand-primary-200)] rounded-lg p-3">
              <p className="text-sm font-semibold text-[var(--brand-primary-700)]">
                Processo Selecionado:
              </p>
              <div className="mt-2 space-y-1">
                <p className="font-mono text-sm">{selectedProcesso.numero_cnj}</p>
                {selectedProcesso.classe && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    <span className="font-medium">Classe:</span> {selectedProcesso.classe}
                  </p>
                )}
                {selectedProcesso.tribunal && (
                  <p className="text-xs text-[var(--text-secondary)]">
                    <span className="font-medium">Tribunal:</span> {selectedProcesso.tribunal}
                  </p>
                )}
              </div>
            </div>
          )}

          <div>
            <Label>Tipo de Relação</Label>
            <Select value={data.relation_type} onValueChange={v => setData({...data, relation_type: v})}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="apenso">Apenso</SelectItem>
                <SelectItem value="recurso">Recurso</SelectItem>
                <SelectItem value="incidente">Incidente</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleConfirm} disabled={!selectedProcesso}>
              Confirmar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileText, Users, Info, Link2, Database } from 'lucide-react';
import ProcessoEditBasicTab from './edit-tabs/ProcessoEditBasicTab';
import ProcessoEditPartesTab from './edit-tabs/ProcessoEditPartesTab';
import ProcessoEditDetailsTab from './edit-tabs/ProcessoEditDetailsTab';
import ProcessoEditRelacionadosTab from './edit-tabs/ProcessoEditRelacionadosTab';
import ProcessoEditEscavadorTab from './edit-tabs/ProcessoEditEscavadorTab';

export default function ProcessoEditModalEnhanced({ 
  open, 
  onClose, 
  processo, 
  onSave 
}) {
  const [activeTab, setActiveTab] = useState('basico');
  const [formData, setFormData] = useState({});
  const [partes, setPartes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (processo) {
      setFormData({
        titulo: processo.titulo || '',
        numero_cnj: processo.numero_cnj || '',
        status: processo.status || 'ativo',
        cliente_id: processo.cliente_id || '',
        tribunal: processo.tribunal || '',
        sistema: processo.sistema || '',
        instancia: processo.instancia || '',
        assunto: processo.assunto || '',
        classe: processo.classe || '',
        area: processo.area || '',
        orgao_julgador: processo.orgao_julgador || '',
        data_distribuicao: processo.data_distribuicao || '',
        valor_causa: processo.valor_causa || '',
        observacoes: processo.observacoes || '',
        polo_ativo: processo.polo_ativo || '',
        polo_passivo: processo.polo_passivo || '',
        favorito: processo.favorito || false,
        processo_pai_id: processo.processo_pai_id || '',
        relation_type: processo.relation_type || '',
        fonte_origem: processo.fonte_origem || '',
        visivel: processo.visivel !== false,
        apensos_raw: processo.apensos_raw || '',
        processos_relacionados: processo.processos_relacionados || [],
        data_ultima_movimentacao: processo.data_ultima_movimentacao || '',
        data_ultima_verificacao: processo.data_ultima_verificacao || '',
        data_inicio: processo.data_inicio || '',
        ano_inicio: processo.ano_inicio || null,
        estado_origem_nome: processo.estado_origem_nome || '',
        estado_origem_sigla: processo.estado_origem_sigla || '',
        quantidade_movimentacoes: processo.quantidade_movimentacoes || 0,
        grau_instancia: processo.grau_instancia || null,
        situacao_processo: processo.situacao_processo || '',
        fontes_tribunais_arquivadas: processo.fontes_tribunais_arquivadas || false,
        tempo_desde_ultima_verificacao: processo.tempo_desde_ultima_verificacao || '',
        log_importacao_id: processo.log_importacao_id || '',
        dados_completos_api: processo.dados_completos_api || {}
      });
      setPartes(processo.partes || []);
    }
  }, [processo]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSave({
        ...formData,
        partes
      });
      onClose();
    } catch (error) {
      console.error('Erro ao salvar:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>Editar Processo</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <div className="px-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="basico" className="gap-2">
                <FileText className="w-4 h-4" />
                Básico
              </TabsTrigger>
              <TabsTrigger value="partes" className="gap-2">
                <Users className="w-4 h-4" />
                Partes ({partes.length})
              </TabsTrigger>
              <TabsTrigger value="detalhes" className="gap-2">
                <Info className="w-4 h-4" />
                Detalhes
              </TabsTrigger>
              <TabsTrigger value="relacionados" className="gap-2">
                <Link2 className="w-4 h-4" />
                Relacionados
              </TabsTrigger>
              <TabsTrigger value="escavador" className="gap-2">
                <Database className="w-4 h-4" />
                API
              </TabsTrigger>
            </TabsList>
          </div>

          <ScrollArea className="max-h-[calc(90vh-180px)]">
            <form onSubmit={handleSubmit}>
              <TabsContent value="basico" className="px-6 mt-4">
                <ProcessoEditBasicTab 
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabsContent>

              <TabsContent value="partes" className="px-6 mt-4">
                <ProcessoEditPartesTab
                  processoId={processo?.id}
                  partes={partes}
                  setPartes={setPartes}
                  formData={formData}
                />
              </TabsContent>

              <TabsContent value="detalhes" className="px-6 mt-4">
                <ProcessoEditDetailsTab
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabsContent>

              <TabsContent value="relacionados" className="px-6 mt-4">
                <ProcessoEditRelacionadosTab
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabsContent>

              <TabsContent value="escavador" className="px-6 mt-4">
                <ProcessoEditEscavadorTab
                  formData={formData}
                  setFormData={setFormData}
                />
              </TabsContent>

              <div className="px-6 py-4 border-t border-[var(--border-primary)] bg-[var(--bg-secondary)]">
                <div className="flex justify-end gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={onClose}
                    disabled={loading}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                  </Button>
                </div>
              </div>
            </form>
          </ScrollArea>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Paperclip, Scale, RefreshCw } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { limparCNJ } from '@/components/utils/cnjUtils';
import DocumentoUploadModal from './DocumentoUploadModal';
import DocumentoViewModal from './DocumentoViewModal';
import AutosListaCompleta from './AutosListaCompleta';
import ConfirmarConsumoModal from './ConfirmarConsumoModal';

export default function ProcessoDocumentosTab({ processoId, processo }) {
  const [showUpload, setShowUpload] = useState(false);
  const [viewDoc, setViewDoc] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);

  const { data: anexos = [], isLoading: loadingAnexos, refetch: refetchAnexos } = useQuery({
    queryKey: ['documentos', processoId],
    queryFn: async () => {
      const docs = await base44.entities.DocumentoAnexado.filter({ processo_id: processoId });
      return docs.sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    }
  });

  const { data: autos = [], isLoading: loadingAutos, refetch: refetchAutos } = useQuery({
    queryKey: ['documentos-publicos', processoId],
    queryFn: () => base44.entities.DocumentoPublico.filter({ processo_id: processoId })
  });

  const handleSyncAutos = async () => {
    if (!processo?.numero_cnj) {
      toast.error('Número CNJ não disponível');
      return;
    }

    setLoadingSync(true);
    setShowConfirm(false);
    
    try {
      const statusRes = await base44.functions.invoke('statusAtualizacaoProcesso', {
        numero_cnj: limparCNJ(processo.numero_cnj)
      });

      const solicitacaoRes = await base44.functions.invoke('solicitarAtualizacaoProcesso', {
        numero_cnj: limparCNJ(processo.numero_cnj),
        autos: 1,
        enviar_callback: 'SIM'
      });

      toast.success('Sincronização iniciada. Você será notificado quando concluir.');
      
      setTimeout(async () => {
        await refetchAutos();
        setLoadingSync(false);
      }, 10000);
    } catch (error) {
      toast.error(error.message || 'Erro ao sincronizar documentos');
      setLoadingSync(false);
    }
  };

  return (
    <>
      <Tabs defaultValue="anexos" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="anexos" className="gap-2">
            <Paperclip className="w-4 h-4" />
            Anexos ({anexos.length})
          </TabsTrigger>
          <TabsTrigger value="autos" className="gap-2">
            <Scale className="w-4 h-4" />
            Autos ({autos.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="anexos" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Documentos Anexados</CardTitle>
                <button
                  onClick={() => setShowUpload(true)}
                  className="text-sm text-[var(--brand-primary)] hover:underline"
                >
                  + Adicionar
                </button>
              </div>
            </CardHeader>
            <CardContent>
              {loadingAnexos ? (
                <p className="text-sm text-[var(--text-secondary)]">Carregando...</p>
              ) : anexos.length === 0 ? (
                <p className="text-sm text-[var(--text-secondary)]">Nenhum documento anexado</p>
              ) : (
                <div className="space-y-2">
                  {anexos.map(doc => {
                    if (!doc) return null;
                    return (
                      <div
                        key={doc.id}
                        className="flex items-center justify-between p-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer"
                        onClick={() => setViewDoc(doc)}
                      >
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <FileText className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0" />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                              {doc.nome || doc.titulo || 'Sem título'}
                            </p>
                            <p className="text-xs text-[var(--text-tertiary)]">
                              {doc.created_date && new Date(doc.created_date).toLocaleDateString('pt-BR')}
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="flex-shrink-0">
                          {doc.tipo || 'Geral'}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="autos" className="space-y-3 mt-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-base">Autos do Processo</CardTitle>
                  <p className="text-xs text-[var(--text-tertiary)] mt-1">
                    Documentos públicos e restritos via API Escavador
                  </p>
                </div>
                {processo?.numero_cnj && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowConfirm(true)}
                    disabled={loadingSync}
                  >
                    <RefreshCw className={`w-4 h-4 mr-2 ${loadingSync ? 'animate-spin' : ''}`} />
                    {loadingSync ? 'Buscando...' : 'Buscar no Tribunal'}
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {processo ? (
                <AutosListaCompleta processo={processo} />
              ) : (
                <p className="text-sm text-[var(--text-secondary)]">
                  Dados do processo não disponíveis
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showUpload && (
        <DocumentoUploadModal
          open={showUpload}
          processoId={processoId}
          escritorioId={processo?.escritorio_id}
          onClose={() => setShowUpload(false)}
          onSuccess={() => refetchAnexos()}
        />
      )}

      {viewDoc && (
        <DocumentoViewModal
          documento={viewDoc}
          onClose={() => setViewDoc(null)}
        />
      )}

      <ConfirmarConsumoModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        onConfirm={handleSyncAutos}
        loading={loadingSync}
        titulo="Sincronizar Autos do Processo"
        descricao="Esta ação irá buscar documentos públicos do processo no tribunal."
        creditos={1}
      />
    </>
  );
}
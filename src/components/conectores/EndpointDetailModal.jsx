import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useEscritorio } from '@/components/hooks/useEscritorio';
import { STALE_TIMES } from '@/components/utils/queryConfig';
import AITestGenerator from '@/components/conectores/AITestGenerator';
import EndpointTesterPanel from './teste/EndpointTesterPanel';
import EndpointInfoPanel from './EndpointInfoPanel';
import TestResultsDetailPanel from './teste/TestResultsDetailPanel';
import TesteResponseViewer from './teste/TesteResponseViewer';
import TestProfileSelector from './teste/TestProfileSelector';
import TestHistoryList from './teste/TestHistoryList';
import TestProfileModal from './teste/TestProfileModal';
import QuotaMonitorCard from './quota/QuotaMonitorCard';
import ErrorBoundary from '@/components/common/ErrorBoundary';

function EndpointDetailModalContent({ endpoint, provedor, onClose, onEdit }) {
  const [tab, setTab] = useState('info');
  const [testResults, setTestResults] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [editingProfile, setEditingProfile] = useState(null);
  const [selectedProfileId, setSelectedProfileId] = useState('');
  const [currentParams, setCurrentParams] = useState({});
  const queryClient = useQueryClient();
  
  if (!endpoint) return null;

  const { data: escritorio } = useEscritorio();
  
  const { data: provedorData } = useQuery({
    queryKey: ['provedores', escritorio?.id],
    select: (data) => data?.find(p => p.id === endpoint.provedor_id),
    enabled: !provedor && !!endpoint.provedor_id && !!escritorio?.id,
    staleTime: STALE_TIMES.STATIC
  });

  const currentProvedor = provedor || provedorData;

  const { data: profiles = [] } = useQuery({
    queryKey: ['test-profiles', endpoint.id, endpoint.provedor_id],
    queryFn: async () => {
      if (!endpoint?.id) return [];
      return await base44.entities.PerfilTeste.filter({
        escritorio_id: escritorio.id,
        $or: [
          { endpoint_id: endpoint.id },
          { provedor_id: endpoint.provedor_id, endpoint_id: null }
        ]
      });
    },
    enabled: !!endpoint?.id && !!escritorio?.id,
    staleTime: STALE_TIMES.STATIC
  });

  const { data: testHistory = [] } = useQuery({
    queryKey: ['test-history', endpoint.id],
    queryFn: async () => {
      if (!endpoint?.id) return [];
      return await base44.entities.TesteEndpoint.filter({ endpoint_id: endpoint.id }, '-created_date', 20);
    },
    enabled: !!endpoint?.id,
    staleTime: STALE_TIMES.DYNAMIC
  });

  const saveSchemaMutation = useMutation({
    mutationFn: (schema) => base44.entities.EndpointAPI.update(endpoint.id, { 
      schema_resposta: schema 
    }),
    onSuccess: (updatedEndpoint) => {
      queryClient.setQueryData(['endpoints', escritorio?.id], (old = []) =>
        old.map(e => e.id === endpoint.id ? { ...e, schema_resposta: updatedEndpoint.schema_resposta } : e)
      );
      toast.success('✅ Schema salvo');
    },
    onError: (error) => {
      toast.error('❌ Erro ao salvar schema: ' + error.message);
    }
  });

  const saveProfileMutation = useMutation({
    mutationFn: (data) => {
      if (data.id) {
        return base44.entities.PerfilTeste.update(data.id, data);
      }
      return base44.entities.PerfilTeste.create({
        ...data,
        escritorio_id: escritorio.id,
        vezes_utilizado: 0
      });
    },
    onSuccess: (savedProfile) => {
      queryClient.setQueryData(['test-profiles', endpoint.id, endpoint.provedor_id], (old = []) =>
        savedProfile.id && old.some(p => p.id === savedProfile.id)
          ? old.map(p => p.id === savedProfile.id ? savedProfile : p)
          : [...old, savedProfile]
      );
      toast.success('✅ Perfil salvo');
      setEditingProfile(null);
      setShowProfileModal(false);
      if (savedProfile?.id) {
        setSelectedProfileId(savedProfile.id);
      }
    },
    onError: (error) => {
      toast.error('❌ Erro ao salvar perfil: ' + error.message);
    }
  });

  const deleteProfileMutation = useMutation({
    mutationFn: (id) => base44.entities.PerfilTeste.delete(id),
    onSuccess: (_, deletedId) => {
      queryClient.setQueryData(['test-profiles', endpoint.id, endpoint.provedor_id], (old = []) =>
        old.filter(p => p.id !== deletedId)
      );
      toast.success('✅ Perfil excluído');
      setSelectedProfileId('');
    },
    onError: (error) => {
      toast.error('❌ Erro ao excluir: ' + error.message);
    }
  });

  return (
    <Dialog open={!!endpoint} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-3xl h-[95vh] sm:h-auto sm:max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="p-4 sm:p-6 border-b shrink-0">
          <div className="flex items-start justify-between gap-3">
            <DialogTitle className="text-base sm:text-lg break-words flex-1">{endpoint.nome}</DialogTitle>
            <div className="flex gap-1 shrink-0">
              <Button 
                size="sm" 
                onClick={() => {
                  // Normalizar endpoint para edição
                  const endpointToEdit = {
                    ...endpoint,
                    parametros_obrigatorios: endpoint.parametros?.filter(p => p.obrigatorio) || [],
                    parametros_opcionais: endpoint.parametros?.filter(p => !p.obrigatorio) || []
                  };
                  onEdit(endpointToEdit);
                  onClose();
                }} 
                className="bg-[var(--brand-primary)] h-8 px-2 sm:px-3"
              >
                <Edit className="w-4 h-4 sm:mr-1" />
                <span className="hidden sm:inline">Editar</span>
              </Button>
              <Button size="sm" variant="ghost" onClick={onClose} className="h-8 px-2">
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-4 shrink-0 mx-4 sm:mx-6 mt-2 sm:mt-4">
            <TabsTrigger value="info" className="text-xs sm:text-sm">Info</TabsTrigger>
            <TabsTrigger value="teste-api" className="text-xs sm:text-sm">Testar</TabsTrigger>
            <TabsTrigger value="historico" className="text-xs sm:text-sm">Histórico</TabsTrigger>
            <TabsTrigger value="ia" className="text-xs sm:text-sm">IA</TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
            <EndpointInfoPanel endpoint={endpoint} provedor={currentProvedor} />
            {endpoint.provedor_id && escritorio?.id && (
              <QuotaMonitorCard 
                provedor_id={endpoint.provedor_id} 
                escritorio_id={escritorio.id} 
              />
            )}
          </TabsContent>

          <TabsContent value="teste-api" className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
            <TestProfileSelector
              profiles={profiles}
              selected={selectedProfileId}
              hasUnsavedParams={Object.keys(currentParams).length > 0 && !selectedProfileId}
              onSelect={(id) => {
                setSelectedProfileId(id);
                const profile = profiles.find(p => p.id === id);
                if (profile) setCurrentParams(profile.parametros || {});
              }}
              onNew={() => {
                setEditingProfile(null);
                setShowProfileModal(true);
              }}
              onEdit={(profile) => {
                setEditingProfile(profile);
                setShowProfileModal(true);
              }}
              onDelete={(profile) => {
                if (confirm('Excluir este perfil de teste?')) {
                  deleteProfileMutation.mutate(profile.id);
                }
              }}
            />
            
            <div className="grid grid-cols-1 gap-4">
              <div>
                <EndpointTesterPanel 
                  endpoint={endpoint}
                  provedor={currentProvedor}
                  params={currentParams}
                  onParamsChange={setCurrentParams}
                  onResultsObtained={setTestResults}
                />
              </div>
              <div>
                {testResults && (
                  <TestResultsDetailPanel 
                    results={testResults}
                    onSaveSchema={(schema) => saveSchemaMutation.mutate(schema)}
                  />
                )}
              </div>
            </div>
            {testResults && (
              <TesteResponseViewer 
                resultado={testResults}
                endpoint={endpoint}
                onSaveSchema={(schema) => saveSchemaMutation.mutate(schema)}
              />
            )}
          </TabsContent>

          <TabsContent value="historico" className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
            {testHistory.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-sm text-[var(--text-tertiary)]">Nenhum teste executado ainda</p>
                  <p className="text-xs text-[var(--text-tertiary)] mt-2">Execute testes na aba "Testar" para ver o histórico</p>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Histórico de Testes ({testHistory.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <TestHistoryList tests={testHistory} onSelect={setTestResults} />
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="ia" className="flex-1 overflow-y-auto px-4 sm:px-6 pb-4 sm:pb-6 space-y-4">
            <AITestGenerator endpoint={endpoint} />
          </TabsContent>
        </Tabs>

        {showProfileModal && (
          <TestProfileModal
            profile={editingProfile}
            endpoint={endpoint}
            provedor={currentProvedor}
            params={currentParams}
            onSave={(data) => saveProfileMutation.mutate(data)}
            onClose={() => {
              setShowProfileModal(false);
              setEditingProfile(null);
            }}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function EndpointDetailModal(props) {
  return (
    <ErrorBoundary>
      <EndpointDetailModalContent {...props} />
    </ErrorBoundary>
  );
}
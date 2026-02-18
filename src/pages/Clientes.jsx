import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

import { useErrorReporting } from '@/components/hooks/useErrorReporting';
import { usePerformanceTracker } from '@/components/hooks/usePerformanceTracker';
import { InstrumentedErrorBoundary } from '@/components/debug/InstrumentedErrorBoundary';
import ClienteHeader from '@/components/clientes/ClienteHeader';
import ClienteFormModal from '@/components/clientes/ClienteFormModal';
import LoadingState from '@/components/common/LoadingState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ClientesTab from '@/components/clientes/tabs/ClientesTab';
import PartesTab from '@/components/clientes/tabs/PartesTab';
import AdvogadosTab from '@/components/clientes/tabs/AdvogadosTab';
import ClientesOmniLayout from '@/components/clientes/ClientesOmniLayout';
import ClienteDetailsPanel from '@/components/clientes/ClienteDetailsPanel';
import { Users, UserCircle, Scale } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Clientes() {
  usePerformanceTracker('Clientes');
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { wrapQuery, wrapMutation } = useErrorReporting();
  const [filtro, setFiltro] = useState('todos');
  const [showForm, setShowForm] = useState(false);
  const [editingCliente, setEditingCliente] = useState(null);
  const [activeTab, setActiveTab] = useState('clientes');
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [tipoPessoa, setTipoPessoa] = useState(null);

  const { data: user } = useQuery(wrapQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me(),
    staleTime: 5 * 60 * 1000
  }, 'PAGE_LOAD', 'usuário'));

  const { data: escritorio } = useQuery(wrapQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      if (user.role === 'admin' && user.email === 'adrianohermida@gmail.com') {
        const result = await base44.entities.Escritorio.list();
        return result[0];
      }
      const result = await base44.entities.Escritorio.filter({ created_by: user.email });
      return result[0];
    },
    enabled: !!user
  }, 'ENTITIES', 'escritório'));

  const { data: clientes = [], isLoading } = useQuery(wrapQuery({
    queryKey: ['clientes', escritorio?.id],
    queryFn: () => base44.entities.Cliente.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio,
    staleTime: 2 * 60 * 1000
  }, 'ENTITIES', 'clientes'));

  const createMutation = useMutation(wrapMutation({
    mutationFn: (data) => base44.entities.Cliente.create({ ...data, escritorio_id: escritorio.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
      setShowForm(false);
      setEditingCliente(null);
      toast.success('Cliente criado com sucesso!');
    }
  }, 'ENTITIES', 'criar cliente'));

  const updateMutation = useMutation(wrapMutation({
    mutationFn: ({ id, data }) => base44.entities.Cliente.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['clientes']);
      setShowForm(false);
      setEditingCliente(null);
      toast.success('Cliente atualizado!');
    }
  }, 'ENTITIES', 'atualizar cliente'));

  const handleSubmit = (data) => {
    if (editingCliente) {
      updateMutation.mutate({ id: editingCliente.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const clientesFiltrados = clientes
    .filter(c => c.status !== 'arquivado' || filtro === 'arquivado')
    .filter(c => filtro === 'todos' || c.status === filtro);

  const handleClienteClick = (id) => {
    navigate(createPageUrl('ClienteDetalhes') + `?id=${id}`);
  };

  const handleNewCliente = (tipo = null) => {
    setEditingCliente(null);
    setTipoPessoa(tipo);
    setShowForm(true);
  };

  React.useEffect(() => {
    const params = new URLSearchParams(location.search);
    const newParam = params.get('new');
    if (newParam === 'pf' || newParam === 'pj') {
      handleNewCliente(newParam);
      window.history.replaceState({}, '', createPageUrl('Clientes'));
    }
  }, [location.search]);

  if (isLoading) return <LoadingState message="Carregando clientes..." />;

  return (
    <InstrumentedErrorBoundary category="ROUTES">
      <div className="min-h-screen bg-[var(--bg-secondary)]">

      
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="space-y-6">
          <ClienteHeader 
            totalClientes={clientesFiltrados.length}
            onNovoCliente={handleNewCliente}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 max-w-md">
              <TabsTrigger value="clientes" className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                Clientes
              </TabsTrigger>
              <TabsTrigger value="partes" className="flex items-center gap-2">
                <UserCircle className="w-4 h-4" />
                Partes
              </TabsTrigger>
              <TabsTrigger value="advogados" className="flex items-center gap-2">
                <Scale className="w-4 h-4" />
                Advogados
              </TabsTrigger>
            </TabsList>

            <TabsContent value="clientes" className="mt-6 h-[calc(100vh-300px)]">
              <ClientesOmniLayout
                clientes={clientesFiltrados}
                filtros={filtro}
                onFiltrosChange={setFiltro}
                clienteSelecionado={clienteSelecionado}
                onSelectCliente={setClienteSelecionado}
                detailsComponent={ClienteDetailsPanel}
              />
            </TabsContent>

            <TabsContent value="partes" className="mt-6">
              <PartesTab escritorioId={escritorio?.id} />
            </TabsContent>

            <TabsContent value="advogados" className="mt-6">
              <AdvogadosTab escritorioId={escritorio?.id} />
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {showForm && (
        <ClienteFormModal
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingCliente(null);
          }}
          onSubmit={handleSubmit}
          cliente={editingCliente}
          escritorioId={escritorio?.id}
          tipoPessoa={tipoPessoa}
        />
      )}
    </div>
    </InstrumentedErrorBoundary>
  );
}
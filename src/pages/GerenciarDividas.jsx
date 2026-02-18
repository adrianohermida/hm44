import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/layout/PageHeader';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, CreditCard, Building } from 'lucide-react';
import { toast } from 'sonner';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function GerenciarDividas() {
  const [selectedTab, setSelectedTab] = useState('dividas');
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
  });

  const { data: dividas = [], isLoading: loadingDividas } = useQuery({
    queryKey: ['dividas', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Divida.filter({
      escritorio_id: escritorio[0].id,
    }),
    enabled: !!escritorio?.length,
  });

  const { data: credores = [], isLoading: loadingCredores } = useQuery({
    queryKey: ['credores', escritorio?.[0]?.id],
    queryFn: () => base44.entities.Credor.filter({
      escritorio_id: escritorio[0].id,
    }),
    enabled: !!escritorio?.length,
  });

  const breadcrumbs = [
    { label: 'Home', url: createPageUrl('Home') },
    { label: 'Dívidas', url: createPageUrl('Dividas') },
    { label: 'Gerenciar Dívidas' },
  ];

  if (loadingDividas || loadingCredores) return <ResumeLoader />;

  return (
    <div className="p-4 md:p-6">
      <PageHeader
        title="Gerenciar Dívidas e Credores"
        description="Cadastre e gerencie dívidas dos clientes e credores."
        breadcrumbs={breadcrumbs}
      />

      <div className="flex gap-2 mb-6">
        <Button
          variant={selectedTab === 'dividas' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('dividas')}
          className="gap-2"
        >
          <CreditCard className="w-4 h-4" />
          Dívidas ({dividas.length})
        </Button>
        <Button
          variant={selectedTab === 'credores' ? 'default' : 'outline'}
          onClick={() => setSelectedTab('credores')}
          className="gap-2"
        >
          <Building className="w-4 h-4" />
          Credores ({credores.length})
        </Button>
      </div>

      {selectedTab === 'dividas' && (
        <div className="space-y-4">
          {dividas.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Nenhuma dívida cadastrada</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Dívida
                </Button>
              </CardContent>
            </Card>
          ) : (
            dividas.map((divida) => (
              <Card key={divida.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{divida.descricao}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Valor: R$ {divida.valor_original?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {selectedTab === 'credores' && (
        <div className="space-y-4">
          {credores.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-gray-600 mb-4">Nenhum credor cadastrado</p>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Cadastrar Credor
                </Button>
              </CardContent>
            </Card>
          ) : (
            credores.map((credor) => (
              <Card key={credor.id}>
                <CardHeader>
                  <CardTitle className="text-lg">{credor.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">
                    Tipo: {credor.tipo_credor}
                  </p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
}
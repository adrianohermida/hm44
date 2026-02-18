import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import { ArrowLeft, UserPlus, Scale } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import LoadingState from '@/components/common/LoadingState';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import BuscarNoTribunalButton from '@/components/processos/detail/BuscarNoTribunalButton';

export default function AdvogadoDetalhes() {
  const params = new URLSearchParams(window.location.search);
  const cpf = params.get('cpf');
  const nome = params.get('nome');
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    },
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000
  });

  const { data: partes = [], isLoading, error } = useQuery({
    queryKey: ['partes-advogado', cpf, escritorio?.id],
    queryFn: async () => {
      const all = await base44.entities.ProcessoParte.filter({
        escritorio_id: escritorio.id
      });
      
      return all.filter(p => 
        p.advogados?.some(adv => adv.cpf === cpf)
      );
    },
    enabled: !!cpf && !!escritorio?.id,
    retry: 1,
    retryDelay: 2000,
    staleTime: 3 * 60 * 1000,
    gcTime: 5 * 60 * 1000
  });

  // Extrair dados do advogado da primeira parte
  const advogado = partes[0]?.advogados?.find(adv => adv.cpf === cpf);
  const primeiraOAB = advogado?.oabs?.[0];

  const { data: processos = [] } = useQuery({
    queryKey: ['processos-advogado', cpf, escritorio?.id, partes.length],
    queryFn: async () => {
      const processoIds = [...new Set(partes.map(p => p.processo_id))];
      if (processoIds.length === 0) return [];
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const allProcessos = await base44.entities.Processo.filter({
        escritorio_id: escritorio.id
      });
      
      return allProcessos.filter(p => processoIds.includes(p.id));
    },
    enabled: partes.length > 0 && !!escritorio?.id,
    retry: 0,
    staleTime: 3 * 60 * 1000
  });

  const converterClienteMutation = useMutation({
    mutationFn: async () => {
      const clienteData = {
        escritorio_id: escritorio?.id,
        nome_completo: advogado.nome,
        cpf_cnpj: advogado.cpf,
        tipo_pessoa: 'fisica',
        origem: 'advogado'
      };
      
      return await base44.entities.Cliente.create(clienteData);
    },
    onSuccess: (cliente) => {
      toast.success('Convertido para cliente');
      navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`);
    }
  });

  if (isLoading) return <LoadingState message="Carregando dados..." />;
  
  if (error) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-red-500 font-medium">Erro ao carregar advogado</p>
            <p className="text-sm text-[var(--text-secondary)]">{error.message}</p>
            <Button onClick={() => navigate(createPageUrl('Pessoas'))}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  if (!advogado && partes.length === 0) {
    return (
      <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center space-y-4">
            <p className="text-[var(--text-secondary)]">Advogado não encontrado</p>
            <Button onClick={() => navigate(createPageUrl('Pessoas'))}>
              Voltar
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="border-b border-[var(--border-primary)] bg-[var(--bg-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Breadcrumb items={[
            { label: 'Pessoas', url: createPageUrl('Pessoas') },
            { label: advogado?.nome || nome || 'Detalhes' }
          ]} />
        </div>
      </div>

      <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)]">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4">
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => navigate(createPageUrl('Pessoas'))}
            className="mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Scale className="w-6 h-6 text-amber-600" />
                      <CardTitle className="text-2xl">{advogado?.nome || nome}</CardTitle>
                    </div>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      {advogado?.oabs?.map((oab, idx) => (
                        <Badge key={idx} className="bg-amber-600 text-white">
                          OAB {oab.numero}/{oab.uf}
                        </Badge>
                      ))}
                      <Badge variant="outline">Advogado</Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => converterClienteMutation.mutate()}
                    disabled={converterClienteMutation.isPending}
                    className="bg-[var(--brand-primary)]"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Converter em Cliente
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {advogado?.cpf && (
                  <div>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">CPF:</span>
                    <p className="text-base">{advogado.cpf}</p>
                  </div>
                )}
                {advogado?.tipo_pessoa && (
                  <div>
                    <span className="text-sm font-medium text-[var(--text-secondary)]">Tipo:</span>
                    <p className="text-base">{advogado.tipo_pessoa === 'fisica' ? 'Pessoa Física' : 'Pessoa Jurídica'}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Processos em que atua ({processos.length})</CardTitle>
                  {advogado?.cpf && escritorio?.id && (
                    <BuscarNoTribunalButton
                      nome={advogado.nome}
                      cpf_cnpj={advogado.cpf}
                      escritorio_id={escritorio.id}
                      compact
                    />
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {processos.length === 0 ? (
                  <p className="text-sm text-[var(--text-secondary)]">Nenhum processo encontrado</p>
                ) : (
                  <div className="space-y-2">
                    {processos.map((proc) => (
                      <div
                        key={proc.id}
                        className="p-3 border rounded-lg hover:bg-[var(--bg-secondary)] cursor-pointer"
                        onClick={() => navigate(`${createPageUrl('ProcessoDetails')}?id=${proc.id}`)}
                      >
                        <div className="font-medium">{proc.numero_cnj}</div>
                        {proc.titulo && (
                          <div className="text-sm text-[var(--text-secondary)]">{proc.titulo}</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-4 lg:self-start">
            <Card>
              <CardHeader>
                <CardTitle>Estatísticas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-[var(--text-secondary)]">Processos</span>
                    <p className="text-2xl font-bold">{processos.length}</p>
                  </div>
                  <div>
                    <span className="text-sm text-[var(--text-secondary)]">Partes representadas</span>
                    <p className="text-2xl font-bold">{partes.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
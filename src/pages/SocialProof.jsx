import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Shield } from 'lucide-react';
import ProofCard from '@/components/social/ProofCard';
import ProofStats from '@/components/social/ProofStats';
import ProofFilter from '@/components/social/ProofFilter';

export default function SocialProof() {
  const [statusFilter, setStatusFilter] = useState('all');
  const [tipoFilter, setTipoFilter] = useState('all');
  const queryClient = useQueryClient();

  const { data: proofs = [] } = useQuery({
    queryKey: ['social-proofs'],
    queryFn: () => base44.entities.SocialProof.list('-created_date'),
  });

  const approveMutation = useMutation({
    mutationFn: (id) => base44.entities.SocialProof.update(id, { status: 'aprovado', conformidade_oab: true }),
    onSuccess: () => queryClient.invalidateQueries(['social-proofs']),
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => base44.entities.SocialProof.update(id, { status: 'rejeitado' }),
    onSuccess: () => queryClient.invalidateQueries(['social-proofs']),
  });

  const filtered = proofs.filter(p => 
    (statusFilter === 'all' || p.status === statusFilter) &&
    (tipoFilter === 'all' || p.tipo === tipoFilter)
  );

  const depoimentos = proofs.filter(p => p.tipo === 'depoimento' && p.status === 'aprovado').length;
  const reconhecimentos = proofs.filter(p => p.tipo === 'reconhecimento' && p.status === 'aprovado').length;
  const publicacoes = proofs.filter(p => p.tipo === 'publicacao' && p.status === 'aprovado').length;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Social Proof (Conforme OAB)</h1>
          <Button className="bg-[var(--brand-primary)]">
            <Shield className="w-4 h-4 mr-2" />Adicionar Novo
          </Button>
        </div>

        <ProofStats depoimentos={depoimentos} reconhecimentos={reconhecimentos} publicacoes={publicacoes} />
        <ProofFilter 
          status={statusFilter} 
          tipo={tipoFilter}
          onStatusChange={setStatusFilter}
          onTipoChange={setTipoFilter}
        />

        <div className="grid md:grid-cols-2 gap-4">
          {filtered.map(proof => (
            <ProofCard
              key={proof.id}
              proof={proof}
              onApprove={approveMutation.mutate}
              onReject={rejectMutation.mutate}
              showActions
            />
          ))}
        </div>
      </div>
    </div>
  );
}
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Calendar, Plus } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import FollowUpCard from '@/components/crm/FollowUpCard';
import FollowUpFormModal from '@/components/crm/FollowUpFormModal';
import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function FollowUps() {
  const [showForm, setShowForm] = useState(false);
  const [editingFollowup, setEditingFollowup] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: followups = [] } = useQuery({
    queryKey: ['followups'],
    queryFn: async () => {
      return base44.entities.Followup.filter({
        escritorio_id: user.escritorio_id
      }, 'data_agendada');
    },
    enabled: !!user?.escritorio_id
  });

  const hoje = followups.filter(f => {
    const data = new Date(f.data_agendada);
    const today = new Date();
    return data.toDateString() === today.toDateString() && f.status === 'pendente';
  });

  const proximos = followups.filter(f => {
    const data = new Date(f.data_agendada);
    const today = new Date();
    return data > today && f.status === 'pendente';
  });

  const atrasados = followups.filter(f => {
    const data = new Date(f.data_agendada);
    const today = new Date();
    return data < today && f.status === 'pendente';
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Follow-ups' }]} />
        
        <header className="mt-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Calendar className="w-8 h-8 text-[var(--brand-primary)]" />
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">Follow-ups</h1>
            </div>
            <Button className="bg-[var(--brand-primary)]" onClick={() => setShowForm(true)}>
              <Plus className="w-4 h-4 mr-2" />Agendar Follow-up
            </Button>
          </div>
        </header>

        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <h3 className="font-semibold text-lg mb-3 text-red-600">Atrasados ({atrasados.length})</h3>
            <div className="space-y-3">
              {atrasados.map(f => (
                <FollowUpCard key={f.id} followup={f} onEdit={(f) => { setEditingFollowup(f); setShowForm(true); }} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-blue-600">Hoje ({hoje.length})</h3>
            <div className="space-y-3">
              {hoje.map(f => (
                <FollowUpCard key={f.id} followup={f} onEdit={(f) => { setEditingFollowup(f); setShowForm(true); }} />
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-3 text-gray-600">Próximos ({proximos.length})</h3>
            <div className="space-y-3">
              {proximos.slice(0, 10).map(f => (
                <FollowUpCard key={f.id} followup={f} onEdit={(f) => { setEditingFollowup(f); setShowForm(true); }} />
              ))}
            </div>
          </div>
        </div>

        <FollowUpFormModal
          followup={editingFollowup}
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingFollowup(null);
          }}
        />
      </div>
    </div>
  );
}
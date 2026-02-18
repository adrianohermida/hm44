import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, Settings, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import CampanhaForm from '@/components/campanhas/CampanhaForm';
import CampanhaStats from '@/components/campanhas/CampanhaStats';
import CampanhaCard from '@/components/campanhas/CampanhaCard';
import AssociarUsuariosModal from '@/components/campanhas/AssociarUsuariosModal';
import BanListManager from '@/components/campanhas/BanListManager';
import { toast } from 'sonner';

export default function Campanhas() {
  const [showForm, setShowForm] = useState(false);
  const [showAssociarModal, setShowAssociarModal] = useState(false);
  const [showBanList, setShowBanList] = useState(false);
  const [user, setUser] = useState(null);
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
  };

  const { data: campanhas = [] } = useQuery({
    queryKey: ['campanhas'],
    queryFn: () => base44.entities.Campanha.list('-created_date'),
  });

  const enviarMutation = useMutation({
    mutationFn: async (data) => {
      const response = await base44.functions.invoke('enviarCampanha', {
        ...data,
        escritorio_id: user?.escritorio_id || '6948bed65e7da7a1c1eb64d1',
      });
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`Campanha enviada para ${data.enviados} clientes!`);
      queryClient.invalidateQueries({ queryKey: ['campanhas'] });
      setShowForm(false);
    },
    onError: () => {
      toast.error('Erro ao enviar campanha');
    },
  });

  const associarMutation = useMutation({
    mutationFn: async () => {
      const response = await base44.functions.invoke('associarEscritorioUsuario');
      return response.data;
    },
    onSuccess: (data) => {
      toast.success(`${data.updated_count} de ${data.total_users} usuários associados!`);
      setShowAssociarModal(false);
    },
    onError: (error) => {
      toast.error('Erro ao associar usuários');
    },
  });

  const banMutation = useMutation({
    mutationFn: async ({ email, motivo }) => {
      const prefs = await base44.entities.EmailPreferencia.filter({ email });
      if (prefs.length > 0) {
        await base44.entities.EmailPreferencia.update(prefs[0].id, {
          banido: true,
          motivo_ban: motivo
        });
      } else {
        await base44.entities.EmailPreferencia.create({
          email,
          escritorio_id: user?.escritorio_id || '6948bed65e7da7a1c1eb64d1',
          banido: true,
          motivo_ban: motivo,
          aceita_marketing: false,
          aceita_newsletter: false
        });
      }
    },
    onSuccess: () => {
      toast.success('Email banido com sucesso');
    },
  });

  const stats = {
    totalClientes: 0,
    emailsEnviados: campanhas.reduce((sum, c) => sum + (c.enviados_count || 0), 0),
    campanhasCompletas: campanhas.filter(c => c.status === 'enviada').length,
    emProcesso: campanhas.filter(c => c.status === 'em_envio').length,
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Campanhas' }]} />
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Campanhas de Email</h1>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setShowAssociarModal(true)}>
              <Settings className="w-4 h-4 mr-2" />
              Associar Usuários
            </Button>
            <Button variant="outline" onClick={() => setShowBanList(!showBanList)}>
              <Settings className="w-4 h-4 mr-2" />
              Ban List
            </Button>
            <Link to={createPageUrl('TemplatesEmail')}>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Templates
              </Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)} className="bg-[var(--brand-primary)]">
              <Plus className="w-4 h-4 mr-2" />
              Nova Campanha
            </Button>
          </div>
        </div>

        <CampanhaStats stats={stats} />

        {showAssociarModal && (
          <div className="mb-6">
            <AssociarUsuariosModal
              onConfirm={() => associarMutation.mutate()}
              isLoading={associarMutation.isPending}
            />
          </div>
        )}

        {showBanList && (
          <div className="mb-6">
            <BanListManager onBan={(data) => banMutation.mutate(data)} />
          </div>
        )}

        {showForm && (
          <Card className="p-6 mb-6">
            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-4">Nova Campanha</h2>
            <CampanhaForm 
              onSubmit={(data) => enviarMutation.mutate(data)}
              isLoading={enviarMutation.isPending}
            />
          </Card>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campanhas.map(campanha => (
            <CampanhaCard key={campanha.id} campanha={campanha} />
          ))}
        </div>
      </div>
    </div>
  );
}
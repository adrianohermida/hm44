import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Plus, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ModuleHeader from '@/components/cliente/ModuleHeader';
import ConsultasHeader from '@/components/consultas/cliente/ConsultasHeader';
import ConsultasGrid from '@/components/consultas/cliente/ConsultasGrid';
import ConsultasEmpty from '@/components/consultas/cliente/ConsultasEmpty';
import RemarcarModal from '@/components/consultas/cliente/RemarcarModal';
import CancelarModal from '@/components/consultas/cliente/CancelarModal';
import PersistentCTABanner from '@/components/cliente/PersistentCTABanner';
import { useMinhasConsultas } from '@/components/hooks/useMinhasConsultas';
import ResumeLoader from '@/components/common/ResumeLoader';

export default function MinhasConsultas() {
  const navigate = useNavigate();
  const { agendamentos, loading, remarcarAgendamento, cancelarAgendamento } = useMinhasConsultas();
  const [remarcarModal, setRemarcarModal] = useState({ open: false, agendamento: null });
  const [cancelarModal, setCancelarModal] = useState({ open: false, agendamento: null });
  const [actionLoading, setActionLoading] = useState(false);

  const handleRemarcar = async (agendamento, novaData, novaHora) => {
    setActionLoading(true);
    await remarcarAgendamento(agendamento, novaData, novaHora);
    setActionLoading(false);
    setRemarcarModal({ open: false, agendamento: null });
  };

  const handleCancelar = async (agendamento, motivo) => {
    setActionLoading(true);
    await cancelarAgendamento(agendamento, motivo);
    setActionLoading(false);
    setCancelarModal({ open: false, agendamento: null });
  };

  if (loading) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <PersistentCTABanner />
      
      <ModuleHeader
        title="Minhas Consultas"
        breadcrumbItems={[
          { label: 'Painel', url: createPageUrl('MeuPainel') },
          { label: 'Consultas' }
        ]}
        icon={Calendar}
        action={
          <Button 
            onClick={() => navigate(createPageUrl('AgendarConsulta'))}
            className="bg-[var(--brand-primary)] w-full sm:w-auto"
            size="sm"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agendar
          </Button>
        }
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-32 md:pb-6">
        {agendamentos.length === 0 ? (
          <ConsultasEmpty />
        ) : (
          <ConsultasGrid
            agendamentos={agendamentos}
            onRemarcar={(a) => setRemarcarModal({ open: true, agendamento: a })}
            onCancelar={(a) => setCancelarModal({ open: true, agendamento: a })}
            loading={actionLoading}
          />
        )}
      </div>

      <RemarcarModal
        agendamento={remarcarModal.agendamento}
        open={remarcarModal.open}
        onClose={() => setRemarcarModal({ open: false, agendamento: null })}
        onSave={handleRemarcar}
        loading={actionLoading}
      />

      <CancelarModal
        agendamento={cancelarModal.agendamento}
        open={cancelarModal.open}
        onClose={() => setCancelarModal({ open: false, agendamento: null })}
        onConfirm={handleCancelar}
        loading={actionLoading}
      />
    </div>
  );
}
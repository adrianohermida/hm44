import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useCalendarSync } from '@/components/hooks/useCalendarSync';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BookingSyncButton from '@/components/calendar/BookingSyncButton';
import AutoBlockManager from '@/components/calendar/AutoBlockManager';
import TeamEventsLoader from '@/components/calendar/TeamEventsLoader';
import TeamEventConfig from '@/components/calendar/team/TeamEventConfig';
import AvailabilityPicker from '@/components/calendar/availability/AvailabilityPicker';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function GoogleCalendarConfig() {
  const [audiencias, setAudiencias] = useState([]);
  const [autoBlock, setAutoBlock] = useState(false);
  const [escritorioId, setEscritorioId] = useState(null);
  const [message, setMessage] = useState(null);
  const { syncEvent, syncing } = useCalendarSync();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const user = await base44.auth.me();
      const audienciasData = await base44.entities.Audiencia.filter(
        { status: 'agendada' },
        '-data_hora',
        50
      );
      setAudiencias(audienciasData);
      setEscritorioId(user.escritorio_id || 'default');
      setAutoBlock(user.google_auto_block_enabled || false);
    } catch (error) {
      console.error('Error loading:', error);
    }
  };

  const handleSync = async () => {
    setMessage(null);
    let syncCount = 0;

    for (const a of audiencias) {
      const result = await syncEvent(a, 'audiencia', a.escritorio_id);
      if (result.success) syncCount++;
    }

    await loadData();
    setMessage({ 
      type: syncCount > 0 ? 'success' : 'error', 
      text: syncCount > 0 ? `${syncCount} eventos sincronizados/atualizados!` : 'Erro ao sincronizar.'
    });
  };

  const handleAutoBlockToggle = async (enabled) => {
    setAutoBlock(enabled);
    await base44.auth.updateMe({ google_auto_block_enabled: enabled });
  };

  return (
    <div className="space-y-6">
      {message && (
        <Alert className={message.type === 'success' ? 'border-[var(--brand-success)] bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' ? <CheckCircle className="h-4 w-4 text-[var(--brand-success)]" aria-hidden="true" /> : <AlertCircle className="h-4 w-4 text-red-600" aria-hidden="true" />}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        <section className="space-y-3" aria-labelledby="sync-heading">
          <h3 id="sync-heading" className="font-semibold text-[var(--text-primary)]">Fase 1: Sincronização de Agendamentos</h3>
          <BookingSyncButton onSync={handleSync} syncing={syncing} count={audiencias.length} />
        </section>

        <section className="space-y-3" aria-labelledby="autoblock-heading">
          <h3 id="autoblock-heading" className="font-semibold text-[var(--text-primary)]">Fase 3: Bloqueio Automático</h3>
          <AutoBlockManager enabled={autoBlock} onToggle={handleAutoBlockToggle} escritorioId={escritorioId} />
        </section>
      </div>

      <section className="space-y-3" aria-labelledby="availability-heading">
        <h3 id="availability-heading" className="font-semibold text-[var(--text-primary)]">Fase 2: Disponibilidade Real-Time</h3>
        <p className="text-sm text-[var(--text-secondary)]">Disponível na página <Link to={createPageUrl('AgendarConsulta')} className="text-[var(--brand-primary)] hover:underline">Agendar Consulta</Link></p>
      </section>

      <section className="space-y-3" aria-labelledby="team-heading">
        <h3 id="team-heading" className="font-semibold text-[var(--text-primary)]">Fase 5: Eventos da Equipe</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <TeamEventConfig />
          <TeamEventsLoader />
        </div>
      </section>

      <div className="pt-4 border-t border-[var(--border-primary)]">
        <Button asChild variant="outline" className="w-full">
          <Link to={createPageUrl('AgendaSemanal')} aria-label="Ver agenda semanal completa">
            Fase 6: Ver Agenda Semanal Completa
            <ExternalLink className="w-4 h-4 ml-2" aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
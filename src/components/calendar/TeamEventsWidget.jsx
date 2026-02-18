import React from 'react';
import { Users, Calendar } from 'lucide-react';

export default function TeamEventsWidget({ events, loading }) {
  if (loading) {
    return (
      <div className="bg-[var(--bg-elevated)] rounded-xl p-4 border border-[var(--border-primary)]">
        <div className="flex items-center gap-2 mb-4">
          <Users className="w-5 h-5 text-[var(--brand-primary)]" />
          <h3 className="font-semibold text-[var(--text-primary)]">Eventos da Equipe</h3>
        </div>
        <p className="text-sm text-[var(--text-secondary)]">Carregando eventos...</p>
      </div>
    );
  }

  return (
    <div className="bg-[var(--bg-elevated)] rounded-xl p-4 border border-[var(--border-primary)]">
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-[var(--brand-primary)]" />
        <h3 className="font-semibold text-[var(--text-primary)]">Eventos da Equipe</h3>
        {events.length > 0 && <span className="text-xs bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-2 py-0.5 rounded-full">{events.length}</span>}
      </div>
      {events.length === 0 ? (
        <p className="text-sm text-[var(--text-secondary)]">Nenhum evento de equipe encontrado</p>
      ) : (
        <div className="space-y-2">
          {events.slice(0, 5).map((evt, i) => (
            <div key={i} className="flex items-start gap-2 p-2 hover:bg-[var(--bg-secondary)] rounded-lg transition-colors">
              <Calendar className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-[var(--text-primary)] truncate">{evt.title}</p>
                <p className="text-xs text-[var(--text-secondary)]">{evt.when} • {evt.attendees} participantes</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
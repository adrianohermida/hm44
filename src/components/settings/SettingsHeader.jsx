import React from 'react';
import { Settings } from 'lucide-react';

export default function SettingsHeader({ userName }) {
  return (
    <header className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        <Settings className="w-8 h-8 text-[var(--brand-primary)]" aria-hidden="true" />
        <h1 className="text-3xl font-bold text-[var(--text-primary)]">Configurações</h1>
      </div>
      <p className="text-[var(--text-secondary)]">
        Gerencie suas integrações e preferências, {userName}
      </p>
    </header>
  );
}
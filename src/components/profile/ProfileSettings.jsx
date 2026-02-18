import React from 'react';
import { Settings, Bell, Lock, Globe } from 'lucide-react';

export default function ProfileSettings({ settings, onUpdate }) {
  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center gap-2 mb-6">
        <Settings className="w-5 h-5 text-[var(--brand-primary)]" />
        <h3 className="text-lg font-semibold text-[var(--brand-text-primary)]">
          Configurações
        </h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-[var(--brand-text-secondary)]" />
            <span className="text-sm text-[var(--brand-text-primary)]">Notificações</span>
          </div>
          <input
            type="checkbox"
            checked={settings?.notifications || false}
            onChange={(e) => onUpdate?.('notifications', e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Lock className="w-5 h-5 text-[var(--brand-text-secondary)]" />
            <span className="text-sm text-[var(--brand-text-primary)]">Perfil Privado</span>
          </div>
          <input
            type="checkbox"
            checked={settings?.private || false}
            onChange={(e) => onUpdate?.('private', e.target.checked)}
            className="w-4 h-4"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-[var(--brand-text-secondary)]" />
            <span className="text-sm text-[var(--brand-text-primary)]">Idioma</span>
          </div>
          <select className="px-3 py-1 border rounded-lg text-sm">
            <option>Português</option>
            <option>English</option>
          </select>
        </div>
      </div>
    </div>
  );
}
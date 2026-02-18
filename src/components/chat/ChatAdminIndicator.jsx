import React from 'react';
import { Shield } from 'lucide-react';

export default function ChatAdminIndicator() {
  return (
    <div className="flex items-center gap-2 px-3 py-2 bg-[var(--brand-warning)] bg-opacity-10 border-l-4 border-[var(--brand-warning)] rounded">
      <Shield className="w-4 h-4 text-[var(--brand-warning)]" />
      <span className="text-xs font-medium text-[var(--brand-warning)]">Modo Admin</span>
    </div>
  );
}
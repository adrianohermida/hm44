import React from 'react';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Bot } from 'lucide-react';

export default function MessageAvatar({ remetente, tipo }) {
  if (tipo === 'admin' && remetente.includes('bot')) {
    return (
      <div className="w-8 h-8 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center flex-shrink-0">
        <Bot className="w-4 h-4 text-[var(--brand-primary-700)]" />
      </div>
    );
  }

  return (
    <CustomAvatar
      alt={remetente}
      fallback={remetente?.charAt(0) || 'U'}
      className="h-8 w-8 flex-shrink-0"
      fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] text-sm font-semibold"
    />
  );
}
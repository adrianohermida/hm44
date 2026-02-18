import React from 'react';
import { Bell, MessageSquare, Ticket, Clock } from 'lucide-react';

const ICONS = {
  ticket: Ticket,
  prazo: Clock,
  processo: Bell,
  sistema: Bell,
  default: MessageSquare
};

export default function NotificationToast({ tipo, titulo, mensagem }) {
  const Icon = ICONS[tipo] || ICONS.default;

  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <div className="flex-1">
        <p className="font-semibold text-sm">{titulo}</p>
        <p className="text-sm text-gray-600">{mensagem}</p>
      </div>
    </div>
  );
}
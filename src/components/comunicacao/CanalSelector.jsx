import React from 'react';
import { MessageSquare, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const canais = [
  { id: 'chat_widget', label: 'Chat', icon: MessageSquare },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'whatsapp', label: 'WhatsApp', icon: Phone }
];

export default function CanalSelector({ selected, onSelect }) {
  return (
    <div className="flex gap-2 p-2 border-t bg-gray-50">
      <span className="text-xs text-gray-600 self-center">Responder via:</span>
      {canais.map(canal => {
        const Icon = canal.icon;
        return (
          <Button
            key={canal.id}
            size="sm"
            variant={selected === canal.id ? 'default' : 'outline'}
            onClick={() => onSelect(canal.id)}
          >
            <Icon className="w-4 h-4 mr-1" />
            {canal.label}
          </Button>
        );
      })}
    </div>
  );
}
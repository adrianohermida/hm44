import React, { memo, useCallback } from 'react';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, Mail, Phone, Ticket, Inbox } from 'lucide-react';

const inboxes = [
  { id: 'todos', label: 'Todos', icon: Inbox },
  { id: 'chat_widget', label: 'Chat', icon: MessageSquare },
  { id: 'whatsapp', label: 'WhatsApp', icon: Phone },
  { id: 'email', label: 'Email', icon: Mail },
  { id: 'tickets', label: 'Tickets', icon: Ticket }
];

const UnifiedInboxNav = memo(function UnifiedInboxNav({ selected, onSelect, counts = {} }) {
  const handleSelect = useCallback((id) => {
    onSelect(id);
  }, [onSelect]);

  return (
    <nav className="space-y-1">
      {inboxes.map(inbox => {
        const Icon = inbox.icon;
        const count = counts[inbox.id] || 0;
        const isActive = selected === inbox.id;

        return (
          <button
            key={inbox.id}
            onClick={() => handleSelect(inbox.id)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg transition-colors ${
              isActive 
                ? 'bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)]' 
                : 'hover:bg-gray-100 text-gray-700'
            }`}
          >
            <div className="flex items-center gap-3">
              <Icon className="w-5 h-5" />
              <span className="font-medium">{inbox.label}</span>
            </div>
            {count > 0 && (
              <Badge className="bg-red-500 text-white">{count}</Badge>
            )}
          </button>
        );
      })}
    </nav>
  );
});

export default UnifiedInboxNav;
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar, Mail, MessageSquare } from 'lucide-react';

export default function AICapabilitiesBadge() {
  return (
    <div className="flex flex-wrap gap-1 px-3 py-2 bg-[var(--brand-primary-50)] border-b border-[var(--brand-primary-200)]">
      <Badge variant="outline" className="text-xs">
        <Calendar className="w-3 h-3 mr-1" />
        Agenda
      </Badge>
      <Badge variant="outline" className="text-xs">
        <MessageSquare className="w-3 h-3 mr-1" />
        Tickets
      </Badge>
      <Badge variant="outline" className="text-xs">
        <Mail className="w-3 h-3 mr-1" />
        E-mail
      </Badge>
    </div>
  );
}
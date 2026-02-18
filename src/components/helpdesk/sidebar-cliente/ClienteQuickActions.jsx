import React from 'react';
import { Button } from '@/components/ui/button';
import { MessageSquare, Phone, Mail, Calendar } from 'lucide-react';

export default function ClienteQuickActions({ 
  onAbrirChat, 
  onWhatsApp, 
  onLigar, 
  onEmail, 
  onAgendarConsulta,
  hasPhone 
}) {
  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={onAbrirChat}>
          <MessageSquare className="w-3 h-3 mr-1" />
          Chat
        </Button>
        <Button size="sm" variant="outline" onClick={onWhatsApp}>
          <MessageSquare className="w-3 h-3 mr-1" />
          WhatsApp
        </Button>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" onClick={onLigar} disabled={!hasPhone}>
          <Phone className="w-3 h-3 mr-1" />
          Ligar
        </Button>
        <Button size="sm" variant="outline" onClick={onEmail}>
          <Mail className="w-3 h-3 mr-1" />
          Email
        </Button>
      </div>
      
      <Button 
        size="sm" 
        className="w-full bg-[var(--brand-primary)]"
        onClick={onAgendarConsulta}
      >
        <Calendar className="w-3 h-3 mr-1" />
        Agendar Consulta
      </Button>
    </div>
  );
}
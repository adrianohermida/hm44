import React from 'react';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MessageSquare, Calendar } from 'lucide-react';

export default function ProcessoClienteItemActions({ 
  cliente, 
  onLigar, 
  onEmail, 
  onMensagem, 
  onAgendar 
}) {
  return (
    <div className="grid grid-cols-4 gap-1 mt-3">
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onLigar(cliente)} 
        className="h-8"
        disabled={!cliente.telefone && !cliente.telefones?.[0]?.numero}
      >
        <Phone className="w-3 h-3" />
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onEmail(cliente)} 
        className="h-8"
        disabled={!cliente.email}
      >
        <Mail className="w-3 h-3" />
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={() => onMensagem(cliente)} 
        className="h-8"
        disabled={!cliente.email}
      >
        <MessageSquare className="w-3 h-3" />
      </Button>
      <Button 
        size="sm" 
        variant="outline" 
        onClick={onAgendar} 
        className="h-8"
      >
        <Calendar className="w-3 h-3" />
      </Button>
    </div>
  );
}
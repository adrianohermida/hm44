import React from 'react';
import { User, Mail, Phone, MapPin } from 'lucide-react';

export default function ClienteContactInfo({ ticket, cliente, onEmail, onLigar }) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm">
        <User className="w-4 h-4 text-[var(--text-tertiary)]" />
        <span className="text-[var(--text-primary)] font-medium">
          {ticket.cliente_nome || 'Cliente'}
        </span>
      </div>
      
      <button 
        onClick={onEmail}
        className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline w-full text-left"
      >
        <Mail className="w-4 h-4" />
        <span className="truncate">{ticket.cliente_email}</span>
      </button>
      
      {cliente?.telefones?.[0]?.numero && (
        <button
          onClick={onLigar}
          className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline w-full text-left"
        >
          <Phone className="w-4 h-4" />
          <span>{cliente.telefones[0].numero}</span>
        </button>
      )}
      
      {cliente?.enderecos?.[0] && (
        <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)]">
          <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span className="text-xs">
            {cliente.enderecos[0].logradouro}, {cliente.enderecos[0].cidade} - {cliente.enderecos[0].estado}
          </span>
        </div>
      )}
    </div>
  );
}
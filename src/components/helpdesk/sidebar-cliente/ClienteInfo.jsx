import React from 'react';
import ClienteContactInfo from './ClienteContactInfo';
import ClienteQuickActions from './ClienteQuickActions';
import { toast } from 'sonner';

export default function ClienteInfo({ 
  ticket, 
  cliente,
  onAbrirChat,
  onWhatsApp,
  onLigar,
  onEmail,
  onAgendarConsulta
}) {
  const handleLigar = () => {
    const phone = cliente?.telefones?.[0]?.numero;
    if (!phone) {
      toast.error('Telefone não disponível');
      return;
    }
    onLigar();
  };

  return (
    <div className="space-y-3">
      <ClienteContactInfo
        ticket={ticket}
        cliente={cliente}
        onEmail={onEmail}
        onLigar={handleLigar}
      />
      
      <ClienteQuickActions
        onAbrirChat={onAbrirChat}
        onWhatsApp={onWhatsApp}
        onLigar={handleLigar}
        onEmail={onEmail}
        onAgendarConsulta={onAgendarConsulta}
        hasPhone={!!cliente?.telefones?.[0]?.numero}
      />
    </div>
  );
}
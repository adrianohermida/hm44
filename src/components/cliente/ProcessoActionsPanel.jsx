import React from "react";
import { Button } from "@/components/ui/button";
import { MessageSquare, Mail, Clock } from "lucide-react";

export default function ProcessoActionsPanel({ processo }) {
  const handleChat = () => {
    const event = new CustomEvent('openChatWithClient', {
      detail: { 
        processoId: processo.id,
        processoTitulo: processo.titulo 
      }
    });
    window.dispatchEvent(event);
  };

  const handleTicket = () => {
    const event = new CustomEvent('openTicketWithProcess', {
      detail: { 
        processoId: processo.id,
        processoTitulo: processo.titulo 
      }
    });
    window.dispatchEvent(event);
  };

  const handleEmail = () => {
    const subject = `Processo ${processo.numero_cnj || processo.titulo}`;
    window.location.href = `mailto:suporte@escritorio.com.br?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="flex flex-col gap-2">
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start gap-2"
        onClick={handleChat}
      >
        <MessageSquare className="w-4 h-4" />
        Chat
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start gap-2"
        onClick={handleTicket}
      >
        <Clock className="w-4 h-4" />
        Suporte
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        className="w-full justify-start gap-2"
        onClick={handleEmail}
      >
        <Mail className="w-4 h-4" />
        Email
      </Button>
    </div>
  );
}
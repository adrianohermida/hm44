import React from 'react';
import { Button } from '@/components/ui/button';
import { User, Phone, Mail, Ticket } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function MensagensHeaderActions({ thread }) {
  const handleLigar = () => {
    if (thread.clienteTelefone) {
      window.open(`tel:${thread.clienteTelefone}`);
    }
  };

  const handleEmail = () => {
    if (thread.clienteEmail) {
      window.open(`mailto:${thread.clienteEmail}`);
    }
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="outline" asChild>
        <Link to={createPageUrl('ClienteDetalhes') + `?email=${thread.clienteEmail}`}>
          <User className="w-4 h-4 mr-2" />
          Ver Cliente
        </Link>
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={handleLigar}
        disabled={!thread.clienteTelefone}
      >
        <Phone className="w-4 h-4 mr-2" />
        Ligar
      </Button>
      <Button size="sm" variant="outline" onClick={handleEmail}>
        <Mail className="w-4 h-4 mr-2" />
        Email
      </Button>
    </div>
  );
}
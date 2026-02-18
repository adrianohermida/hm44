import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MessageSquare, Calendar, Phone, Mail, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { CustomAvatar } from '@/components/ui/CustomAvatar';

export default function ProcessoClienteActionsCard({ cliente, processoId, onOpenTicket, onOpenChat }) {
  const navigate = useNavigate();

  if (!cliente) return null;

  const handleMensagem = () => {
    if (onOpenChat) {
      onOpenChat(cliente);
    } else if (onOpenTicket) {
      onOpenTicket();
    }
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-center gap-3 mb-3">
          <CustomAvatar
            src={cliente.foto_url}
            alt={cliente.nome_completo}
            fallback={cliente.nome_completo?.charAt(0)}
            className="h-10 w-10"
          />
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-sm truncate">{cliente.nome_completo}</p>
            <p className="text-xs text-[var(--text-tertiary)] truncate">{cliente.email}</p>
          </div>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}&fromProcesso=${processoId}`)}
            className="h-8 w-8 p-0"
            aria-label="Abrir detalhes do cliente"
          >
            <ExternalLink className="w-4 h-4" />
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button size="sm" variant="outline" onClick={handleMensagem} className="justify-start">
            <MessageSquare className="w-4 h-4 mr-2" />Mensagem
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="justify-start"
            onClick={() => navigate(createPageUrl('AgendarConsulta'))}
          >
            <Calendar className="w-4 h-4 mr-2" />Agendar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="justify-start"
            onClick={() => window.open(`tel:${cliente.telefone}`)}
            disabled={!cliente.telefone}
          >
            <Phone className="w-4 h-4 mr-2" />Ligar
          </Button>
          <Button 
            size="sm" 
            variant="outline" 
            className="justify-start"
            onClick={() => window.open(`mailto:${cliente.email}`)}
            disabled={!cliente.email}
          >
            <Mail className="w-4 h-4 mr-2" />Email
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
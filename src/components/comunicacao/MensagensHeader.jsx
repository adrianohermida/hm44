import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Paperclip } from 'lucide-react';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import EscalarTicketButton from './EscalarTicketButton';
import MensagensHeaderActions from './MensagensHeaderActions';
import TicketStatusQuickChange from '../tickets/TicketStatusQuickChange';

export default function MensagensHeader({ conversa, anexosCount, onToggleBag, compact }) {
  const thread = {
    clienteNome: conversa?.cliente_nome,
    clienteEmail: conversa?.cliente_email,
    clienteTelefone: conversa?.cliente_telefone
  };

  if (compact) {
    return (
      <div className="border-b bg-white p-2">
        <div className="flex items-center gap-2">
          <CustomAvatar
            fallback={conversa?.cliente_nome?.charAt(0) || 'C'}
            className="h-8 w-8 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-sm truncate">{conversa?.cliente_nome}</h2>
            <p className="text-xs text-gray-600 truncate">{conversa?.cliente_email}</p>
          </div>
          <div className="flex gap-1">
            {conversa?.categoria === 'ticket' && (
              <TicketStatusQuickChange ticket={conversa} compact />
            )}
            {anexosCount > 0 && (
              <Button variant="ghost" size="sm" onClick={onToggleBag} className="h-7 w-7 p-0">
                <Paperclip className="w-3 h-3" />
              </Button>
            )}
            <MensagensHeaderActions thread={thread} compact />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-b bg-white">
      <div className="p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <CustomAvatar
            fallback={conversa?.cliente_nome?.charAt(0) || 'C'}
            className="h-10 w-10 flex-shrink-0"
          />
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h2 className="font-semibold">{conversa?.cliente_nome}</h2>
              {conversa?.tipo === 'visitante' && (
                <Badge variant="outline" className="text-xs">Visitante</Badge>
              )}
            </div>
            <p className="text-sm text-gray-600">{conversa?.cliente_email}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <EscalarTicketButton conversa={conversa} />
          {anexosCount > 0 && (
            <Button variant="outline" size="sm" onClick={onToggleBag} className="flex items-center gap-2">
              <Paperclip className="w-4 h-4" />
              <span className="text-xs font-semibold">{anexosCount}</span>
            </Button>
          )}
        </div>
      </div>
      
      <div className="px-4 pb-3">
        <MensagensHeaderActions thread={thread} />
      </div>
    </div>
  );
}
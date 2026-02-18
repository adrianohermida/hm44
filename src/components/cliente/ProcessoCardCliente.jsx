import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Calendar, MapPin, ArrowRight, MessageSquare, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProcessoCardCliente({ processo }) {
  const statusColors = {
    ativo: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    suspenso: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
    arquivado: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };

  const handleOpenChat = (e) => {
    e.preventDefault();
    const event = new CustomEvent('openChatWithClient', {
      detail: { 
        processoId: processo.id,
        processoTitulo: processo.titulo 
      }
    });
    window.dispatchEvent(event);
  };

  const handleCall = (e) => {
    e.preventDefault();
    // Implementar lógica de chamada no futuro com WhatsApp/Telefone
    window.open(`tel:+5511999999999`);
  };

  const handleEmail = (e) => {
    e.preventDefault();
    window.location.href = `mailto:suporte@escritorio.com.br?subject=Processo ${processo.numero_cnj}`;
  };

  return (
    <Link to={`${createPageUrl('ProcessoDetails')}?id=${processo.id}`}>
      <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-all cursor-pointer group h-full flex flex-col">
        <CardHeader>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg text-[var(--text-primary)] group-hover:text-[var(--brand-primary)] transition-colors truncate">
                {processo.titulo || 'Processo sem título'}
              </CardTitle>
              <p className="text-xs text-[var(--text-secondary)] mt-1 font-mono truncate">
                {processo.numero_cnj || 'Sem número CNJ'}
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-[var(--text-secondary)] group-hover:text-[var(--brand-primary)] transition-colors flex-shrink-0" />
          </div>
        </CardHeader>
        
        <CardContent className="space-y-3 flex-1 flex flex-col">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge className={statusColors[processo.status] || statusColors.ativo}>
              {processo.status || 'ativo'}
            </Badge>
            {processo.area && (
              <Badge variant="outline" className="text-xs">
                {processo.area}
              </Badge>
            )}
          </div>

          <div className="space-y-2 text-sm flex-1">
            {processo.tribunal && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <MapPin className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{processo.tribunal}</span>
              </div>
            )}
            {processo.data_distribuicao && (
              <div className="flex items-center gap-2 text-[var(--text-secondary)]">
                <Calendar className="w-4 h-4 flex-shrink-0" />
                <span>{new Date(processo.data_distribuicao).toLocaleDateString('pt-BR')}</span>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-3 border-t border-[var(--border-primary)]" onClick={(e) => e.preventDefault()}>
            <Button 
              size="sm" 
              variant="ghost" 
              className="flex-1 text-xs h-8"
              onClick={handleOpenChat}
              title="Enviar mensagem sobre este processo"
            >
              <MessageSquare className="w-3 h-3 mr-1" />
              Chat
            </Button>
            <Button 
              size="sm" 
              variant="ghost" 
              className="flex-1 text-xs h-8"
              onClick={(e) => {
                e.preventDefault();
                const event = new CustomEvent('openTicketModal', {
                  detail: { 
                    processoId: processo.id,
                    processoTitulo: processo.titulo 
                  }
                });
                window.dispatchEvent(event);
              }}
              title="Abrir suporte"
            >
              <Mail className="w-3 h-3 mr-1" />
              Suporte
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
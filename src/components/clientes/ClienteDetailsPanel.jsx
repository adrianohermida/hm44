import React from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, Mail, MapPin, FileText, MessageSquare, Calendar } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

export default function ClienteDetailsPanel({ cliente }) {
  const navigate = useNavigate();

  if (!cliente) return null;

  return (
    <ScrollArea className="h-full">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-xl font-bold text-[var(--text-primary)]">{cliente.nome_completo}</h2>
          <p className="text-sm text-[var(--text-secondary)] mt-1">{cliente.tipo_pessoa === 'pj' ? 'Pessoa Jurídica' : 'Pessoa Física'}</p>
          <div className="flex gap-2 mt-3">
            <Badge variant={cliente.status === 'ativo' ? 'default' : 'secondary'}>
              {cliente.status}
            </Badge>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => window.open(`tel:${cliente.telefone_principal}`)}
            disabled={!cliente.telefone_principal}
          >
            <Phone className="w-4 h-4 mr-1" />
            Ligar
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(createPageUrl('EnviarEmail') + `?to=${cliente.email}`)}
            disabled={!cliente.email}
          >
            <Mail className="w-4 h-4 mr-1" />
            Email
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(createPageUrl('EnviarTicket') + `?cliente=${cliente.id}`)}
          >
            <MessageSquare className="w-4 h-4 mr-1" />
            Ticket
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => navigate(createPageUrl('AgendarConsulta') + `?cliente=${cliente.id}`)}
          >
            <Calendar className="w-4 h-4 mr-1" />
            Agendar
          </Button>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-[var(--text-primary)]">Informações de Contato</h3>
          
          {cliente.email && (
            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Email</p>
                <p className="text-sm text-[var(--text-primary)]">{cliente.email}</p>
              </div>
            </div>
          )}

          {cliente.telefone_principal && (
            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Telefone</p>
                <p className="text-sm text-[var(--text-primary)]">{cliente.telefone_principal}</p>
              </div>
            </div>
          )}

          {cliente.endereco_completo && (
            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">Endereço</p>
                <p className="text-sm text-[var(--text-primary)]">{cliente.endereco_completo}</p>
              </div>
            </div>
          )}

          {cliente.cpf_cnpj && (
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-[var(--text-tertiary)] mt-0.5" />
              <div>
                <p className="text-xs text-[var(--text-tertiary)]">{cliente.tipo_pessoa === 'pj' ? 'CNPJ' : 'CPF'}</p>
                <p className="text-sm text-[var(--text-primary)]">{cliente.cpf_cnpj}</p>
              </div>
            </div>
          )}
        </div>

        {/* Ver Completo */}
        <Button 
          className="w-full" 
          variant="outline"
          onClick={() => navigate(createPageUrl('ClienteDetalhes') + `?id=${cliente.id}`)}
        >
          Ver Perfil Completo
        </Button>
      </div>
    </ScrollArea>
  );
}
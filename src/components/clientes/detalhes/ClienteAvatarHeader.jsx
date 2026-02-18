import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Instagram, MessageCircle, Mail, Phone, MessageSquare, MoreVertical } from 'lucide-react';
import { SiWhatsapp, SiInstagram } from 'react-icons/si';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ClienteAvatarHeader({ cliente, onNovoProcesso, onOpenChat }) {
  const statusColor = {
    ativo: 'bg-green-100 text-green-800 border-green-200',
    inativo: 'bg-gray-100 text-gray-800 border-gray-200',
    potencial: 'bg-blue-100 text-blue-800 border-blue-200',
    arquivado: 'bg-red-100 text-red-800 border-red-200'
  }[cliente?.status || 'ativo'];

  const getTelefone = () => {
    if (typeof cliente?.telefone === 'string') return cliente.telefone;
    if (typeof cliente?.telefone === 'object' && cliente?.telefone?.telefone) return cliente.telefone.telefone;
    if (cliente?.telefones_adicionais?.[0]?.telefone) return cliente.telefones_adicionais[0].telefone;
    return null;
  };

  const getEmail = () => {
    if (typeof cliente?.email === 'string') return cliente.email;
    if (typeof cliente?.email === 'object' && cliente?.email?.email) return cliente.email.email;
    if (cliente?.emails_adicionais?.[0]?.email) return cliente.emails_adicionais[0].email;
    return null;
  };

  const telefone = getTelefone();
  const email = getEmail();

  const handleInstagram = () => {
    if (cliente?.instagram) {
      window.open(`https://instagram.com/${cliente.instagram.replace('@', '')}`, '_blank');
    }
  };

  const handleWhatsApp = () => {
    if (telefone) {
      const cleaned = telefone.replace(/\D/g, '');
      window.open(`https://wa.me/55${cleaned}`, '_blank');
    }
  };

  const handleEmail = () => {
    if (email) {
      window.open(`mailto:${email}`, '_blank');
    }
  };

  const handlePhone = () => {
    if (telefone) {
      window.open(`tel:${telefone}`, '_blank');
    }
  };

  const handleTicket = () => {
    if (onOpenChat) {
      onOpenChat(cliente);
    }
  };

  return (
    <Card className="border-[var(--border-primary)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <CustomAvatar
            src={cliente?.foto_url}
            alt={cliente?.nome_completo}
            fallback={cliente?.nome_completo?.charAt(0) || 'C'}
            className="h-16 w-16 text-2xl"
            fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-bold"
          />
          
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-xl font-bold text-[var(--text-primary)]">
                {cliente?.nome_completo}
              </h2>
              <Badge className={statusColor}>
                {(cliente?.status || 'ativo').charAt(0).toUpperCase() + (cliente?.status || 'ativo').slice(1)}
              </Badge>
            </div>
            
            <div className="flex items-center gap-3 mt-2 text-sm text-[var(--text-secondary)]">
              {telefone && (
                <div className="flex items-center gap-1">
                  <Phone className="w-3 h-3" />
                  <span>{telefone}</span>
                </div>
              )}
              {email && (
                <div className="flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  <span>{email}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 mt-3">
              {cliente?.instagram && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleInstagram}
                  className="h-8 w-8"
                  title="Instagram"
                >
                  <SiInstagram className="h-4 w-4" />
                </Button>
              )}
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleWhatsApp}
                disabled={!telefone}
                className="h-8 w-8"
                title="WhatsApp"
              >
                <SiWhatsapp className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleEmail}
                disabled={!email}
                className="h-8 w-8"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handlePhone}
                disabled={!telefone}
                className="h-8 w-8"
                title="Ligar"
              >
                <Phone className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="icon"
                onClick={handleTicket}
                className="h-8 w-8"
                title="Mensagem"
              >
                <MessageCircle className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleTicket}>
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Abrir Ticket
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <Button 
            onClick={onNovoProcesso}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          >
            + Novo Processo
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
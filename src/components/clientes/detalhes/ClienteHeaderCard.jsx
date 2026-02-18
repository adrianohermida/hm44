import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Instagram, MessageCircle, Mail, Phone, MoreVertical, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function ClienteHeaderCard({ cliente, onNovoProntuario }) {
  const handleContactAction = (type, value) => {
    if (!value) return;
    
    switch(type) {
      case 'instagram':
        window.open(`https://instagram.com/${value}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/${value.replace(/\D/g, '')}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${value}`);
        break;
      case 'phone':
        window.open(`tel:${value}`);
        break;
    }
  };

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <CustomAvatar
              alt={cliente.nome_completo}
              fallback={cliente.nome_completo?.charAt(0) || 'C'}
              className="h-16 w-16 text-2xl"
              fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-bold"
            />
            
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <h1 className="text-xl font-bold text-[var(--text-primary)]">
                  {cliente.nome_completo}
                </h1>
                <Badge className="bg-green-100 text-green-700">
                  {cliente.status || 'ativo'}
                </Badge>
              </div>
              
              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleContactAction('instagram', cliente.instagram)}
                  disabled={!cliente.instagram}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Instagram"
                >
                  <Instagram className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleContactAction('whatsapp', cliente.telefone)}
                  disabled={!cliente.telefone}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="WhatsApp"
                >
                  <MessageCircle className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleContactAction('email', cliente.email)}
                  disabled={!cliente.email}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Email"
                >
                  <Mail className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleContactAction('phone', cliente.telefone)}
                  disabled={!cliente.telefone}
                  className="text-[var(--brand-primary)] hover:text-[var(--brand-primary-700)] disabled:opacity-30 disabled:cursor-not-allowed"
                  aria-label="Telefone"
                >
                  <Phone className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <Button
            onClick={onNovoProntuario}
            className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] w-full md:w-auto"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Prontuário
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
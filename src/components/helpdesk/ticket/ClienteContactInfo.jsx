import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Copy, Edit, ExternalLink, Mail, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ClienteContactInfo({ ticket }) {
  const navigate = useNavigate();

  const { data: cliente } = useQuery({
    queryKey: ['cliente-sidebar', ticket?.cliente_id],
    queryFn: async () => {
      if (ticket?.cliente_vinculado_id) {
        const [c] = await base44.entities.Cliente.filter({ id: ticket.cliente_vinculado_id });
        return c;
      }
      if (ticket?.cliente_id) {
        const [c] = await base44.entities.Cliente.filter({ id: ticket.cliente_id });
        return c;
      }
      return null;
    },
    enabled: !!(ticket?.cliente_id || ticket?.cliente_vinculado_id)
  });

  const nomeCliente = cliente?.nome_completo || cliente?.razao_social || ticket?.cliente_nome;
  const emailCliente = cliente?.email_principal || ticket?.cliente_email;
  const telefoneCliente = cliente?.telefones?.[0]?.numero || cliente?.telefone_principal;

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copiado!');
  };

  const getInitials = (nome) => {
    if (!nome) return '?';
    return nome.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase();
  };

  return (
    <ScrollArea className="h-full">
      <div className="p-4 space-y-4">
        {/* Header com Avatar e Nome */}
        <div className="flex items-center gap-3 pb-3 border-b">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <span className="text-lg font-semibold text-blue-600">
              {getInitials(nomeCliente)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base truncate">
              {nomeCliente}
            </h3>
            {cliente?.cargo && (
              <p className="text-xs text-gray-500">{cliente.cargo}</p>
            )}
          </div>
          {cliente?.id && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`)}
              className="flex-shrink-0"
            >
              <Edit className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* E-mail */}
        <div>
          <div className="text-xs text-gray-500 mb-1">E-mail</div>
          <div className="flex items-center gap-2">
            <a 
              href={`mailto:${emailCliente}`}
              className="text-sm text-blue-600 hover:underline flex-1 truncate"
            >
              {emailCliente}
            </a>
            <button
              onClick={() => copyToClipboard(emailCliente)}
              className="text-gray-400 hover:text-gray-600"
            >
              <Copy className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Telefone */}
        {telefoneCliente && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Celular</div>
            <div className="flex items-center gap-2">
              <a 
                href={`tel:${telefoneCliente}`}
                className="text-sm flex-1"
              >
                {telefoneCliente}
              </a>
              <button
                onClick={() => copyToClipboard(telefoneCliente)}
                className="text-gray-400 hover:text-gray-600"
              >
                <Copy className="w-3 h-3" />
              </button>
            </div>
          </div>
        )}

        {/* Endereço */}
        {cliente?.enderecos?.[0] && (
          <div>
            <div className="text-xs text-gray-500 mb-1">Endereço</div>
            <p className="text-sm text-gray-700">
              {cliente.enderecos[0].logradouro}, {cliente.enderecos[0].numero}
              <br />
              {cliente.enderecos[0].bairro} - {cliente.enderecos[0].cidade} - {cliente.enderecos[0].estado}
              <br />
              {cliente.enderecos[0].cep}
            </p>
          </div>
        )}

        {/* Link para mais informações */}
        {cliente?.id && (
          <Button 
            variant="link"
            onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`)}
            className="p-0 h-auto text-xs gap-1"
          >
            <ExternalLink className="w-3 h-3" />
            Exibir mais informações
          </Button>
        )}
      </div>
    </ScrollArea>
  );
}
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card } from '@/components/ui/card';
import { Mail, Phone, User, Building, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function EmailDetailsCard({ email }) {
  const navigate = useNavigate();

  const { data: cliente } = useQuery({
    queryKey: ['cliente-by-email', email],
    queryFn: async () => {
      const clientes = await base44.entities.Cliente.filter({ 
        email_principal: email 
      });
      return clientes[0] || null;
    },
    enabled: !!email
  });

  const { data: parte } = useQuery({
    queryKey: ['parte-by-email', email],
    queryFn: async () => {
      const partes = await base44.entities.ProcessoParte.filter({ 
        email: email 
      });
      return partes[0] || null;
    },
    enabled: !!email && !cliente
  });

  const { data: tribunal } = useQuery({
    queryKey: ['tribunal-by-email', email],
    queryFn: async () => {
      const juizos = await base44.entities.JuizoCNJ.filter({ 
        email: email 
      });
      if (juizos.length > 0) return { tipo: 'juizo', ...juizos[0] };

      const serventias = await base44.entities.ServentiaCNJ.filter({ 
        email: email 
      });
      if (serventias.length > 0) return { tipo: 'serventia', ...serventias[0] };

      return null;
    },
    enabled: !!email && !cliente && !parte
  });

  const contato = cliente || parte || tribunal;

  if (!contato) return null;

  return (
    <Card className="p-4 bg-blue-50 border-blue-200">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {cliente && <User className="w-4 h-4 text-blue-600" />}
          {parte && <User className="w-4 h-4 text-purple-600" />}
          {tribunal && <Building className="w-4 h-4 text-gray-600" />}
          <span className="font-semibold text-sm">
            {cliente?.nome_completo || cliente?.razao_social || 
             parte?.nome || 
             tribunal?.nome || 'Contato'}
          </span>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            if (cliente) navigate(`${createPageUrl('ClienteDetalhes')}?id=${cliente.id}`);
            else if (parte) navigate(`${createPageUrl('ParteDetalhes')}?id=${parte.id}`);
          }}
          className="h-7 text-xs"
        >
          <ExternalLink className="w-3 h-3 mr-1" />
          Detalhes
        </Button>
      </div>

      <div className="space-y-2 text-xs">
        {email && (
          <div className="flex items-center gap-2">
            <Mail className="w-3 h-3 text-gray-500" />
            <a href={`mailto:${email}`} className="text-blue-600 hover:underline">
              {email}
            </a>
          </div>
        )}
        
        {(cliente?.telefone_principal || parte?.telefone || tribunal?.telefone) && (
          <div className="flex items-center gap-2">
            <Phone className="w-3 h-3 text-gray-500" />
            <a 
              href={`tel:${cliente?.telefone_principal || parte?.telefone || tribunal?.telefone}`}
              className="text-blue-600 hover:underline"
            >
              {cliente?.telefone_principal || parte?.telefone || tribunal?.telefone}
            </a>
          </div>
        )}

        {cliente?.cpf && (
          <div className="text-gray-600">CPF: {cliente.cpf}</div>
        )}
        {cliente?.cnpj && (
          <div className="text-gray-600">CNPJ: {cliente.cnpj}</div>
        )}
        {tribunal && (
          <div className="text-gray-600 mt-2">
            Tipo: {tribunal.tipo === 'juizo' ? 'Juízo' : 'Serventia'}
          </div>
        )}
      </div>
    </Card>
  );
}
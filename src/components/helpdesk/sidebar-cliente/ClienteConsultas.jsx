import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import ConsultaItemButton from './ConsultaItemButton';

export default function ClienteConsultas({ consultas = [] }) {
  const navigate = useNavigate();

  const handleConsultaClick = (consulta) => {
    toast.info('Abrindo consulta...');
    navigate(`${createPageUrl('GerenciarConsultas')}?id=${consulta.id}`);
  };

  if (consultas.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Próximas Consultas</CardTitle>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => navigate(createPageUrl('GerenciarConsultas'))}
          >
            <ExternalLink className="w-3 h-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {consultas.map(consulta => (
          <ConsultaItemButton
            key={consulta.id}
            consulta={consulta}
            onClick={() => handleConsultaClick(consulta)}
          />
        ))}
      </CardContent>
    </Card>
  );
}
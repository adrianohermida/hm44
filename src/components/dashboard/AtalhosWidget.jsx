import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, FileText, Calendar, MessageSquare } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AtalhosWidget() {
  const atalhos = [
    { label: 'Novo Cliente', url: createPageUrl('Clientes'), icon: Users },
    { label: 'Novo Processo', url: createPageUrl('Processos'), icon: FileText },
    { label: 'Agendar Consulta', url: createPageUrl('GerenciarConsultas'), icon: Calendar },
    { label: 'Comunicação', url: createPageUrl('Comunicacao'), icon: MessageSquare },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Ações Rápidas</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-3">
          {atalhos.map((atalho) => (
            <Link key={atalho.label} to={atalho.url}>
              <Button variant="outline" className="w-full justify-start gap-2">
                <atalho.icon className="w-4 h-4" />
                {atalho.label}
              </Button>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
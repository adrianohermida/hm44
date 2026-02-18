import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, FileText, CheckCircle, TrendingUp } from 'lucide-react';

export default function BibliotecaStats() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: feriados = [] } = useQuery({
    queryKey: ['feriados-stats'],
    queryFn: () => base44.entities.Feriado.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const { data: regras = [] } = useQuery({
    queryKey: ['regras-stats'],
    queryFn: () => base44.entities.RegraPrazo.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio
  });

  const totalAplicacoes = regras.reduce((sum, r) => sum + (r.vezes_aplicada || 0), 0);

  const stats = [
    { label: 'Feriados', value: feriados.length, icon: Calendar, color: 'text-blue-600' },
    { label: 'Regras', value: regras.length, icon: FileText, color: 'text-green-600' },
    { label: 'Ativas', value: regras.filter(r => r.ativa).length, icon: CheckCircle, color: 'text-emerald-600' },
    { label: 'Aplicações', value: totalAplicacoes, icon: TrendingUp, color: 'text-purple-600' }
  ];

  return (
    <div className="grid grid-cols-4 gap-4">
      {stats.map((stat, idx) => (
        <Card key={idx}>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-600">{stat.label}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              <stat.icon className={`w-5 h-5 ${stat.color}`} />
              <span className="text-2xl font-bold">{stat.value}</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
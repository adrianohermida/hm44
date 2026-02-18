import React from 'react';
import { Card } from '@/components/ui/card';
import { Users, Mail, CheckCircle, Clock } from 'lucide-react';

export default function CampanhaStats({ stats }) {
  const items = [
    { label: 'Total Clientes', value: stats.totalClientes, icon: Users, color: 'text-blue-600' },
    { label: 'Emails Enviados', value: stats.emailsEnviados, icon: Mail, color: 'text-[var(--brand-primary)]' },
    { label: 'Campanhas Completas', value: stats.campanhasCompletas, icon: CheckCircle, color: 'text-green-600' },
    { label: 'Em Processo', value: stats.emProcesso, icon: Clock, color: 'text-yellow-600' },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {items.map((item, i) => (
        <Card key={i} className="p-4">
          <div className="flex items-center gap-3">
            <item.icon className={`w-8 h-8 ${item.color}`} />
            <div>
              <p className="text-2xl font-bold text-[var(--text-primary)]">{item.value}</p>
              <p className="text-xs text-[var(--text-secondary)]">{item.label}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
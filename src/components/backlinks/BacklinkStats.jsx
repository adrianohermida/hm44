import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink, BarChart3, Eye, TrendingUp } from "lucide-react";

export default function BacklinkStats({ portais }) {
  const totalBacklinks = portais.reduce((acc, p) => acc + (p.total_backlinks || 0), 0);
  const portaisAtivos = portais.filter(p => p.ativo).length;
  const portaisHome = portais.filter(p => p.exibir_home && p.ativo).length;
  const avgDA = portais.filter(p => p.domain_authority).length > 0
    ? Math.round(portais.reduce((acc, p) => acc + (p.domain_authority || 0), 0) / portais.filter(p => p.domain_authority).length)
    : 0;

  const stats = [
    { icon: ExternalLink, label: 'Total Portais', value: portais.length, color: 'text-blue-600' },
    { icon: Eye, label: 'Ativos', value: portaisAtivos, color: 'text-green-600' },
    { icon: TrendingUp, label: 'Total Backlinks', value: totalBacklinks, color: 'text-purple-600' },
    { icon: BarChart3, label: 'DA Médio', value: avgDA || '-', color: 'text-orange-600' }
  ];

  return (
    <div className="grid md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat, idx) => (
        <Card key={idx} className="bg-white border-[var(--border-primary)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)] mb-1">
                  {stat.label}
                </p>
                <p className="text-2xl font-bold text-[var(--text-primary)]">
                  {stat.value}
                </p>
              </div>
              <stat.icon className={`w-8 h-8 ${stat.color}`} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
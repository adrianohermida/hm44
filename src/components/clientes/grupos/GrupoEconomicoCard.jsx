import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2 } from 'lucide-react';

export default function GrupoEconomicoCard({ grupo, empresas, onClick }) {
  const totalEmpresas = grupo.empresas_ids?.length || 0;

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-shadow border-[var(--border-primary)]" onClick={onClick}>
      <CardHeader>
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5 text-[var(--brand-primary-700)]" />
          </div>
          <div className="flex-1 min-w-0">
            <CardTitle className="text-[var(--text-primary)] truncate">{grupo.nome}</CardTitle>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline">{totalEmpresas} {totalEmpresas === 1 ? 'empresa' : 'empresas'}</Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      {grupo.descricao && (
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)] line-clamp-2">{grupo.descricao}</p>
        </CardContent>
      )}
    </Card>
  );
}
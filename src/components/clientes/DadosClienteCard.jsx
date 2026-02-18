import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { User, Mail, Phone, MapPin, Briefcase, Calendar } from 'lucide-react';
import ClienteStatusBadge from './ClienteStatusBadge';

export default function DadosClienteCard({ cliente }) {
  return (
    <Card className="border-[var(--border-primary)]">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)]">Dados Pessoais</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-[var(--text-secondary)]">Status</span>
          <ClienteStatusBadge status={cliente.status} />
        </div>
        {cliente.cpf && (
          <div className="flex items-center justify-between">
            <span className="text-sm text-[var(--text-secondary)]">CPF</span>
            <span className="text-sm font-medium text-[var(--text-primary)]">{cliente.cpf}</span>
          </div>
        )}
        {cliente.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-primary)]">{cliente.email}</span>
          </div>
        )}
        {cliente.telefone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-primary)]">{cliente.telefone}</span>
          </div>
        )}
        {cliente.profissao && (
          <div className="flex items-center gap-2">
            <Briefcase className="w-4 h-4 text-[var(--text-tertiary)]" />
            <span className="text-sm text-[var(--text-primary)]">{cliente.profissao}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle, XCircle } from 'lucide-react';
import moment from 'moment';

export default function HealthHistoryTable({ historico }) {
  if (!historico || historico.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[var(--text-tertiary)]">
        Nenhum histórico de testes disponível
      </div>
    );
  }

  const getStatusIcon = (saude) => {
    switch (saude) {
      case 'Saudável': return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'Degradado': return <AlertCircle className="w-4 h-4 text-yellow-600" />;
      case 'Indisponível': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return null;
    }
  };

  const getStatusBadge = (saude) => {
    const variants = {
      'Saudável': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      'Degradado': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      'Indisponível': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return (
      <Badge variant="outline" className={variants[saude]}>
        {saude}
      </Badge>
    );
  };

  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Status</TableHead>
            <TableHead>Latência</TableHead>
            <TableHead>HTTP</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Data</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {historico.map((teste) => (
            <TableRow key={teste.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusIcon(teste.saude)}
                  {getStatusBadge(teste.saude)}
                </div>
              </TableCell>
              <TableCell>
                <span className={teste.latencia_ms > 2000 ? 'text-red-600' : 'text-[var(--text-secondary)]'}>
                  {teste.latencia_ms}ms
                </span>
              </TableCell>
              <TableCell>
                {teste.http_status > 0 ? (
                  <Badge variant="outline">{teste.http_status}</Badge>
                ) : (
                  <span className="text-xs text-[var(--text-tertiary)]">N/A</span>
                )}
              </TableCell>
              <TableCell>
                <Badge variant={teste.tipo_teste === 'manual' ? 'default' : 'secondary'}>
                  {teste.tipo_teste}
                </Badge>
              </TableCell>
              <TableCell className="text-xs text-[var(--text-tertiary)]">
                {moment(teste.created_date).format('DD/MM/YY HH:mm')}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export default function ImportPreviewTable({ dados, mapeamento, validacao }) {
  if (!dados || dados.length === 0 || !mapeamento) return null;

  const preview = dados.slice(0, 5);
  const campos = Object.values(mapeamento || {}).filter((v, i, arr) => arr.indexOf(v) === i && v !== '__ignorar__').slice(0, 6);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Pré-visualização (5 primeiras linhas)</h3>
        <Badge variant="outline">{dados.length} total</Badge>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">#</TableHead>
              {campos.map(campo => (
                <TableHead key={campo}>{campo}</TableHead>
              ))}
              <TableHead className="w-16">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.map((row, idx) => {
              const erro = validacao?.erros?.find(e => e.linha === row._linha);
              return (
                <TableRow key={idx}>
                  <TableCell>{row._linha}</TableCell>
                  {campos.map(campo => (
                    <TableCell key={campo} className="max-w-[150px] truncate">
                      {row[campo] || '-'}
                    </TableCell>
                  ))}
                  <TableCell>
                    {erro ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
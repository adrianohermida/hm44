import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

export default function PreviewTable({ preview, headers }) {
  if (!preview || preview.length === 0) return null;

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="max-h-60 overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              {headers.map(h => (
                <TableHead key={h} className="bg-[var(--bg-tertiary)]">{h}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {preview.map((row, idx) => (
              <TableRow key={idx}>
                {headers.map(h => (
                  <TableCell key={h} className="text-xs">{row[h] || '-'}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <div className="bg-[var(--bg-secondary)] px-4 py-2 text-xs text-[var(--text-secondary)]">
        Prévia: {preview.length} registros
      </div>
    </div>
  );
}
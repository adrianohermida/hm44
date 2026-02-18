import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import PrecoEditableRow from './PrecoEditableRow';
import { Badge } from '@/components/ui/badge';

export default function TabelaPrecificacao({ precos, onUpdate }) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--bg-secondary)]">
              <tr>
                <th className="p-3 text-left">Título</th>
                <th className="p-3 text-left">Categoria</th>
                <th className="p-3 text-right">Custo Base</th>
                <th className="p-3 text-right">Quota Diária</th>
                <th className="p-3 text-right">Custo Quota</th>
                <th className="p-3 text-right">Margem %</th>
                <th className="p-3 text-right">Preço Venda</th>
                <th className="p-3 text-center">Modelo</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {precos.map(p => (
                <PrecoEditableRow key={p.id} preco={p} onSave={onUpdate} />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText } from 'lucide-react';

export default function FaturaDetail({ fatura }) {
  if (!fatura) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center text-[var(--text-secondary)]">
          <FileText className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>Selecione uma fatura para ver detalhes</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6 bg-[var(--bg-primary)]">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-[var(--text-primary)]">{fatura.cliente_nome}</h2>
            <p className="text-[var(--text-secondary)]">{fatura.cliente_email}</p>
          </div>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Baixar
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mt-6">
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Processo</p>
            <p className="font-semibold text-[var(--text-primary)]">{fatura.processo_numero}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Tipo</p>
            <p className="font-semibold text-[var(--text-primary)]">{fatura.tipo_cobranca}</p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Valor Total</p>
            <p className="text-xl font-bold text-[var(--brand-primary)]">
              R$ {(fatura.valor_total || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
            </p>
          </div>
          <div>
            <p className="text-sm text-[var(--text-secondary)]">Status</p>
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
              fatura.status === 'pago' ? 'bg-[var(--brand-success)] text-white' :
              fatura.status === 'pendente' ? 'bg-[var(--brand-warning)] text-white' :
              'bg-[var(--brand-error)] text-white'
            }`}>
              {fatura.status}
            </span>
          </div>
        </div>
      </Card>
    </div>
  );
}
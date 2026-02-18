import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

export default function VariaveisDisponiveis() {
  const variaveis = [
    { grupo: 'Cliente', itens: [
      { var: '{{cliente.nome}}', desc: 'Nome completo do cliente' },
      { var: '{{cliente.email}}', desc: 'Email do cliente' },
      { var: '{{cliente.telefone}}', desc: 'Telefone principal' }
    ]},
    { grupo: 'Ticket', itens: [
      { var: '{{ticket.numero}}', desc: 'Número do ticket' },
      { var: '{{ticket.titulo}}', desc: 'Título do ticket' },
      { var: '{{ticket.status}}', desc: 'Status atual' },
      { var: '{{ticket.prioridade}}', desc: 'Prioridade' },
      { var: '{{ticket.categoria}}', desc: 'Categoria' },
      { var: '{{ticket.ultima_mensagem}}', desc: 'Última mensagem (100 chars)' }
    ]},
    { grupo: 'Agente', itens: [
      { var: '{{agente.nome}}', desc: 'Seu nome' },
      { var: '{{agente.email}}', desc: 'Seu email' },
      { var: '{{agente.cargo}}', desc: 'Seu cargo' }
    ]},
    { grupo: 'Escritório', itens: [
      { var: '{{escritorio.nome}}', desc: 'Nome do escritório' },
      { var: '{{escritorio.email}}', desc: 'Email do escritório' },
      { var: '{{escritorio.telefone}}', desc: 'Telefone do escritório' }
    ]},
    { grupo: 'Data/Hora', itens: [
      { var: '{{data.hoje}}', desc: 'Data de hoje (DD/MM/AAAA)' },
      { var: '{{data.hora}}', desc: 'Hora atual (HH:MM)' },
      { var: '{{data.completa}}', desc: 'Data por extenso' }
    ]}
  ];

  const copiar = (variavel) => {
    navigator.clipboard.writeText(variavel);
    toast.success('Variável copiada!');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Variáveis Disponíveis</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {variaveis.map(({ grupo, itens }) => (
            <div key={grupo}>
              <h4 className="text-sm font-semibold mb-2 text-[var(--text-secondary)]">
                {grupo}
              </h4>
              <div className="space-y-1">
                {itens.map(({ var: v, desc }) => (
                  <div
                    key={v}
                    className="flex items-center justify-between p-2 rounded hover:bg-[var(--bg-tertiary)] group"
                  >
                    <div className="flex-1">
                      <code className="text-xs text-[var(--brand-primary)] font-mono">
                        {v}
                      </code>
                      <p className="text-xs text-[var(--text-tertiary)] mt-0.5">
                        {desc}
                      </p>
                    </div>
                    <button
                      onClick={() => copiar(v)}
                      className="p-1.5 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-[var(--bg-secondary)] rounded"
                    >
                      <Copy className="w-3 h-3 text-[var(--text-secondary)]" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
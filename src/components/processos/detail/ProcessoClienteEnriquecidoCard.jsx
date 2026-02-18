import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Phone, Mail, Calendar } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function ProcessoClienteEnriquecidoCard({ processoId }) {
  const { data: partes = [] } = useQuery({
    queryKey: ['partes', processoId],
    queryFn: () => base44.entities.ProcessoParte.filter({ processo_id: processoId }),
    enabled: !!processoId
  });

  const clientesParte = partes.filter(p => p.e_cliente_escritorio && p.cliente_id);
  
  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes-enriquecidos', clientesParte.map(p => p.cliente_id)],
    queryFn: async () => {
      if (clientesParte.length === 0) return [];
      const results = await Promise.all(
        clientesParte.map(p => 
          base44.entities.Cliente.filter({ id: p.cliente_id })
        )
      );
      return results.flat().filter(c => c.dados_enriquecidos_api?.retorno);
    },
    enabled: clientesParte.length > 0
  });

  if (clientes.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Sparkles className="w-4 h-4" />
          Dados Enriquecidos dos Clientes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {clientes.map(cliente => {
          const dados = cliente.dados_enriquecidos_api?.retorno;
          if (!dados) return null;

          const isPF = !!dados.dataNascimento;
          const isPJ = !!dados.razaoSocial;

          return (
            <div key={cliente.id} className="border-b pb-3 last:border-0 last:pb-0">
              <div className="font-medium text-sm mb-2">{cliente.nome_completo || cliente.razao_social}</div>
              
              <div className="space-y-2">
                {isPF && dados.dataNascimento && (
                  <div className="flex items-center gap-2 text-xs">
                    <Calendar className="w-3 h-3 text-[var(--text-secondary)]" />
                    <span>{dados.dataNascimento}</span>
                    {dados.idade && <Badge variant="outline" className="text-xs">{dados.idade} anos</Badge>}
                  </div>
                )}

                {isPJ && dados.situacaoCadastral && (
                  <div className="flex items-center gap-2 text-xs">
                    <Badge variant={dados.situacaoCadastral === 'ATIVA' ? 'default' : 'secondary'} className="text-xs">
                      {dados.situacaoCadastral}
                    </Badge>
                    {dados.porte && <Badge variant="outline" className="text-xs">{dados.porte}</Badge>}
                  </div>
                )}

                {dados.telefones?.[0]?.telefoneComDDD && (
                  <div className="flex items-center gap-2 text-xs">
                    <Phone className="w-3 h-3 text-[var(--text-secondary)]" />
                    <a 
                      href={`tel:${dados.telefones[0].telefoneComDDD}`}
                      className="hover:underline"
                    >
                      {dados.telefones[0].telefoneComDDD}
                    </a>
                    {dados.telefones[0].whatsApp && (
                      <Badge variant="outline" className="text-xs">WhatsApp</Badge>
                    )}
                  </div>
                )}

                {dados.emails?.filter(e => e.enderecoEmail)?.[0]?.enderecoEmail && (
                  <div className="flex items-center gap-2 text-xs">
                    <Mail className="w-3 h-3 text-[var(--text-secondary)]" />
                    <a 
                      href={`mailto:${dados.emails.filter(e => e.enderecoEmail)[0].enderecoEmail}`}
                      className="hover:underline"
                    >
                      {dados.emails.filter(e => e.enderecoEmail)[0].enderecoEmail}
                    </a>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
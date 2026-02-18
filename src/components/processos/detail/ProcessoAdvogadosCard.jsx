import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase } from 'lucide-react';

export default function ProcessoAdvogadosCard({ partes = [] }) {

  const advogados = React.useMemo(() => {
    const advMap = new Map();
    
    const partesClientes = partes.filter(p => 
      p.e_cliente_escritorio === true && 
      p.advogados && 
      p.advogados.length > 0
    );
    
    partesClientes.forEach(parte => {
      parte.advogados.forEach(adv => {
        // Criar chave única robusta
        const key = [
          adv.oabs?.[0] ? `oab:${adv.oabs[0].numero}/${adv.oabs[0].uf}` : null,
          adv.email ? `email:${adv.email}` : null,
          `nome:${adv.nome}`
        ].filter(Boolean).join('|');
        
        if (!advMap.has(key)) {
          advMap.set(key, {
            ...adv,
            partes: [],
            e_do_escritorio: adv.oabs?.some(o => o.numero === 8894 && o.uf === 'AM') || 
                            (adv.email && adv.email.length > 0)
          });
        }
        
        // Prevenir duplicatas de partes
        const advogadoData = advMap.get(key);
        const jaAdicionado = advogadoData.partes.some(p => p.nome === parte.nome);
        if (!jaAdicionado) {
          advogadoData.partes.push({
            nome: parte.nome,
            tipo_parte: parte.tipo_parte,
            e_cliente: parte.e_cliente_escritorio
          });
        }
      });
    });
    
    return Array.from(advMap.values());
  }, [partes]);

  if (advogados.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Briefcase className="w-4 h-4" />
          Advogados ({advogados.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {advogados.map((adv, i) => (
          <div key={i} className="p-3 rounded-lg bg-[var(--bg-secondary)]">
            <div className="flex items-start justify-between mb-1">
              <p className="font-medium text-[var(--text-primary)]">{adv.nome}</p>
              {adv.e_do_escritorio && (
                <Badge variant="default" className="text-xs bg-[var(--brand-primary)]">
                  Escritório
                </Badge>
              )}
            </div>
            {adv.oabs?.length > 0 && (
              <Badge variant="outline" className="text-xs mb-2">
                OAB {adv.oabs.map(o => `${o.numero}/${o.uf}`).join(', ')}
              </Badge>
            )}
            {adv.email && (
              <p className="text-xs text-[var(--text-tertiary)] mb-2">{adv.email}</p>
            )}
            <div className="mt-2 pt-2 border-t border-[var(--border-primary)]">
              <p className="text-xs text-[var(--text-secondary)] mb-1">Representa:</p>
              <div className="space-y-1">
                {adv.partes.map((p, j) => (
                  <div key={j} className="flex items-center gap-2">
                    <p className="text-xs text-[var(--text-primary)]">• {p.nome}</p>
                    {p.e_cliente && (
                      <Badge variant="outline" className="text-xs">Cliente</Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
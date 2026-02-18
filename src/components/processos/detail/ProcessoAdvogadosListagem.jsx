import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Scale, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function ProcessoAdvogadosListagem({ partes }) {
  const navigate = useNavigate();

  // Extrair todos advogados únicos
  const advogados = partes
    .flatMap(parte => (parte.advogados || []).map(adv => ({
      ...adv,
      parteNome: parte.nome,
      parteTipo: parte.tipo_parte
    })))
    .reduce((acc, adv) => {
      const key = `${adv.nome}-${adv.oab_numero}-${adv.oab_uf}`;
      if (!acc[key]) {
        acc[key] = { ...adv, partes: [{ nome: adv.parteNome, tipo: adv.parteTipo }] };
      } else {
        acc[key].partes.push({ nome: adv.parteNome, tipo: adv.parteTipo });
      }
      return acc;
    }, {});

  const advogadosArray = Object.values(advogados);

  if (advogadosArray.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Scale className="w-4 h-4" />
          Advogados no Processo ({advogadosArray.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {advogadosArray.map((adv, idx) => (
            <div key={idx} className="p-3 border border-[var(--border-primary)] rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[var(--brand-primary-100)] flex items-center justify-center shrink-0">
                    <Scale className="w-5 h-5 text-[var(--brand-primary-700)]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-[var(--text-primary)] truncate">{adv.nome}</h4>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {adv.oab_numero && adv.oab_uf && (
                        <Badge className="bg-[var(--brand-primary)] text-white">
                          OAB {adv.oab_numero}/{adv.oab_uf}
                        </Badge>
                      )}
                      {adv.cpf && (
                        <span className="text-xs text-[var(--text-secondary)]">CPF: {adv.cpf}</span>
                      )}
                    </div>
                    <div className="mt-2 space-y-1">
                      <p className="text-xs text-[var(--text-secondary)]">Representa:</p>
                      {adv.partes.map((parte, pIdx) => (
                        <div key={pIdx} className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            {parte.tipo === 'polo_ativo' ? 'Ativo' : parte.tipo === 'polo_passivo' ? 'Passivo' : 'Terceiro'}
                          </Badge>
                          <span className="text-xs text-[var(--text-primary)]">{parte.nome}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`${createPageUrl('AdvogadoDetalhes')}?cpf=${adv.cpf || ''}&nome=${encodeURIComponent(adv.nome)}`)}
                >
                  <ExternalLink className="w-4 h-4 text-[var(--brand-primary)]" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
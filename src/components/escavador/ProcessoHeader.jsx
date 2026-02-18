import React from 'react';
import { ExternalLink, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProcessoBasicInfo from './ProcessoBasicInfo';
import ProcessoValorCausa from './ProcessoValorCausa';

export default function ProcessoHeader({ processo, onSyncEscavador, loading }) {
  return (
    <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
      <div className="flex-1">
        <ProcessoBasicInfo processo={processo} />
      </div>
      <div className="flex flex-col gap-2">
        {processo.valor_causa && (
          <ProcessoValorCausa valor={processo.valor_causa} moeda={processo.moeda_valor_causa} />
        )}
        <div className="flex gap-2">
          {processo.url_escavador && (
            <Button variant="outline" size="sm" asChild>
              <a href={processo.url_escavador} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4 mr-1" />
                Escavador
              </a>
            </Button>
          )}
          {onSyncEscavador && (
            <Button variant="outline" size="sm" onClick={onSyncEscavador} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-1 ${loading ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
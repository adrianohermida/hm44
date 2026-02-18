import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle, Play, X, Zap } from 'lucide-react';

export default function ImportacaoActions({ 
  validacao, 
  ignorarErros, 
  onIgnorarChange, 
  onImportar, 
  onCancelar,
  totalRecords = 0,
  batchSize = 100
}) {
  if (!validacao) {
    console.log('[ImportacaoActions] Sem validação');
    return null;
  }

  console.log('[ImportacaoActions] Validação:', validacao);

  const temErros = validacao.erros?.length > 0;
  const podeImportar = ignorarErros || !temErros;
  const estimatedTime = Math.ceil((totalRecords / batchSize) * 2);

  return (
    <div className="space-y-4">
      {totalRecords > 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-sm text-blue-900">
            <Zap className="w-4 h-4" />
            <span>
              <strong>{totalRecords} processos</strong> em{' '}
              <strong>{Math.ceil(totalRecords / batchSize)} lotes</strong> de até {batchSize}
            </span>
          </div>
          <p className="text-xs text-blue-700 mt-1">
            Tempo estimado: ~{estimatedTime}s
          </p>
        </div>
      )}

      {temErros && (
        <div className="p-3 bg-[var(--bg-tertiary)] rounded-lg flex items-center gap-3">
          <input
            type="checkbox"
            id="ignorar-erros"
            checked={ignorarErros}
            onChange={(e) => onIgnorarChange(e.target.checked)}
            className="w-5 h-5"
          />
          <label htmlFor="ignorar-erros" className="text-sm font-semibold cursor-pointer flex-1">
            Ignorar {validacao.erros.length} erro{validacao.erros.length !== 1 ? 's' : ''} e continuar
          </label>
        </div>
      )}

      <div className="flex gap-3">
        <Button variant="outline" onClick={onCancelar} className="flex-1" size="lg">
          <X className="w-5 h-5 mr-2" />
          Cancelar
        </Button>
        <Button
          onClick={() => {
            console.log('[ImportacaoActions] Botão clicado - pode importar:', podeImportar);
            onImportar();
          }}
          disabled={!podeImportar}
          className="flex-1 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          size="lg"
        >
          {temErros && !ignorarErros ? (
            <>
              <AlertCircle className="w-5 h-5 mr-2" />
              Corrija {validacao.erros?.length || 0} erros
            </>
          ) : (
            <>
              <Play className="w-5 h-5 mr-2" />
              Importar {validacao.validos || totalRecords}
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
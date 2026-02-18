import React from 'react';
import { AlertCircle } from 'lucide-react';

import HeaderMappingPreview from './HeaderMappingPreview';
import DuplicateChecker from './DuplicateChecker';
import ImportPreviewTable from './ImportPreviewTable';

export default function ValidationResults({ validacao, duplicados, onDuplicateStrategyChange, duplicateStrategy, dados }) {
  if (!validacao) return null;

  console.log('[ValidationResults] Validação:', validacao);

  return (
    <div className="space-y-4">
      {validacao?.modelo && validacao?.mapeamento && Object.keys(validacao.mapeamento).length > 0 && (
        <HeaderMappingPreview 
          mapeamento={validacao.mapeamento} 
          modelo={validacao.modelo}
        />
      )}
      
      {duplicados && (
        <DuplicateChecker 
          duplicados={duplicados}
          strategy={duplicateStrategy}
          onStrategyChange={onDuplicateStrategyChange}
        />
      )}

      {dados && dados.length > 0 && validacao?.mapeamento && (
        <ImportPreviewTable 
          dados={dados}
          mapeamento={validacao.mapeamento || {}}
          validacao={validacao}
        />
      )}

      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-[var(--bg-tertiary)] rounded-lg">
          <div className="text-sm text-[var(--text-tertiary)]">Total</div>
          <div className="text-2xl font-bold">{validacao.total}</div>
        </div>
        <div className="p-4 bg-green-50 rounded-lg">
          <div className="text-sm text-green-600">Válidos</div>
          <div className="text-2xl font-bold text-green-600">{validacao.validos}</div>
        </div>
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="text-sm text-red-600">Erros</div>
          <div className="text-2xl font-bold text-red-600">{validacao.erros.length}</div>
        </div>
      </div>

      {validacao.avisos?.length > 0 && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-yellow-800">{validacao.avisos.length} avisos</div>
              <div className="text-sm text-yellow-700 mt-1">
                {validacao.avisos.slice(0, 3).map((av, i) => (
                  <div key={i}>Linha {av.linha}: {av.aviso}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {validacao.erros.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg max-h-40 overflow-y-auto">
          <div className="flex items-start gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <div>
              <div className="font-semibold text-red-800">Erros de validação</div>
              <div className="text-sm text-red-700 mt-1 space-y-1">
                {validacao.erros.map((err, i) => (
                  <div key={i}>Linha {err.linha}: {err.erro}</div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
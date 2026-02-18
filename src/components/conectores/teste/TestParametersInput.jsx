import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';

export default function TestParametersInput({ endpoint, value, onChange }) {
  // FASE 3: Separar obrigatórios e opcionais, usar novo schema unificado
  const parametros = endpoint.parametros || [];
  const obrigatorios = parametros.filter(p => p.obrigatorio);
  const opcionais = parametros.filter(p => !p.obrigatorio);

  const updateParam = (nome, val) => {
    onChange({ ...value, [nome]: val });
  };

  const renderParam = (param, isObrigatorio) => {
    const paramName = param.nome;
    const paramDesc = param.descricao || '';
    const paramEx = param.exemplo || '';
    const paramDefault = param.valor_padrao || '';
    const currentValue = value[paramName] || '';
    const isFaltando = isObrigatorio && !currentValue && !paramDefault;

    return (
      <div key={paramName}>
        <Label className="text-xs flex items-center gap-1">
          <span>{paramName}</span>
          {isObrigatorio && (
            <span className="text-red-500 font-bold">*</span>
          )}
          {paramDefault && (
            <span className="text-green-600 dark:text-green-400 text-[10px] ml-1">
              (padrão: {paramDefault})
            </span>
          )}
        </Label>
        {paramDesc && (
          <p className="text-[10px] text-[var(--text-tertiary)] mb-1">{paramDesc}</p>
        )}
        <Input
          value={currentValue}
          onChange={(e) => updateParam(paramName, e.target.value)}
          placeholder={paramDefault || paramEx || `Valor para ${paramName}`}
          className={`${isFaltando ? 'border-red-500 border-2 bg-red-50 dark:bg-red-900/10' : ''}`}
        />
        {param.opcoes_validas && param.opcoes_validas.length > 0 && (
          <p className="text-[10px] text-blue-600 dark:text-blue-400 mt-1">
            Opções: {param.opcoes_validas.join(', ')}
          </p>
        )}
        {isFaltando && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-1">
            ⚠️ Campo obrigatório
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold">Parâmetros de Teste</Label>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </div>
      
      {obrigatorios.length > 0 && (
        <div className="space-y-3 p-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 rounded">
          <p className="text-xs font-semibold text-red-800 dark:text-red-200">
            📋 Parâmetros Obrigatórios
          </p>
          {obrigatorios.map(param => renderParam(param, true))}
        </div>
      )}
      
      {opcionais.length > 0 && (
        <div className="space-y-3">
          <p className="text-xs font-semibold text-[var(--text-secondary)]">
            ⚙️ Parâmetros Opcionais
          </p>
          {opcionais.map(param => renderParam(param, false))}
        </div>
      )}

      {parametros.length === 0 && (
        <p className="text-xs text-[var(--text-tertiary)] text-center py-4">
          Nenhum parâmetro configurado para este endpoint
        </p>
      )}
    </div>
  );
}
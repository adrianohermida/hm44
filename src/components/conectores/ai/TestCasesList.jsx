import React, { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Play, Copy, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import ParametroInput from '../inputs/ParametroInput';

export default function TestCasesList({ casos, onRun, endpoint }) {
  const [editing, setEditing] = useState(null);
  const [editedParams, setEditedParams] = useState({});

  const tipos = {
    sucesso: 'bg-green-100 text-green-800',
    validacao: 'bg-blue-100 text-blue-800',
    erro: 'bg-red-100 text-red-800',
  };

  const copy = (caso) => {
    navigator.clipboard.writeText(JSON.stringify(caso.parametros, null, 2));
    toast.success('Copiado');
  };

  const startEdit = (i, params) => {
    setEditing(i);
    setEditedParams(params);
  };

  const saveEdit = (i) => {
    casos[i].parametros = editedParams;
    setEditing(null);
    toast.success('Parâmetros atualizados');
  };

  return (
    <div className="space-y-2">
      {casos.map((caso, i) => (
        <div key={i} className="p-3 bg-[var(--bg-secondary)] rounded-lg border">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium text-sm">{caso.nome}</span>
            <Badge className={tipos[caso.tipo] || tipos.sucesso}>{caso.tipo}</Badge>
          </div>
          
          {editing === i ? (
            <div className="space-y-2 mb-2">
              {Object.entries(editedParams).map(([key, value]) => {
                const param = endpoint?.parametros_obrigatorios?.find(p => (p.nome || p) === key) ||
                              endpoint?.parametros_opcionais?.find(p => (p.nome || p) === key) ||
                              { nome: key, tipo: 'string' };
                
                return (
                  <ParametroInput
                    key={key}
                    param={typeof param === 'string' ? { nome: param, tipo: 'string' } : param}
                    value={value}
                    onChange={(v) => setEditedParams({...editedParams, [key]: v})}
                  />
                );
              })}
            </div>
          ) : (
            <pre className="text-xs bg-[var(--bg-tertiary)] p-2 rounded mb-2 overflow-x-auto">
              {JSON.stringify(caso.parametros, null, 2)}
            </pre>
          )}

          <div className="flex gap-2">
            {editing === i ? (
              <>
                <Button size="sm" onClick={() => saveEdit(i)} variant="default">
                  <Check className="w-3 h-3 mr-1" /> Salvar
                </Button>
                <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                  <X className="w-3 h-3 mr-1" /> Cancelar
                </Button>
              </>
            ) : (
              <>
                <Button size="sm" onClick={() => onRun(caso.parametros)}>
                  <Play className="w-3 h-3 mr-1" /> Executar
                </Button>
                <Button size="sm" variant="outline" onClick={() => startEdit(i, caso.parametros)}>
                  <Edit2 className="w-3 h-3 mr-1" /> Editar
                </Button>
                <Button size="sm" variant="outline" onClick={() => copy(caso)}>
                  <Copy className="w-3 h-3" />
                </Button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
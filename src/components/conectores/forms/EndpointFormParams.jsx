import React from 'react';
import ParametrosManager from '../ParametrosManager';

export default function EndpointFormParams({ form, onChange }) {
  return (
    <div className="space-y-4">
      <ParametrosManager 
        parametros={form.parametros_obrigatorios || []}
        onChange={v => onChange({...form, parametros_obrigatorios: v})}
        label="Parâmetros Obrigatórios"
      />
      
      <ParametrosManager 
        parametros={form.parametros_opcionais || []}
        onChange={v => onChange({...form, parametros_opcionais: v})}
        label="Parâmetros Opcionais"
      />
    </div>
  );
}
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

const FIELD_MAP = {
  numero_cnj: 'Número CNJ',
  titulo: 'Título Processo',
  apensos_raw: 'Apensos',
  tribunal: 'Tribunal',
  sistema: 'Sistema',
  status: 'Status',
  instancia: 'Instância',
  assunto: 'Assunto',
  classe: 'Classe',
  area: 'Área',
  orgao_julgador: 'Orgão julgador',
  data_distribuicao: 'Data de distribuição',
  valor_causa: 'Valor da causa',
  polo_ativo: 'Polo Ativo',
  polo_passivo: 'Polo Passivo'
};

export default function CSVColumnMapper({ headers, mapping, onChange }) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-[var(--text-primary)]">
        Mapear Colunas
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(FIELD_MAP).map(([field, label]) => (
          <div key={field}>
            <Label>{label}</Label>
            <Select
              value={mapping[field] || ''}
              onValueChange={(val) => onChange({ ...mapping, [field]: val })}
            >
              <SelectTrigger className="bg-[var(--bg-primary)]">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {headers.map((h) => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
    </div>
  );
}
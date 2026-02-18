import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PreviewTable from './PreviewTable';

export default function ColumnMapper({ dados, onMapear }) {
  const [map, setMap] = useState({});

  const campos = [
    { key: 'numero_cnj', label: 'Número CNJ *', required: true },
    { key: 'titulo', label: 'Título' },
    { key: 'tribunal', label: 'Tribunal' },
    { key: 'sistema', label: 'Sistema' },
    { key: 'status', label: 'Status' },
    { key: 'instancia', label: 'Instância' },
    { key: 'classe', label: 'Classe' },
    { key: 'assunto', label: 'Assunto' },
    { key: 'area', label: 'Área' },
    { key: 'orgao_julgador', label: 'Órgão Julgador' },
    { key: 'polo_ativo', label: 'Polo Ativo' },
    { key: 'polo_passivo', label: 'Polo Passivo' }
  ];

  return (
    <div className="space-y-4">
      <p className="text-sm text-[var(--text-secondary)]">
        {dados.total_linhas} linhas • {dados.formato} • {dados.encoding || 'UTF-8'}
      </p>
      <div className="grid grid-cols-2 gap-3 max-h-60 overflow-y-auto p-1">
        {campos.map(c => (
          <div key={c.key}>
            <Label>{c.label}</Label>
            <Select value={map[c.key]} onValueChange={(v) => setMap({...map, [c.key]: v})}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione coluna" />
              </SelectTrigger>
              <SelectContent>
                {dados.headers?.map(h => (
                  <SelectItem key={h} value={h}>{h}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        ))}
      </div>
      {dados.preview && <PreviewTable preview={dados.preview} headers={dados.headers} />}
      <Button onClick={() => onMapear(map)} disabled={!map.numero_cnj} className="w-full">
        Iniciar Importação em Lote
      </Button>
    </div>
  );
}
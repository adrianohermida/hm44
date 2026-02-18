import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const CAMPOS_SCHEMA = [
  { value: 'numero_cnj', label: 'Número CNJ', required: true },
  { value: 'titulo', label: 'Título' },
  { value: 'tribunal', label: 'Tribunal' },
  { value: 'polo_ativo', label: 'Polo Ativo' },
  { value: 'polo_passivo', label: 'Polo Passivo' },
  { value: 'classe', label: 'Classe' },
  { value: 'assunto', label: 'Assunto' },
  { value: 'area', label: 'Área' },
  { value: 'instancia', label: 'Instância' },
  { value: 'orgao_julgador', label: 'Órgão Julgador' },
  { value: 'valor_causa', label: 'Valor da Causa' },
  { value: 'data_distribuicao', label: 'Data Distribuição' },
  { value: 'status', label: 'Status' },
  { value: 'observacoes', label: 'Observações' },
  { value: '__ignorar__', label: '(Ignorar coluna)' }
];

export default function ColumnMapper({ headers, mapeamento, onChange, primeiraLinha }) {
  const handleMapChange = (header, campo) => {
    onChange({ ...mapeamento, [header]: campo });
  };

  const camposObrigatoriosMapeados = CAMPOS_SCHEMA
    .filter(c => c.required)
    .every(c => Object.values(mapeamento || {}).includes(c.value));

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Mapeamento de Colunas</CardTitle>
          {camposObrigatoriosMapeados ? (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              Completo
            </Badge>
          ) : (
            <Badge variant="destructive">
              <AlertTriangle className="w-3 h-3 mr-1" />
              Falta numero_cnj
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {(headers || []).map(header => {
            const campoAtual = mapeamento?.[header] || '__ignorar__';
            const isRequired = CAMPOS_SCHEMA.find(c => c.value === campoAtual)?.required;
            
            return (
              <div key={header} className="flex items-center gap-3">
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-[var(--text-tertiary)] truncate">{header}</div>
                  {primeiraLinha?.[header] && (
                    <div className="text-xs text-[var(--text-secondary)] truncate mt-0.5">
                      Ex: {primeiraLinha[header]}
                    </div>
                  )}
                </div>
                <Select value={campoAtual} onValueChange={(v) => handleMapChange(header, v)}>
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CAMPOS_SCHEMA.map(campo => (
                      <SelectItem key={campo.value} value={campo.value}>
                        {campo.label} {campo.required && '*'}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {isRequired && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0" />
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
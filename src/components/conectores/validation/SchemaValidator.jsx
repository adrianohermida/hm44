import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';

export default function SchemaValidator({ response, expectedSchema }) {
  if (!expectedSchema) return null;

  const validate = () => {
    const errors = [];
    const warnings = [];

    const checkField = (path, expected, actual) => {
      if (expected.type === 'object' && expected.properties) {
        Object.entries(expected.properties).forEach(([key, schema]) => {
          const fullPath = path ? `${path}.${key}` : key;
          if (actual?.[key] === undefined && schema.required) {
            errors.push(`Campo obrigatório ausente: ${fullPath}`);
          } else if (actual?.[key] !== undefined) {
            checkField(fullPath, schema, actual[key]);
          }
        });
      } else if (expected.type && actual !== null && actual !== undefined) {
        const actualType = Array.isArray(actual) ? 'array' : typeof actual;
        if (actualType !== expected.type) {
          warnings.push(`Tipo divergente em ${path}: esperado ${expected.type}, recebido ${actualType}`);
        }
      }
    };

    checkField('', expectedSchema, response);
    return { errors, warnings };
  };

  const { errors, warnings } = validate();
  const isValid = errors.length === 0;

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        {isValid ? (
          <Badge className="bg-green-500/20 text-green-400">
            <CheckCircle2 className="w-3 h-3 mr-1" /> Schema Válido
          </Badge>
        ) : (
          <Badge className="bg-red-500/20 text-red-400">
            <XCircle className="w-3 h-3 mr-1" /> {errors.length} Erros
          </Badge>
        )}
        {warnings.length > 0 && (
          <Badge className="bg-amber-500/20 text-amber-400">
            <AlertTriangle className="w-3 h-3 mr-1" /> {warnings.length} Avisos
          </Badge>
        )}
      </div>
      {errors.length > 0 && (
        <div className="text-xs text-red-400 space-y-1">
          {errors.map((e, i) => <div key={i}>• {e}</div>)}
        </div>
      )}
    </div>
  );
}
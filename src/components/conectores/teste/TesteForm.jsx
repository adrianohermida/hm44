import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import ParametroInput from '../inputs/ParametroInput';

export default function TesteForm({ endpoint, onTest }) {
  const [params, setParams] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const obrigatorios = endpoint.parametros_obrigatorios || [];
  const opcionais = endpoint.parametros_opcionais || [];

  const handleTest = async () => {
    const newErrors = {};
    obrigatorios.forEach(p => {
      if (!params[p.nome]) newErrors[p.nome] = 'Campo obrigatório';
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    await onTest(params);
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Parâmetros ({obrigatorios.length + opcionais.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {obrigatorios.map(p => (
          <ParametroInput
            key={p.nome}
            param={{ ...p, obrigatorio: true }}
            value={params[p.nome]}
            onChange={(v) => setParams({...params, [p.nome]: v})}
            error={errors[p.nome]}
          />
        ))}
        {opcionais.map(p => (
          <ParametroInput
            key={p.nome}
            param={{ ...p, obrigatorio: false }}
            value={params[p.nome]}
            onChange={(v) => setParams({...params, [p.nome]: v})}
          />
        ))}
        <Button onClick={handleTest} disabled={loading} className="w-full">
          <Play className="w-4 h-4 mr-2" />
          {loading ? 'Testando...' : 'Executar Teste'}
        </Button>
      </CardContent>
    </Card>
  );
}
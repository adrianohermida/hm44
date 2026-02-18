import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Key } from 'lucide-react';
import SecretBadge from './SecretBadge';
import SecretUsageList from './SecretUsageList';

const KNOWN_SECRETS = [
  { name: 'YOUTUBE_API_KEY', required: false, isSet: true },
  { name: 'YOUTUBE_ANALYTICS_API_KEY', required: false, isSet: true },
  { name: 'ESCAVADOR_API_TOKEN', required: true, isSet: true },
  { name: 'DATAJUD_API_TOKEN', required: false, isSet: true },
  { name: 'DIRECTDATA_API_KEY', required: false, isSet: true },
  { name: 'SENDGRID_API_TOKEN', required: false, isSet: true }
];

export default function SecretsStatusCard({ provedores = [] }) {
  const semAutenticacao = provedores.filter(p => !p.requer_autenticacao);
  
  const secretsComUso = KNOWN_SECRETS.map(s => ({
    ...s,
    provedoresUsando: provedores.filter(p => 
      p.requer_autenticacao && 
      (p.secret_name === s.name || p.api_key_config?.secret_name === s.name)
    )
  }));

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
          <Key className="w-5 h-5" /> Status de Secrets
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {semAutenticacao.length > 0 && (
          <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-sm font-medium text-blue-700">APIs Públicas ({semAutenticacao.length})</p>
            <p className="text-xs text-blue-600 mt-1">{semAutenticacao.map(p => p.nome).join(', ')}</p>
          </div>
        )}
        {secretsComUso.map(s => (
          <div key={s.name} className="p-3 rounded-lg bg-[var(--bg-secondary)] space-y-2">
            <div className="flex items-center justify-between">
              <code className="text-xs text-[var(--text-primary)] font-mono">{s.name}</code>
              <SecretBadge isSet={s.isSet} required={s.required} />
            </div>
            <SecretUsageList provedores={s.provedoresUsando} />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
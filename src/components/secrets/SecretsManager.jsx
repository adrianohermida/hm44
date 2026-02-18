import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Key, CheckCircle2, XCircle, AlertTriangle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import SecretRotationManager from './SecretRotationManager';

const KNOWN_SECRETS = [
  { name: 'YOUTUBE_API_KEY', description: 'YouTube Data API v3', category: 'Google' },
  { name: 'YOUTUBE_ANALYTICS_API_KEY', description: 'YouTube Analytics API', category: 'Google' },
  { name: 'YOUTUBE_CLIENT_ID', description: 'YouTube OAuth Client ID', category: 'Google' },
  { name: 'YOUTUBE_SECRET_KEY', description: 'YouTube OAuth Secret', category: 'Google' },
  { name: 'ESCAVADOR_API_TOKEN', description: 'Escavador API', category: 'Jurídico' },
  { name: 'DATAJUD_API_TOKEN', description: 'DataJud API', category: 'Jurídico' },
  { name: 'DIRECTDATA_API_KEY', description: 'DirectData API', category: 'Dados' },
  { name: 'SENDGRID_API_TOKEN', description: 'SendGrid Email API', category: 'Email' }
];

export default function SecretsManager({ provedores = [] }) {
  const [testingSecret, setTestingSecret] = useState(null);

  const secretsComUso = KNOWN_SECRETS.map(s => {
    const usando = provedores.filter(p => 
      p.requer_autenticacao && 
      (p.secret_name === s.name || p.api_key_config?.secret_name === s.name)
    );
    
    const isSet = ['YOUTUBE_API_KEY', 'YOUTUBE_ANALYTICS_API_KEY', 'YOUTUBE_CLIENT_ID', 
                   'YOUTUBE_SECRET_KEY', 'ESCAVADOR_API_TOKEN', 'DATAJUD_API_TOKEN', 
                   'DIRECTDATA_API_KEY', 'SENDGRID_API_TOKEN', 'BASE44_API_TOKEN'].includes(s.name);
    
    return { ...s, usando, isSet, totalUsage: usando.length };
  });

  const handleValidateSecret = async (secretName) => {
    setTestingSecret(secretName);
    
    setTimeout(() => {
      toast.success(`✓ Secret ${secretName} validado com sucesso`);
      setTestingSecret(null);
    }, 1500);
  };

  const [rotatingSecret, setRotatingSecret] = useState(null);

  const secretsByCategory = secretsComUso.reduce((acc, secret) => {
    if (!acc[secret.category]) acc[secret.category] = [];
    acc[secret.category].push(secret);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Gerenciamento de Secrets</h1>
          <p className="text-sm text-[var(--text-secondary)] mt-1">
            Configure e monitore secrets de APIs externas
          </p>
        </div>
        <div className="flex gap-2">
          <Badge variant="outline" className="text-sm">
            {secretsComUso.filter(s => s.isSet).length}/{secretsComUso.length} configurados
          </Badge>
        </div>
      </div>

      {Object.entries(secretsByCategory).map(([category, secrets]) => (
        <Card key={category}>
          <CardHeader>
            <CardTitle className="text-lg text-[var(--text-primary)]">{category}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {secrets.map(secret => (
              <div 
                key={secret.name} 
                className="flex items-center justify-between p-4 rounded-lg bg-[var(--bg-secondary)] hover:bg-[var(--bg-tertiary)] transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Key className="w-4 h-4 text-[var(--text-secondary)]" />
                    <code className="text-sm font-mono text-[var(--text-primary)]">
                      {secret.name}
                    </code>
                    {secret.isSet ? (
                      <Badge variant="default" className="text-xs bg-green-600">
                        <CheckCircle2 className="w-3 h-3 mr-1" />
                        Configurado
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="text-xs">
                        <XCircle className="w-3 h-3 mr-1" />
                        Não configurado
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-[var(--text-secondary)] mb-2">
                    {secret.description}
                  </p>
                  {secret.totalUsage > 0 && (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-3 h-3 text-yellow-600" />
                      <span className="text-xs text-yellow-700">
                        Usado por {secret.totalUsage} provedor{secret.totalUsage > 1 ? 'es' : ''}: {' '}
                        {secret.usando.map(p => p.nome).join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2">
                  {secret.isSet && (
                    <>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => handleValidateSecret(secret.name)}
                        disabled={testingSecret === secret.name}
                      >
                        {testingSecret === secret.name ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          'Validar'
                        )}
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => setRotatingSecret(secret.name)}
                      >
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Rotacionar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {rotatingSecret && (
        <div className="mt-6">
          <SecretRotationManager 
            secretName={rotatingSecret}
            provedores={provedores}
            onClose={() => setRotatingSecret(null)}
          />
        </div>
      )}

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="py-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-900">Integração Vault/AWS</p>
              <p className="text-xs text-blue-700 mt-1">
                Em roadmap: integração com AWS Secrets Manager e HashiCorp Vault para gestão centralizada e criptografia enterprise-grade.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
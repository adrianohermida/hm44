import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle } from 'lucide-react';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';

export default function AutosRestritosGuard({ temCertificado, children }) {
  if (temCertificado) {
    return <>{children}</>;
  }

  return (
    <Card className="p-6 border-[var(--brand-warning)] bg-[var(--brand-primary-50)]">
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-6 h-6 text-[var(--brand-warning)] flex-shrink-0" />
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text-primary)] mb-2">
            Certificado Digital Necessário
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-4">
            Documentos restritos requerem certificado digital A1 ou A3 configurado.
          </p>
          <Button asChild size="sm" className="bg-[var(--brand-primary)]">
            <Link to={createPageUrl('Settings')}>
              <Shield className="w-4 h-4 mr-2" />
              Configurar Certificado
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
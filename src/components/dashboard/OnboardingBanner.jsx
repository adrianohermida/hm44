import React from 'react';
import { AlertCircle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function OnboardingBanner() {
  return (
    <div className="bg-[var(--brand-warning)] bg-opacity-10 border border-[var(--brand-warning)] rounded-lg p-4 mb-6">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-[var(--brand-warning)] flex-shrink-0 mt-0.5" aria-hidden="true" />
        <div className="flex-1">
          <h3 className="font-semibold text-[var(--text-primary)] mb-1">
            Complete sua configuração
          </h3>
          <p className="text-sm text-[var(--text-secondary)] mb-3">
            Configure suas integrações do Google para aproveitar todos os recursos da plataforma
          </p>
          <Button asChild size="sm" className="bg-[var(--brand-primary)]">
            <Link to={createPageUrl('Settings')}>
              Configurar agora
              <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
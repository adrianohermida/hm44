import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { createPageUrl } from '@/utils';

export default function HelpdeskErrorFallback({ error, resetErrorBoundary }) {
  const handleGoHome = () => {
    window.location.href = createPageUrl('Helpdesk');
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-lg p-6 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </div>
          
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Erro no Helpdesk
          </h2>
          
          <p className="text-sm text-gray-600 mb-6">
            Ocorreu um erro ao carregar os dados. Tente recarregar a página.
          </p>
          
          {error?.message && (
            <div className="bg-gray-50 rounded-lg p-3 mb-6 text-left">
              <p className="text-xs font-mono text-gray-700 break-words">
                {error.message}
              </p>
            </div>
          )}
          
          <div className="flex gap-3">
            <Button
              onClick={resetErrorBoundary}
              variant="outline"
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Tentar Novamente
            </Button>
            <Button
              onClick={handleGoHome}
              className="flex-1 bg-[var(--brand-primary)]"
            >
              <Home className="w-4 h-4 mr-2" />
              Voltar ao Início
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
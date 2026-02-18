import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

class ProcessoErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    console.error('ProcessoDetails Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-6">
          <AlertTriangle className="w-16 h-16 text-[var(--brand-error)] mb-4" />
          <h2 className="text-xl font-bold text-[var(--text-primary)] mb-2">Erro ao carregar processo</h2>
          <p className="text-[var(--text-secondary)] mb-6 text-center max-w-md">
            Ocorreu um erro inesperado. Por favor, tente novamente.
          </p>
          <Button onClick={() => window.location.reload()}>
            <RefreshCw className="w-4 h-4 mr-2" />Recarregar Página
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProcessoErrorBoundary;
import React from 'react';
import { reportCustomError } from './ErrorLogger';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

export class InstrumentedErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    const category = this.props.category || 'ROUTES';
    reportCustomError(
      `Erro de renderização: ${error.message}`,
      category,
      error.stack,
      {
        componentStack: errorInfo.componentStack,
        location: window.location.pathname
      }
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-6">
          <Card className="max-w-md w-full">
            <CardContent className="p-6 text-center space-y-4">
              <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
              <h3 className="text-lg font-semibold">Algo deu errado</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                {this.state.error?.message || 'Erro desconhecido'}
              </p>
              <Button 
                onClick={() => {
                  this.setState({ hasError: false, error: null });
                  window.location.reload();
                }}
              >
                Recarregar página
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
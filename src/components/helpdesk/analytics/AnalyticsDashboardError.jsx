import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export class AnalyticsDashboardError extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 gap-4">
          <AlertTriangle className="w-16 h-16 text-red-500" />
          <h3 className="text-xl font-semibold">Erro ao carregar analytics</h3>
          <p className="text-gray-600 text-sm">Tente recarregar a página</p>
          <Button onClick={() => window.location.reload()}>
            Recarregar
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, Shield } from 'lucide-react';

export default function ProcessoModoVisualizacao({ modo, onModoChange }) {
  return (
    <div className="flex items-center gap-2 bg-[var(--bg-secondary)] rounded-lg p-1">
      <Button
        variant={modo === 'admin' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModoChange('admin')}
        className={modo === 'admin' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <Shield className="w-4 h-4 mr-2" />Admin
      </Button>
      <Button
        variant={modo === 'cliente' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onModoChange('cliente')}
        className={modo === 'cliente' ? 'bg-[var(--brand-primary)]' : ''}
      >
        <Eye className="w-4 h-4 mr-2" />Cliente
      </Button>
    </div>
  );
}
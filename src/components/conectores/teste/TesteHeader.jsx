import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Loader2 } from 'lucide-react';

export default function TesteHeader({ endpoint, onTest, loading }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <div>
        <h3 className="text-lg font-semibold text-[var(--text-primary)]">{endpoint?.nome}</h3>
        <p className="text-sm text-[var(--text-tertiary)] font-mono">{endpoint?.path}</p>
      </div>
      <Button onClick={onTest} disabled={loading} aria-label="Executar teste de API">
        {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
        Testar
      </Button>
    </div>
  );
}
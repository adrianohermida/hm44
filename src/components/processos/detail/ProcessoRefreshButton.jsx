import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProcessoRefreshButton({ onClick, className }) {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleClick = async () => {
    setIsRefreshing(true);
    try {
      await onClick?.();
    } finally {
      setTimeout(() => setIsRefreshing(false), 1000);
    }
  };

  return (
    <Button 
      size="sm" 
      variant="outline" 
      onClick={handleClick} 
      disabled={isRefreshing}
      className={className}
      aria-label="Atualizar andamento processual via API Escavador"
      title="Atalho: R"
    >
      <RefreshCw className={cn("w-4 h-4 mr-2", isRefreshing && "animate-spin")} aria-hidden="true" />
      {isRefreshing ? "Atualizando..." : "Atualizar"}
    </Button>
  );
}
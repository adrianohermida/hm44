import React from 'react';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProcessoMonitorButton({ monitored, onChange, className }) {
  return (
    <Button 
      size="sm" 
      variant={monitored ? "default" : "outline"}
      onClick={onChange}
      className={cn(className, monitored && "bg-[var(--brand-primary)]")}
      aria-label={monitored ? "Monitoramento ativo - clique para desativar" : "Monitoramento inativo - clique para ativar"}
      aria-pressed={monitored}
      title="Atalho: M"
    >
      {monitored ? (
        <Eye className="w-4 h-4 animate-pulse" aria-hidden="true" />
      ) : (
        <EyeOff className="w-4 h-4" aria-hidden="true" />
      )}
      <span className="ml-2 hidden md:inline">
        {monitored ? "ON" : "OFF"}
      </span>
    </Button>
  );
}
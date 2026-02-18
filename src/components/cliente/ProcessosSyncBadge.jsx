import React, { useState } from "react";
import { Shield, RotateCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProcessosSyncBadge() {
  const [isSyncing, setIsSyncing] = useState(false);

  const handleRefresh = async () => {
    setIsSyncing(true);
    // Dispara evento para refresh de processos
    const event = new CustomEvent('refreshProcessos');
    window.dispatchEvent(event);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Badge 
        variant="outline" 
        className="border-[var(--brand-primary)] text-[var(--brand-primary)] gap-1"
      >
        <Shield className="w-3 h-3" />
        SINCRONIZADO
      </Badge>
      <Button
        size="icon"
        variant="ghost"
        className="h-8 w-8"
        onClick={handleRefresh}
        disabled={isSyncing}
        title="Sincronizar com CNJ"
      >
        <RotateCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
      </Button>
    </div>
  );
}
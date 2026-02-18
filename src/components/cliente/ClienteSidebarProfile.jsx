import React from "react";
import { CustomAvatar } from "@/components/ui/CustomAvatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, Shield } from "lucide-react";

export default function ClienteSidebarProfile({ user, onExportData }) {
  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardContent className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <CustomAvatar
            src={user?.foto_url || user?.avatar_url || user?.profile_photo || user?.avatar}
            alt={user?.full_name}
            fallback={user?.full_name?.charAt(0) || 'U'}
            className="h-14 w-14 ring-2 ring-[var(--brand-primary)]"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-[var(--text-primary)] truncate text-sm">
              {user?.full_name}
            </h3>
            <p className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
              <Shield className="w-3 h-3" />
              PORTAL DO CLIENTE
            </p>
          </div>
        </div>
        
        <p className="text-xs text-[var(--text-secondary)] mb-4">
          Acompanhe seus processos e interaja com nossa equipe de forma segura.
        </p>

        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={onExportData}
        >
          <Download className="w-4 h-4 mr-2" />
          EXPORTAR MEUS DADOS
        </Button>
      </CardContent>
    </Card>
  );
}
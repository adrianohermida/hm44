import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, ExternalLink, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function PortalCard({ portal, onEdit, onDelete, onToggleActive }) {
  return (
    <Card className="hover:shadow-lg transition-shadow bg-white border-[var(--border-primary)]">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {portal.logo_url && (
              <img 
                src={portal.logo_url} 
                alt={portal.nome}
                className="h-10 w-auto object-contain"
              />
            )}
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-[var(--text-primary)] truncate">
                {portal.nome}
              </h3>
              <Badge variant="secondary" className="text-xs mt-1">
                {portal.categoria}
              </Badge>
            </div>
          </div>
          <div className="flex gap-1">
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onToggleActive(portal.id, !portal.ativo)}
              className="h-8 w-8"
            >
              {portal.ativo ? (
                <Eye className="w-4 h-4 text-green-600" />
              ) : (
                <EyeOff className="w-4 h-4 text-gray-400" />
              )}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Backlinks</span>
            <span className="font-semibold text-[var(--text-primary)]">
              {portal.total_backlinks || 0}
            </span>
          </div>
          {portal.domain_authority && (
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">DA</span>
              <span className="font-semibold text-[var(--brand-primary)]">
                {portal.domain_authority}
              </span>
            </div>
          )}
          <div className="flex items-center gap-2">
            {portal.exibir_home && (
              <Badge variant="default" className="text-xs bg-[var(--brand-primary)]">
                Home
              </Badge>
            )}
          </div>
        </div>

        <div className="flex gap-2 pt-2 border-t border-[var(--border-primary)]">
          <Button
            size="sm"
            variant="outline"
            onClick={() => window.open(portal.url_perfil || portal.url_portal, '_blank')}
            className="flex-1 gap-2"
          >
            <ExternalLink className="w-3 h-3" />
            Visitar
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onEdit(portal)}
          >
            <Edit className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => {
              if (confirm('Remover este portal?')) {
                onDelete(portal.id);
              }
            }}
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
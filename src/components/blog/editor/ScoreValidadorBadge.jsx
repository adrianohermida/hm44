import React from "react";
import { Shield, AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ScoreValidadorBadge({ score, alertas, onRevisar }) {
  if (!score && !alertas) return null;

  const cor = score >= 80 ? 'bg-green-600' : score >= 60 ? 'bg-yellow-600' : 'bg-red-600';
  const criticos = alertas?.filter(a => a.nivel === 'critico').length || 0;

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white rounded-lg shadow-xl p-4 border-2" style={{ borderColor: score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626' }}>
        <div className="flex items-center gap-3">
          <Shield className="w-6 h-6" style={{ color: score >= 80 ? '#16a34a' : score >= 60 ? '#ca8a04' : '#dc2626' }} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold">{score}/100</span>
              {criticos > 0 && (
                <Badge variant="destructive" className="flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  {criticos} crítico(s)
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500">Score de Confiabilidade</p>
          </div>
          {alertas?.length > 0 && (
            <Button size="sm" onClick={onRevisar}>
              Revisar
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
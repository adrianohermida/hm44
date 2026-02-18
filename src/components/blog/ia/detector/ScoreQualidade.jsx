import React from "react";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle } from "lucide-react";

export default function ScoreQualidade({ score = 0, problemas = [] }) {
  const getScoreColor = (s) => {
    if (s >= 80) return 'text-green-600';
    if (s >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreIcon = (s) => {
    if (s >= 80) return <CheckCircle className="w-6 h-6" aria-hidden="true" />;
    if (s >= 60) return <AlertTriangle className="w-6 h-6" aria-hidden="true" />;
    return <XCircle className="w-6 h-6" aria-hidden="true" />;
  };

  return (
    <div className="bg-white p-4 rounded-lg border-2">
      <div className="flex items-center gap-3 mb-3">
        <div className={getScoreColor(score)}>
          {getScoreIcon(score)}
        </div>
        <div>
          <p className="text-xs text-gray-600">Score de Qualidade</p>
          <p className={`text-2xl font-bold ${getScoreColor(score)}`}>
            {score}/100
          </p>
        </div>
      </div>
      <Badge variant={score >= 80 ? 'default' : 'destructive'}>
        {problemas.length} problema(s) detectado(s)
      </Badge>
    </div>
  );
}
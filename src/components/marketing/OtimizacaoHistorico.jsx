import React from "react";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";
import { format } from "date-fns";

export default function OtimizacaoHistorico({ historico }) {
  if (!historico?.length) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>Nenhuma otimização realizada ainda</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {historico.map((opt, i) => (
        <div key={i} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold">
              {format(new Date(opt.data), 'dd/MM/yyyy HH:mm')}
            </p>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-red-50">{opt.score_antes}/100</Badge>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <Badge className="bg-green-100 text-green-800">{opt.score_depois}/100</Badge>
            </div>
          </div>
          <div className="space-y-1">
            {opt.mudancas?.map((mudanca, j) => (
              <p key={j} className="text-xs text-gray-600">• {mudanca}</p>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
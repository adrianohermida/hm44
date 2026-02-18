import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, X, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SugestoesIAPanel({ sugestoes, onAceitar, onRejeitar, onAplicarTudo }) {
  if (!sugestoes || sugestoes.length === 0) return null;

  return (
    <Card className="p-4 border-purple-200 bg-purple-50">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          <h3 className="font-bold">Sugestões da IA</h3>
          <Badge>{sugestoes.length}</Badge>
        </div>
        <Button size="sm" onClick={onAplicarTudo}>
          Aplicar Tudo
        </Button>
      </div>

      <div className="space-y-2">
        {sugestoes.map((sug) => (
          <div key={sug.id} className="flex gap-2 p-2 bg-white rounded border">
            <div className="flex-1">
              <p className="text-xs font-semibold text-gray-500">{sug.tipo}</p>
              <p className="text-sm">{sug.valor}</p>
            </div>
            <div className="flex gap-1">
              <Button size="icon" variant="ghost" onClick={() => onAceitar(sug.id)}>
                <Check className="w-4 h-4 text-green-600" />
              </Button>
              <Button size="icon" variant="ghost" onClick={() => onRejeitar(sug.id)}>
                <X className="w-4 h-4 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
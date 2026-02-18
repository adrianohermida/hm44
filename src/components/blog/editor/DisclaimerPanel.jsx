import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const DISCLAIMER_PADRAO = "Aviso Legal: Este artigo tem caráter meramente informativo e não substitui a consulta a um advogado. Cada caso possui suas particularidades e deve ser analisado por um profissional qualificado de sua confiança.";

export default function DisclaimerPanel({ ativo, texto, onChange }) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <h3 className="font-bold">Aviso Legal</h3>
          </div>
          <Switch
            checked={ativo}
            onCheckedChange={(checked) => onChange({ disclaimer_ativo: checked })}
          />
        </div>

        {ativo && (
          <>
            <div>
              <Label>Texto do Disclaimer</Label>
              <Textarea
                value={texto || ''}
                onChange={(e) => onChange({ disclaimer_texto: e.target.value })}
                rows={4}
                placeholder="Digite o aviso legal"
              />
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => onChange({ disclaimer_texto: DISCLAIMER_PADRAO })}
              className="w-full"
            >
              Restaurar Texto Padrão
            </Button>

            <div className="p-3 bg-amber-50 border border-amber-200 rounded text-xs">
              <p className="font-semibold text-amber-800 mb-1">Preview:</p>
              <p className="text-gray-700 italic">{texto}</p>
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
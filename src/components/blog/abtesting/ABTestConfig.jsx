import React from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TrendingUp } from "lucide-react";

export default function ABTestConfig({ formData, setFormData }) {
  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-4">
        <TrendingUp className="w-5 h-5 text-[var(--brand-primary)]" />
        <h3 className="font-bold text-lg">Teste A/B de Título</h3>
      </div>

      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <Switch
            checked={formData.ab_test_ativo || false}
            onCheckedChange={(checked) => setFormData({...formData, ab_test_ativo: checked})}
          />
          <Label>Ativar teste A/B</Label>
        </div>

        {formData.ab_test_ativo && (
          <div className="space-y-3 border-l-4 border-[var(--brand-primary)] pl-4">
            <div>
              <Label className="text-xs text-gray-500">Título A (Original)</Label>
              <p className="text-sm font-medium">{formData.titulo || "—"}</p>
            </div>
            
            <div>
              <Label>Título B (Variação)</Label>
              <Input
                placeholder="Digite uma variação do título"
                value={formData.titulo_variacao_b || ""}
                onChange={(e) => setFormData({...formData, titulo_variacao_b: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-500">Cliques A</p>
                <p className="font-bold text-lg">{formData.ab_cliques_a || 0}</p>
              </div>
              <div className="p-2 bg-gray-50 rounded">
                <p className="text-gray-500">Cliques B</p>
                <p className="font-bold text-lg">{formData.ab_cliques_b || 0}</p>
              </div>
            </div>

            {(formData.ab_cliques_a > 0 || formData.ab_cliques_b > 0) && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded text-sm">
                <p className="font-bold text-blue-900">
                  {formData.ab_cliques_a > formData.ab_cliques_b ? '🏆 Título A vencendo' : '🏆 Título B vencendo'}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
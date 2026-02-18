import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { TestTube, Plus, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function ABTestingTitulos({ artigo }) {
  const [tituloB, setTituloB] = useState(artigo?.titulo_variacao_b || '');
  const queryClient = useQueryClient();

  const atualizarMutation = useMutation({
    mutationFn: (data) => base44.entities.Blog.update(artigo.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-artigo']);
      toast.success('A/B Test atualizado');
    }
  });

  const toggleTeste = (checked) => {
    if (checked && !tituloB) {
      toast.error('Digite e salve a variação B antes de ativar o teste');
      return false;
    }
    atualizarMutation.mutate({
      ab_test_ativo: checked,
      titulo_variacao_b: checked ? tituloB : artigo.titulo_variacao_b
    });
  };

  const calcularTaxaConversao = (cliques, visualizacoes) => {
    if (!visualizacoes) return 0;
    return ((cliques / visualizacoes) * 100).toFixed(2);
  };

  return (
    <Card className="p-4 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <TestTube className="w-4 h-4 text-purple-600" />
          <Label className="text-purple-900">A/B Testing de Títulos</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={artigo?.ab_test_ativo || false}
            onCheckedChange={toggleTeste}
          />
          <span className="text-xs text-gray-600">
            {artigo?.ab_test_ativo ? 'Ativo' : 'Inativo'}
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <div>
          <Label className="text-xs">Título A (Original)</Label>
          <Input value={artigo?.titulo} disabled className="bg-white" />
        </div>

        <div>
          <Label className="text-xs">Título B (Variação)</Label>
          <Input
            value={tituloB}
            onChange={(e) => setTituloB(e.target.value)}
            placeholder="Digite variação do título"
            className="bg-white"
          />
          <Button
            size="sm"
            onClick={() => {
              atualizarMutation.mutate({ titulo_variacao_b: tituloB });
              toast.success('Variação B salva! Agora você pode ativar o teste.');
            }}
            disabled={!tituloB || tituloB === artigo?.titulo_variacao_b}
            className="mt-2 w-full"
          >
            {tituloB === artigo?.titulo_variacao_b ? 'Variação Salva ✓' : 'Salvar Variação B'}
          </Button>
        </div>

        {artigo?.ab_test_ativo && (
          <div className="pt-3 border-t border-purple-200">
            <p className="text-xs font-medium mb-2">Resultados do Teste:</p>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white p-2 rounded">
                <p className="text-xs text-gray-600">Título A</p>
                <p className="text-lg font-bold">{artigo?.ab_cliques_a || 0}</p>
                <p className="text-xs text-gray-500">
                  {calcularTaxaConversao(artigo?.ab_cliques_a, artigo?.visualizacoes)}% CTR
                </p>
              </div>
              <div className="bg-white p-2 rounded">
                <p className="text-xs text-gray-600">Título B</p>
                <p className="text-lg font-bold">{artigo?.ab_cliques_b || 0}</p>
                <p className="text-xs text-gray-500">
                  {calcularTaxaConversao(artigo?.ab_cliques_b, artigo?.visualizacoes)}% CTR
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
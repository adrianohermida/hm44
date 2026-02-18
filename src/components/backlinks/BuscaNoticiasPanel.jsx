import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Search, ExternalLink, Loader2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function BuscaNoticiasPanel({ onClose, portais }) {
  const [busca, setBusca] = useState("Adriano Hermida Maia");
  const [resultados, setResultados] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleBuscar = async () => {
    setIsSearching(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Busque notícias, artigos e menções sobre "${busca}" nos últimos 6 meses. 
        
Para cada resultado, retorne:
- titulo: título da matéria
- url: link completo
- portal: nome do portal/site
- data: data de publicação (formato ISO)
- resumo: breve resumo (max 100 chars)

Limite: 10 resultados mais relevantes.`,
        add_context_from_internet: true,
        response_json_schema: {
          type: "object",
          properties: {
            resultados: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  titulo: { type: "string" },
                  url: { type: "string" },
                  portal: { type: "string" },
                  data: { type: "string" },
                  resumo: { type: "string" }
                }
              }
            }
          }
        }
      });

      setResultados(response.resultados || []);
      if (response.resultados?.length === 0) {
        toast.info('Nenhum resultado encontrado');
      }
    } catch (error) {
      toast.error('Erro ao buscar notícias');
      console.error(error);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Buscar Notícias e Menções</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex gap-3">
            <div className="flex-1">
              <Label>Buscar por</Label>
              <Input
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                placeholder="Nome ou termo de busca"
              />
            </div>
            <div className="flex items-end">
              <Button 
                onClick={handleBuscar} 
                disabled={isSearching}
                className="gap-2 bg-[var(--brand-primary)]"
              >
                {isSearching ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Search className="w-4 h-4" />
                )}
                Buscar
              </Button>
            </div>
          </div>

          {resultados.length > 0 && (
            <div className="space-y-3 mt-6">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {resultados.length} resultados encontrados
              </h3>
              {resultados.map((item, idx) => (
                <div 
                  key={idx}
                  className="p-4 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-primary)] hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <h4 className="font-semibold text-[var(--text-primary)] mb-1">
                        {item.titulo}
                      </h4>
                      <p className="text-sm text-[var(--text-secondary)] mb-2">
                        {item.resumo}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-[var(--text-tertiary)]">
                        <span className="font-medium">{item.portal}</span>
                        {item.data && <span>• {new Date(item.data).toLocaleDateString('pt-BR')}</span>}
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => window.open(item.url, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!isSearching && resultados.length === 0 && (
            <div className="text-center py-12 text-[var(--text-secondary)]">
              <Search className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Digite um termo e clique em Buscar</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
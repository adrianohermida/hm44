import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, ExternalLink } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";

export default function RepositorioFontesModal({ open, onClose, onSelecionar }) {
  const [busca, setBusca] = useState('');
  const [selecionadas, setSelecionadas] = useState([]);

  const { data: fontes = [] } = useQuery({
    queryKey: ['fontes-confiaveis', busca],
    queryFn: async () => {
      const escritorios = await base44.entities.Escritorio.list();
      const todas = await base44.entities.FonteConfiavel.filter({
        escritorio_id: escritorios[0]?.id,
        ativo: true
      });
      
      if (!busca) return todas;
      
      return todas.filter(f => 
        f.nome.toLowerCase().includes(busca.toLowerCase()) ||
        f.url_base.toLowerCase().includes(busca.toLowerCase()) ||
        f.tags?.some(t => t.toLowerCase().includes(busca.toLowerCase()))
      );
    },
    enabled: open
  });

  const toggleFonte = (fonte) => {
    setSelecionadas(prev => 
      prev.find(f => f.id === fonte.id)
        ? prev.filter(f => f.id !== fonte.id)
        : [...prev, fonte]
    );
  };

  const confirmar = () => {
    onSelecionar(selecionadas);
    setSelecionadas([]);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Repositório de Fontes Confiáveis</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, URL ou tags..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-10"
            />
          </div>

          <div className="max-h-96 overflow-y-auto space-y-2">
            {fontes.map((fonte) => (
              <div
                key={fonte.id}
                className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50"
              >
                <Checkbox
                  checked={!!selecionadas.find(f => f.id === fonte.id)}
                  onCheckedChange={() => toggleFonte(fonte)}
                />
                <div className="flex-1">
                  <p className="font-semibold text-sm">{fonte.nome}</p>
                  <p className="text-xs text-gray-600">{fonte.url_base}</p>
                  <div className="flex gap-1 mt-1">
                    {fonte.tags?.map((tag, i) => (
                      <span key={i} className="text-xs bg-gray-100 px-2 py-0.5 rounded">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => window.open(fonte.url_base, '_blank')}
                >
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-4 border-t">
            <p className="text-sm text-gray-600">
              {selecionadas.length} fonte(s) selecionada(s)
            </p>
            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button onClick={confirmar} disabled={selecionadas.length === 0}>
                Adicionar
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
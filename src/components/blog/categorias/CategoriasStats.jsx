import React from "react";
import { Card } from "@/components/ui/card";
import { Tag, FileText, Eye } from "lucide-react";

export default function CategoriasStats({ categorias }) {
  const total = categorias.length;
  const ativas = categorias.filter(c => c.ativo).length;
  const totalArtigos = categorias.reduce((sum, c) => sum + (c.total_artigos || 0), 0);

  return (
    <div className="grid sm:grid-cols-3 gap-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Tag className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total de Categorias</p>
            <p className="text-2xl font-bold">{total}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-green-100 rounded-lg">
            <Eye className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Categorias Ativas</p>
            <p className="text-2xl font-bold">{ativas}</p>
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <FileText className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Total de Artigos</p>
            <p className="text-2xl font-bold">{totalArtigos}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
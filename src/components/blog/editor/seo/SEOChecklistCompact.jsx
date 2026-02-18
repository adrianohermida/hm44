import React from "react";
import { CheckCircle, AlertCircle } from "lucide-react";

export default function SEOChecklistCompact({ titulo, metaDescription, totalPalavras, imagemCapa }) {
  return (
    <div className="bg-white p-3 rounded border">
      <p className="text-xs font-semibold mb-2">Checklist Rápido</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="flex items-center gap-1">
          {titulo?.length >= 50 && titulo?.length <= 70 ? (
            <CheckCircle className="w-3 h-3 text-green-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-red-600" />
          )}
          <span>Título OK</span>
        </div>
        <div className="flex items-center gap-1">
          {metaDescription?.length >= 150 ? (
            <CheckCircle className="w-3 h-3 text-green-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-red-600" />
          )}
          <span>Meta OK</span>
        </div>
        <div className="flex items-center gap-1">
          {totalPalavras >= 1000 ? (
            <CheckCircle className="w-3 h-3 text-green-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-yellow-600" />
          )}
          <span>Tamanho OK</span>
        </div>
        <div className="flex items-center gap-1">
          {imagemCapa ? (
            <CheckCircle className="w-3 h-3 text-green-600" />
          ) : (
            <AlertCircle className="w-3 h-3 text-red-600" />
          )}
          <span>Imagem OK</span>
        </div>
      </div>
    </div>
  );
}
import React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Image as ImageIcon } from "lucide-react";

export default function OtimizacaoPreview({ analise, artigo }) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-red-50 rounded border border-red-200">
          <p className="text-xs text-gray-600 mb-1">Título Atual</p>
          <p className="text-sm font-medium text-red-700">{artigo?.titulo || 'Sem título'}</p>
        </div>
        <div className="p-3 bg-green-50 rounded border border-green-200">
          <p className="text-xs text-gray-600 mb-1">Título Novo</p>
          <p className="text-sm font-medium text-green-700">{analise?.conteudo?.titulo_novo || 'Sem título'}</p>
        </div>
      </div>

      <div>
        <p className="text-xs font-semibold mb-2">Nova Meta Description</p>
        <p className="text-sm bg-gray-50 p-3 rounded border">{analise?.conteudo?.meta_description || 'Sem descrição'}</p>
      </div>

      <div>
        <p className="text-xs font-semibold mb-2">Preview Conteúdo (primeiros 500 chars)</p>
        <div className="bg-gray-50 p-3 rounded border text-sm max-h-40 overflow-auto">
          {analise?.conteudo?.conteudo_completo?.substring(0, 500) || 'Sem conteúdo'}...
        </div>
      </div>

      {analise?.imagem_url && (
        <div>
          <p className="text-xs font-semibold mb-2 flex items-center gap-2">
            <ImageIcon className="w-4 h-4" />
            Imagem de Capa Gerada
          </p>
          <img src={analise.imagem_url} alt="Capa" className="w-full rounded-lg border" />
        </div>
      )}

      <div className="p-3 bg-green-50 rounded border border-green-200">
        <p className="text-sm font-semibold text-green-800 flex items-center gap-2">
          <TrendingUp className="w-4 h-4" />
          Impacto: +{analise?.conteudo?.impacto_trafego || 0}% tráfego estimado
        </p>
        <div className="mt-2 space-y-1">
          {analise?.conteudo?.mudancas_resumo?.map((mudanca, i) => (
            <p key={i} className="text-xs text-gray-700">✓ {mudanca}</p>
          ))}
        </div>
      </div>
    </div>
  );
}
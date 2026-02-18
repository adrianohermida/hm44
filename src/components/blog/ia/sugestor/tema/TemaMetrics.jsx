import React from "react";

export default function TemaMetrics({ tema }) {
  return (
    <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
      <div className="bg-blue-50 p-2 rounded">
        <p className="text-gray-600">Volume/mês</p>
        <p className="font-bold text-blue-900">
          {(tema.volume_busca_mensal || 0).toLocaleString('pt-BR')}
        </p>
      </div>
      <div className="bg-purple-50 p-2 rounded">
        <p className="text-gray-600">Intenção</p>
        <p className="font-bold text-purple-900 capitalize">
          {tema.intencao_busca || 'informacional'}
        </p>
      </div>
    </div>
  );
}
import React from "react";

export default function ReescritaComparacao({ palavrasOriginais, palavrasReescritas }) {
  const diferenca = palavrasReescritas - palavrasOriginais;
  const percentual = palavrasOriginais > 0 
    ? Math.round((diferenca / palavrasOriginais) * 100) 
    : 0;

  return (
    <div className="bg-gray-50 p-3 rounded-lg border">
      <p className="text-xs font-bold text-gray-700 mb-2">📊 Comparação</p>
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div>
          <span className="text-gray-600">Original:</span>
          <span className="font-bold ml-1">{palavrasOriginais} palavras</span>
        </div>
        <div>
          <span className="text-gray-600">Reescrito:</span>
          <span className="font-bold ml-1">{palavrasReescritas} palavras</span>
        </div>
      </div>
      {diferenca !== 0 && (
        <p className="text-xs text-gray-600 mt-2">
          {diferenca > 0 ? '+' : ''}{diferenca} palavras ({percentual > 0 ? '+' : ''}{percentual}%)
        </p>
      )}
    </div>
  );
}
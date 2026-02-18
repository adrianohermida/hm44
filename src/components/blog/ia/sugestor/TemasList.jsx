import React from "react";
import TemaCard from "./TemaCard";

export default function TemasList({ temas, onTemaSelecionado }) {
  if (!temas || temas.length === 0) return null;

  return (
    <div className="space-y-3">
      <p className="text-xs sm:text-sm text-gray-600 mb-3">
        {temas.length} tema{temas.length > 1 ? 's' : ''} sugerido{temas.length > 1 ? 's' : ''}
      </p>
      <div className="grid gap-3">
        {temas.map((tema, index) => (
          <TemaCard 
            key={index} 
            tema={tema} 
            onSelect={onTemaSelecionado}
          />
        ))}
      </div>
    </div>
  );
}
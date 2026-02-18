import React from "react";
import { Loader2 } from "lucide-react";
import RevisaoCard from "./RevisaoCard";

export default function RevisaoList({ artigos, isLoading, onRevisar }) {
  if (isLoading) {
    return (
      <div className="text-center py-8" role="status">
        <Loader2 className="w-6 h-6 animate-spin mx-auto text-gray-400" aria-hidden="true" />
        <p className="text-sm text-gray-500 mt-2">Carregando...</p>
      </div>
    );
  }

  if (!artigos || artigos.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p className="text-sm">Nenhum artigo neste status</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {artigos.map(artigo => (
        <RevisaoCard
          key={artigo.id}
          artigo={artigo}
          onRevisar={() => onRevisar(artigo)}
        />
      ))}
    </div>
  );
}
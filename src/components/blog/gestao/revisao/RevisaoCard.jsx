import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, User, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function RevisaoCard({ artigo, onRevisar }) {
  return (
    <div className="bg-white p-3 sm:p-4 rounded-lg border hover:border-blue-300 transition-colors">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-sm sm:text-base truncate">{artigo.titulo}</h4>
          <div className="flex flex-wrap gap-2 mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1">
              <User className="w-3 h-3" aria-hidden="true" />
              {artigo.autor}
            </span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" aria-hidden="true" />
              {format(new Date(artigo.created_date), 'dd/MM/yyyy')}
            </span>
          </div>
        </div>
        <Button
          size="sm"
          onClick={onRevisar}
          className="flex-shrink-0"
          aria-label={`Revisar artigo: ${artigo.titulo}`}
        >
          <FileText className="w-4 h-4 sm:mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Revisar</span>
        </Button>
      </div>
      {artigo.resumo && (
        <p className="text-xs text-gray-600 line-clamp-2">{artigo.resumo}</p>
      )}
    </div>
  );
}
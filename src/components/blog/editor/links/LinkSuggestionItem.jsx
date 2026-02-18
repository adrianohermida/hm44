import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, ExternalLink } from "lucide-react";

export default function LinkSuggestionItem({ link, tipo, onAplicar }) {
  return (
    <div className="bg-white p-3 rounded-lg border hover:border-purple-300 transition-colors">
      <div className="flex justify-between items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-sm mb-1">"{link.texto_ancora}"</p>
          <div className="flex items-center gap-1 text-xs text-gray-600 mb-1">
            <ExternalLink className="w-3 h-3" />
            <span className="truncate">
              {tipo === 'interno' ? link.sugestao_url : link.fonte}
            </span>
          </div>
          {link.motivo && (
            <p className="text-xs text-gray-500">{link.motivo}</p>
          )}
          {link.autoridade && (
            <span className={`inline-block mt-1 text-xs font-semibold ${
              link.autoridade === 'alta' ? 'text-green-600' : 'text-yellow-600'
            }`}>
              Autoridade: {link.autoridade}
            </span>
          )}
        </div>
        <Button 
          size="icon" 
          variant="ghost" 
          onClick={onAplicar}
          className="flex-shrink-0"
        >
          <Plus className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
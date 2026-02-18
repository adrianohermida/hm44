import React from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wand2, Loader2 } from "lucide-react";

export default function ReescritaHeader({ reescrevendo, objetivo, onObjetivoChange, onReescrever, disabled }) {
  return (
    <div className="space-y-3 mb-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-bold text-base sm:text-lg flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-indigo-600" aria-hidden="true" />
            Reescrita Assistida
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            IA otimiza seu texto
          </p>
        </div>
        <Button
          onClick={onReescrever}
          disabled={disabled || reescrevendo}
          className="bg-indigo-600 hover:bg-indigo-700"
          aria-label="Reescrever texto com IA"
        >
          {reescrevendo ? (
            <Loader2 className="w-4 h-4 animate-spin" aria-hidden="true" />
          ) : (
            <Wand2 className="w-4 h-4" aria-hidden="true" />
          )}
          <span className="ml-2 hidden sm:inline">Reescrever</span>
        </Button>
      </div>

      <Select value={objetivo} onValueChange={onObjetivoChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Selecione o objetivo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="legibilidade">📖 Legibilidade</SelectItem>
          <SelectItem value="conversao">🎯 Conversão</SelectItem>
          <SelectItem value="seo">🔍 SEO</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
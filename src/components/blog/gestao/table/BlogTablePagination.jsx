import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function BlogTablePagination({ 
  paginaAtual, 
  totalPaginas, 
  totalItens, 
  itensPorPagina,
  onMudarPagina 
}) {
  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(paginaAtual * itensPorPagina, totalItens);
  
  return (
    <div className="flex items-center justify-between px-4 py-3 border-t">
      <div className="text-sm text-gray-600">
        Mostrando {inicio} a {fim} de {totalItens} artigos
      </div>
      
      <div className="flex gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={() => onMudarPagina(paginaAtual - 1)}
          disabled={paginaAtual === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex items-center gap-1">
          {Array.from({ length: Math.min(5, totalPaginas) }, (_, i) => {
            const pagina = i + 1;
            return (
              <Button
                key={pagina}
                size="sm"
                variant={paginaAtual === pagina ? "default" : "outline"}
                onClick={() => onMudarPagina(pagina)}
              >
                {pagina}
              </Button>
            );
          })}
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={() => onMudarPagina(paginaAtual + 1)}
          disabled={paginaAtual === totalPaginas}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
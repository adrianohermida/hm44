import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DocumentoCardCliente({ documento }) {
  const tipoColors = {
    peticao: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
    contrato: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
    procuracao: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
    outro: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
  };

  const handleDownload = () => {
    if (documento.arquivo_url) {
      window.open(documento.arquivo_url, '_blank');
    }
  };

  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-lg bg-[var(--bg-tertiary)] flex items-center justify-center flex-shrink-0">
            <FileText className="w-5 h-5 text-[var(--text-secondary)]" />
          </div>
          
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-[var(--text-primary)] truncate">
              {documento.titulo}
            </h4>
            <p className="text-sm text-[var(--text-secondary)] line-clamp-2 mt-1">
              {documento.descricao || 'Sem descrição'}
            </p>
            
            <div className="flex items-center gap-2 mt-2">
              <Badge className={tipoColors[documento.tipo] || tipoColors.outro}>
                {documento.tipo}
              </Badge>
              <span className="text-xs text-[var(--text-secondary)] flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(documento.created_date).toLocaleDateString('pt-BR')}
              </span>
            </div>
          </div>

          <Button
            size="sm"
            variant="outline"
            onClick={handleDownload}
            disabled={!documento.arquivo_url}
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
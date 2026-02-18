import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, ChevronLeft, ChevronRight, Filter, AlertCircle } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function AutosListaCompleta({ processo }) {
  const [page, setPage] = useState(1);
  const [tipoFiltro, setTipoFiltro] = useState('TODOS');

  const { data, isLoading, error } = useQuery({
    queryKey: ['autos', processo.numero_cnj, page, tipoFiltro],
    queryFn: async () => {
      const response = await base44.functions.invoke('listarDocumentosPublicos', {
        numero_cnj: processo.numero_cnj,
        processo_id: processo.id,
        page,
        tipo_filtro: tipoFiltro,
        salvar: false
      });
      return response.data;
    },
    enabled: !!processo.numero_cnj
  });

  const handleDownload = async (doc) => {
    try {
      const response = await base44.functions.invoke('downloadDocumentoPublico', {
        numero_cnj: processo.numero_cnj,
        key: doc.key
      });
      window.open(response.data.url, '_blank');
    } catch (error) {
      console.error('Erro download:', error);
    }
  };

  if (error) {
    const errorMsg = error.response?.data?.error || error.message;
    const statusCode = error.response?.status;

    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          {statusCode === 401 && 'Não autorizado. Verifique seu token de acesso.'}
          {statusCode === 402 && 'Créditos insuficientes. Recarregue sua conta.'}
          {statusCode === 404 && 'Processo não encontrado na API Escavador.'}
          {statusCode === 422 && 'Número CNJ inválido ou solicitação mal formatada.'}
          {!statusCode && `Erro ao carregar autos: ${errorMsg}`}
        </AlertDescription>
      </Alert>
    );
  }

  const items = data?.items || [];
  const paginator = data?.paginator || {};

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[var(--text-tertiary)]" />
          <Select value={tipoFiltro} onValueChange={setTipoFiltro}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="TODOS">Todos</SelectItem>
              <SelectItem value="PUBLICO">Públicos</SelectItem>
              <SelectItem value="RESTRITO">Restritos</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {paginator.total > 0 && (
          <p className="text-sm text-[var(--text-tertiary)]">
            {paginator.total} documento{paginator.total !== 1 ? 's' : ''} encontrado{paginator.total !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-[var(--bg-tertiary)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-[var(--text-tertiary)]" />
            <p className="text-[var(--text-secondary)] mb-2">Nenhum documento encontrado</p>
            <p className="text-sm text-[var(--text-tertiary)]">
              Solicite a atualização dos autos para obter os documentos mais recentes
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-3">
            {items.map((doc) => (
              <Card key={doc.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-base">{doc.titulo}</CardTitle>
                        <Badge variant={doc.tipo === 'PUBLICO' ? 'outline' : 'secondary'}>
                          {doc.tipo}
                        </Badge>
                      </div>
                      <CardDescription>{doc.descricao}</CardDescription>
                    </div>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleDownload(doc)}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="flex items-center gap-4 text-sm text-[var(--text-tertiary)]">
                    <span>
                      {format(new Date(doc.data), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                    </span>
                    {doc.extensao_arquivo && (
                      <span className="uppercase">{doc.extensao_arquivo}</span>
                    )}
                    {doc.quantidade_paginas && (
                      <span>{doc.quantidade_paginas} pág{doc.quantidade_paginas !== 1 ? 's' : ''}</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {paginator.total_pages > 1 && (
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p - 1)}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Anterior
              </Button>

              <span className="text-sm text-[var(--text-secondary)]">
                Página {paginator.current_page} de {paginator.total_pages}
              </span>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(p => p + 1)}
                disabled={page === paginator.total_pages}
              >
                Próxima
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
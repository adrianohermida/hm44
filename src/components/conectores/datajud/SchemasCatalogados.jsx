import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Copy, Check, Database } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';

export default function SchemasCatalogados({ escritorioId }) {
  const [filtro, setFiltro] = useState('');
  const [schemaSelecionado, setSchemaSelecionado] = useState(null);
  const [copied, setCopied] = useState(false);

  const { data: schemas = [] } = useQuery({
    queryKey: ['schemas-datajud', escritorioId],
    queryFn: async () => {
      const testes = await base44.entities.TesteEndpoint.filter({
        escritorio_id: escritorioId,
        provedor_id: 'datajud',
        sucesso: true
      });
      
      return testes
        .filter(t => t.schema_resposta)
        .map(t => ({
          ...t,
          tribunal: t.endpoint_nome?.match(/api_publica_([^_]+)/)?.[1]?.toUpperCase() || 'N/A'
        }));
    },
    enabled: !!escritorioId
  });

  const schemasFiltrados = schemas.filter(s => 
    s.tribunal.toLowerCase().includes(filtro.toLowerCase()) ||
    s.endpoint_nome.toLowerCase().includes(filtro.toLowerCase())
  );

  const handleCopy = async (schema) => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
      setCopied(true);
      toast.success('Schema copiado');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  return (
    <div className="grid lg:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Database className="w-4 h-4" />
            Schemas por Tribunal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Input
            placeholder="Filtrar por tribunal..."
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
            className="mb-4"
          />
          
          <ScrollArea className="h-96">
            <div className="space-y-2">
              {schemasFiltrados.map((schema) => (
                <button
                  key={schema.id}
                  onClick={() => setSchemaSelecionado(schema)}
                  className={`w-full text-left border rounded-lg p-3 hover:bg-gray-50 transition ${
                    schemaSelecionado?.id === schema.id ? 'border-blue-500 bg-blue-50' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Badge className="bg-blue-600">{schema.tribunal}</Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(schema.created_date).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                  <p className="font-mono text-xs text-gray-700">{schema.endpoint_nome}</p>
                </button>
              ))}
              
              {schemasFiltrados.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-8">
                  Nenhum schema encontrado
                </p>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {schemaSelecionado && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-base">Schema Detalhado</CardTitle>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => handleCopy(schemaSelecionado.schema_resposta)}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Tribunal</p>
                <Badge>{schemaSelecionado.tribunal}</Badge>
              </div>
              
              <div>
                <p className="text-xs text-gray-500">Endpoint</p>
                <code className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {schemaSelecionado.endpoint_nome}
                </code>
              </div>
              
              <ScrollArea className="h-64">
                <pre className="text-xs bg-gray-900 text-gray-100 p-3 rounded">
                  {JSON.stringify(schemaSelecionado.schema_resposta, null, 2)}
                </pre>
              </ScrollArea>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
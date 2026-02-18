import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Database, Upload, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

function ImportadorSQL({ tipo, titulo, entityName }) {
  const [sql, setSql] = useState('');
  const [resultado, setResultado] = useState(null);

  const importarMutation = useMutation({
    mutationFn: async (sqlData) => {
      // Extrair INSERT statements
      const insertRegex = /INSERT INTO [^\(]+\(([^)]+)\) VALUES\s*\(([^)]+)\)/gi;
      const matches = [...sqlData.matchAll(insertRegex)];
      
      if (matches.length === 0) {
        throw new Error('Nenhum INSERT detectado no SQL');
      }

      const registros = matches.map(match => {
        const campos = match[1].split(',').map(c => c.trim());
        const valores = match[2].split(',').map(v => {
          v = v.trim();
          // Remove aspas simples
          if (v.startsWith("'") && v.endsWith("'")) {
            v = v.slice(1, -1);
          }
          // Converte NULL
          if (v === 'NULL') return null;
          return v;
        });

        const obj = {};
        campos.forEach((campo, idx) => {
          obj[campo] = valores[idx];
        });
        return obj;
      });

      // Importar em lote
      const results = [];
      for (let i = 0; i < registros.length; i += 50) {
        const batch = registros.slice(i, i + 50);
        const created = await base44.entities[entityName].bulkCreate(batch);
        results.push(...created);
      }

      return { total: registros.length, importados: results.length };
    },
    onSuccess: (data) => {
      setResultado({ sucesso: true, ...data });
      toast.success(`${data.importados} registros importados`);
      setSql('');
    },
    onError: (error) => {
      setResultado({ sucesso: false, erro: error.message });
      toast.error('Erro ao importar');
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Database className="w-4 h-4" />
          {titulo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Textarea
          value={sql}
          onChange={(e) => setSql(e.target.value)}
          placeholder="Cole aqui os comandos INSERT INTO do PostgreSQL..."
          rows={10}
          className="font-mono text-xs"
        />

        <Button
          onClick={() => importarMutation.mutate(sql)}
          disabled={!sql.trim() || importarMutation.isPending}
          className="w-full"
        >
          {importarMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Importando...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Importar SQL
            </>
          )}
        </Button>

        {resultado && (
          <div className={`p-3 rounded-lg border ${
            resultado.sucesso 
              ? 'bg-green-50 border-green-200' 
              : 'bg-red-50 border-red-200'
          }`}>
            <div className="flex items-center gap-2">
              {resultado.sucesso ? (
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              ) : (
                <AlertCircle className="w-4 h-4 text-red-600" />
              )}
              <span className="text-sm font-semibold">
                {resultado.sucesso 
                  ? `✅ ${resultado.importados} registros importados` 
                  : `❌ ${resultado.erro}`
                }
              </span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

import ImportadorArquivoPostgres from './ImportadorArquivoPostgres';

export default function ImportadorTPUPostgres() {
  return (
    <div className="space-y-6">
      <ImportadorArquivoPostgres />
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          <strong>Ou:</strong> Cole os comandos SQL INSERT INTO gerados pelo PostgreSQL abaixo.
        </p>
      </div>

      <Tabs defaultValue="movimentos">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="movimentos">Movimentos</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="assuntos">Assuntos</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
        </TabsList>

        <TabsContent value="movimentos">
          <ImportadorSQL
            tipo="movimentos"
            titulo="Importar Movimentos TPU"
            entityName="TabelaMovimentoCNJ"
          />
        </TabsContent>

        <TabsContent value="classes">
          <ImportadorSQL
            tipo="classes"
            titulo="Importar Classes TPU"
            entityName="TabelaClasseCNJ"
          />
        </TabsContent>

        <TabsContent value="assuntos">
          <ImportadorSQL
            tipo="assuntos"
            titulo="Importar Assuntos TPU"
            entityName="TabelaAssuntoCNJ"
          />
        </TabsContent>

        <TabsContent value="documentos">
          <ImportadorSQL
            tipo="documentos"
            titulo="Importar Documentos Públicos"
            entityName="DocumentoPublico"
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
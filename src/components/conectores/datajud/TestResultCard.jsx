import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import { toast } from 'sonner';

export default function TestResultCard({ result }) {
  const [copied, setCopied] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    request: false,
    response: false,
    schema: false
  });

  const handleCopy = async (content, label) => {
    try {
      await navigator.clipboard.writeText(
        typeof content === 'string' ? content : JSON.stringify(content, null, 2)
      );
      setCopied(label);
      toast.success(`${label} copiado`);
      setTimeout(() => setCopied(null), 2000);
    } catch (error) {
      toast.error('Erro ao copiar');
    }
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (!result) return null;

  const { success, latencia, processo, schema, dados_completos, erro, endpoint_alias, cnj, query_body, endpoint_url } = result;

  // Construir URL sempre que possível
  const finalUrl = endpoint_url || 
    (endpoint_alias ? `https://api-publica.datajud.cnj.jus.br/${endpoint_alias}/_search` : null) ||
    (result.dados?.endpoint_alias ? `https://api-publica.datajud.cnj.jus.br/${result.dados.endpoint_alias}/_search` : null) ||
    'https://api-publica.datajud.cnj.jus.br/[endpoint]/_search';

  const requestPayload = {
    method: 'POST',
    url: finalUrl,
    headers: {
      'Authorization': 'APIKey [DATAJUD_API_TOKEN]',
      'Content-Type': 'application/json'
    },
    body: query_body || { query: { match_all: {} }, size: 1 }
  };

  const curlCommand = `curl -X POST '${requestPayload.url}' \\
  -H 'Authorization: APIKey [DATAJUD_API_TOKEN]' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(requestPayload.body)}'`;

  return (
    <div className={`rounded-lg border ${success ? 'bg-green-50 border-green-300' : 'bg-red-50 border-red-300'}`}>
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-3">
        {success ? (
          <CheckCircle2 className="w-6 h-6 text-green-700" />
        ) : (
          <XCircle className="w-6 h-6 text-red-700" />
        )}
        <div className="flex-1">
          <h3 className="font-semibold text-sm">
            {success ? '✅ Processo Encontrado' : '❌ Falha no Teste'}
          </h3>
          {latencia && (
            <p className="text-xs text-gray-600">Latência: {latencia}ms</p>
          )}
        </div>
        {success && (
          <Badge className="bg-green-600">200 OK</Badge>
        )}
      </div>

      {/* Request Details */}
      <div className="p-4 border-b">
        <button
          onClick={() => toggleSection('request')}
          className="flex items-center justify-between w-full text-left"
        >
          <span className="font-medium text-sm">📤 Requisição</span>
          {expandedSections.request ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        
        {expandedSections.request && (
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Método</span>
              </div>
              <Badge className="bg-blue-600">POST</Badge>
            </div>
            
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">URL</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(requestPayload.url, 'URL')}
                >
                  {copied === 'URL' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <code className="text-xs bg-gray-900 text-green-400 px-2 py-1 rounded block overflow-x-auto">
                {requestPayload.url}
              </code>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">cURL</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(curlCommand, 'cURL')}
                >
                  {copied === 'cURL' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto">
                {curlCommand}
              </pre>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-700">Body (JSON)</span>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleCopy(requestPayload.body, 'Request Body')}
                >
                  {copied === 'Request Body' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
              </div>
              <pre className="text-xs bg-gray-900 text-blue-300 p-3 rounded overflow-x-auto">
                {JSON.stringify(requestPayload.body, null, 2)}
              </pre>
            </div>
          </div>
        )}
      </div>

      {/* Process Data */}
      {success && processo && (
        <div className="p-4 border-b">
          <h4 className="font-medium text-sm mb-2">📋 Dados do Processo</h4>
          <div className="space-y-1 text-xs bg-white p-3 rounded border">
            <div><strong>Número:</strong> {processo.numero}</div>
            <div><strong>Classe:</strong> {processo.classe}</div>
            <div><strong>Assunto:</strong> {processo.assunto}</div>
            <div><strong>Órgão Julgador:</strong> {processo.orgao_julgador}</div>
            <div><strong>Tribunal:</strong> {processo.tribunal}</div>
            <div><strong>Grau:</strong> {processo.grau}</div>
            {processo.data_ajuizamento && (
              <div><strong>Data Ajuizamento:</strong> {processo.data_ajuizamento}</div>
            )}
          </div>
        </div>
      )}

      {/* Full Response */}
      {success && dados_completos && (
        <div className="p-4 border-b">
          <button
            onClick={() => toggleSection('response')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-sm">📦 Resposta Completa</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(dados_completos, 'Resposta');
                }}
              >
                {copied === 'Resposta' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
              {expandedSections.response ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>
          
          {expandedSections.response && (
            <pre className="mt-2 p-3 bg-gray-900 text-gray-100 rounded text-xs overflow-auto max-h-96">
              {JSON.stringify(dados_completos, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Schema */}
      {success && schema && (
        <div className="p-4">
          <button
            onClick={() => toggleSection('schema')}
            className="flex items-center justify-between w-full text-left"
          >
            <span className="font-medium text-sm">🔧 Schema (Salvo em TesteEndpoint)</span>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy(schema, 'Schema');
                }}
              >
                {copied === 'Schema' ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              </Button>
              {expandedSections.schema ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </div>
          </button>
          
          {expandedSections.schema && (
            <pre className="mt-2 p-3 bg-purple-900 text-purple-100 rounded text-xs overflow-auto max-h-64">
              {JSON.stringify(schema, null, 2)}
            </pre>
          )}
        </div>
      )}

      {/* Error */}
      {!success && erro && (
        <div className="p-4">
          <p className="text-xs text-red-700 font-mono">{erro}</p>
        </div>
      )}
    </div>
  );
}
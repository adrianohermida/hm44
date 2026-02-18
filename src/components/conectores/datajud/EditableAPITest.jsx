import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Loader2, Play, Copy, Check, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { base44 } from '@/api/base44Client';
import TestResultCard from './TestResultCard';
import BuscaCNJExistente from './BuscaCNJExistente';
import AdicionarResultadoProcesso from './AdicionarResultadoProcesso';
import CNJParser from '@/components/utils/CNJParser';
import BuscaCNJAutocomplete from './BuscaCNJAutocomplete';

export default function EditableAPITest({ cnj, endpointAlias, escritorioId }) {
  const [testando, setTestando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [copied, setCopied] = useState(false);
  const [queryType, setQueryType] = useState('numeroProcesso');
  const [editandoJSON, setEditandoJSON] = useState(false);
  
  // Parse inicial do CNJ para obter endpoint correto
  const initialParsedCNJ = cnj && cnj.length >= 20 ? CNJParser.parse(cnj) : null;
  const endpointLimpo = initialParsedCNJ?.datajud?.alias || endpointAlias?.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/_search$/, '') || '';
  const urlInicial = endpointLimpo ? `https://api-publica.datajud.cnj.jus.br/${endpointLimpo}/_search` : '';
  
  const [editableRequest, setEditableRequest] = useState({
    endpoint: endpointLimpo,
    numeroProcesso: cnj?.replace(/[^0-9]/g, '') || '',
    classeCodigo: '',
    orgaoJulgadorCodigo: '',
    assuntoCodigo: '',
    dataInicio: '',
    dataFim: '',
    parteNome: '',
    advogadoNome: '',
    size: '10',
    searchAfter: '',
    customQuery: '',
    urlCompleta: urlInicial,
    bodyManual: '',
    tribunalInfo: initialParsedCNJ?.datajud || null,
    customHeaders: ''
  });

  // Auto-parsear CNJ quando digitado
  useEffect(() => {
    if (cnj && cnj.length >= 20) {
      const parsed = CNJParser.parse(cnj);
      if (parsed.valido && parsed.datajud) {
        setEditableRequest(prev => ({
          ...prev,
          endpoint: parsed.datajud.alias,
          urlCompleta: `https://api-publica.datajud.cnj.jus.br/${parsed.datajud.alias}/_search`,
          numeroProcesso: cnj.replace(/\D/g, ''),
          tribunalInfo: parsed.datajud,
          bodyManual: '' // Limpa body manual para forçar rebuild
        }));
      }
    }
  }, [cnj]);

  const buildQueryBody = React.useCallback(() => {
    // Se tem body manual editado, usa ele
    if (editableRequest.bodyManual && editableRequest.bodyManual.trim()) {
      try {
        return JSON.parse(editableRequest.bodyManual);
      } catch {
        // JSON inválido, continua para build automático
      }
    }

    if (queryType === 'custom' && editableRequest.customQuery) {
      try {
        return JSON.parse(editableRequest.customQuery);
      } catch {
        return { size: 10, query: { match_all: {} } };
      }
    }

    const body = { size: parseInt(editableRequest.size) || 10 };

    if (queryType === 'numeroProcesso' && editableRequest.numeroProcesso) {
      const numeroLimpo = editableRequest.numeroProcesso.replace(/\D/g, '');
      body.query = { match: { numeroProcesso: numeroLimpo } };
      return body; // Return direto quando tem numero processo
    }

    if (queryType === 'classeOrgao') {
      const mustClauses = [];
      if (editableRequest.classeCodigo) {
        mustClauses.push({ match: { "classe.codigo": parseInt(editableRequest.classeCodigo) } });
      }
      if (editableRequest.orgaoJulgadorCodigo) {
        mustClauses.push({ match: { "orgaoJulgador.codigo": parseInt(editableRequest.orgaoJulgadorCodigo) } });
      }
      if (mustClauses.length > 0) {
        body.query = { bool: { must: mustClauses } };
      }
    } else if (queryType === 'assunto' && editableRequest.assuntoCodigo) {
      body.query = { match: { "assuntos.codigo": parseInt(editableRequest.assuntoCodigo) } };
    } else if (queryType === 'data') {
      if (editableRequest.dataInicio || editableRequest.dataFim) {
        body.query = {
          range: {
            dataAjuizamento: {
              ...(editableRequest.dataInicio && { gte: editableRequest.dataInicio }),
              ...(editableRequest.dataFim && { lte: editableRequest.dataFim })
            }
          }
        };
      }
    } else if (queryType === 'parte' && editableRequest.parteNome) {
      body.query = {
        multi_match: {
          query: editableRequest.parteNome,
          fields: ["movimentos.partes.nome", "envolvidos.nome"],
          type: "phrase_prefix"
        }
      };
    } else if (queryType === 'advogado' && editableRequest.advogadoNome) {
      body.query = { match: { "movimentos.partes.advogados.nome": editableRequest.advogadoNome } };
    }

    if (editableRequest.searchAfter) {
      try {
        body.search_after = JSON.parse(editableRequest.searchAfter);
        body.sort = [{ "@timestamp": { order: "asc" } }];
      } catch {}
    }

    if (!body.query) {
      body.query = { match_all: {} };
    }

    return body;
  }, [editableRequest, queryType]);

  const validarJSON = (jsonString) => {
    try {
      JSON.parse(jsonString);
      return true;
    } catch {
      return false;
    }
  };

  const handleTest = async () => {
    // Validação de endpoint
    if (!editableRequest.endpoint || editableRequest.endpoint === '[endpoint]' || editableRequest.endpoint.trim() === '') {
      toast.error('❌ Endpoint vazio. Digite um CNJ válido ou selecione o tribunal.');
      return;
    }

    // Validação do número do processo
    if (queryType === 'numeroProcesso' && !editableRequest.numeroProcesso) {
      toast.error('❌ Número do processo obrigatório para este tipo de consulta');
      return;
    }

    // Validação da URL completa
    if (!editableRequest.urlCompleta || editableRequest.urlCompleta.includes('[endpoint]')) {
      toast.error('❌ URL inválida. Endpoint não foi resolvido corretamente.');
      return;
    }

    // Validação do JSON
    let bodyFinal;
    try {
      bodyFinal = buildQueryBody();
      
      if (!bodyFinal.query) {
        toast.error('❌ Query obrigatória no body JSON');
        return;
      }
    } catch (e) {
      toast.error('❌ JSON inválido no body: ' + e.message);
      return;
    }

    // Validação de headers customizados
    let headersCustomizados = null;
    if (editableRequest.customHeaders) {
      try {
        headersCustomizados = JSON.parse(editableRequest.customHeaders);
      } catch (e) {
        toast.error('❌ Headers JSON inválido: ' + e.message);
        return;
      }
    }

    setTestando(true);
    try {
      const response = await base44.functions.invoke('testarEndpointDatajud', {
        endpoint_alias: editableRequest.endpoint,
        query_body: bodyFinal,
        custom_headers: headersCustomizados
      });

      const urlCompleta = editableRequest.urlCompleta;
      
      setResultado({
        ...response.data,
        endpoint_alias: editableRequest.endpoint,
        endpoint_url: urlCompleta,
        query_body: bodyFinal,
        custom_headers: headersCustomizados
      });
      
      if (response.data.success) {
        const count = response.data.total_encontrado || 0;
        toast.success(`✅ ${count} processo(s) encontrado(s)`);
      } else {
        toast.error('❌ ' + (response.data.erro || 'Erro na consulta'));
      }
    } catch (error) {
      toast.error('❌ Erro ao executar: ' + error.message);
      setResultado({ success: false, erro: error.message, endpoint_url: editableRequest.urlCompleta });
    } finally {
      setTestando(false);
    }
  };

  const bodyJSON = buildQueryBody();

  const handleCopyBody = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify(bodyJSON, null, 2));
      setCopied(true);
      toast.success('Body copiado');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleCopyCURL = async () => {
    const curl = `curl -X POST '${editableRequest.urlCompleta}' \\
  -H 'Authorization: APIKey [DATAJUD_API_TOKEN]' \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(bodyJSON)}'`;
    
    try {
      await navigator.clipboard.writeText(curl);
      toast.success('cURL copiado');
    } catch {
      toast.error('Erro ao copiar');
    }
  };

  const handleCarregarTemplate = () => {
    const templates = {
      numeroProcesso: { numeroProcesso: '00008856582023826029', size: '10' },
      classeOrgao: { classeCodigo: '1116', orgaoJulgadorCodigo: '13597', size: '100' },
      assunto: { assuntoCodigo: '5003', size: '50' },
      data: { dataInicio: '2023-01-01', dataFim: '2023-12-31', size: '100' },
      parte: { parteNome: 'João da Silva', size: '20' },
      advogado: { advogadoNome: 'Dr. Maria Santos', size: '20' }
    };
    
    setEditableRequest({ ...editableRequest, ...templates[queryType] });
    toast.success('Template carregado');
  };

  const isJSONValido = validarJSON(editableRequest.bodyManual || JSON.stringify(bodyJSON, null, 2));

  return (
    <div className="space-y-4">
      <BuscaCNJExistente 
        onSelect={(cnjSelecionado) => {
          const parsed = CNJParser.parse(cnjSelecionado);
          if (parsed.valido && parsed.datajud) {
            setEditableRequest({ 
              ...editableRequest, 
              numeroProcesso: cnjSelecionado.replace(/[^0-9]/g, ''),
              endpoint: parsed.datajud.alias,
              urlCompleta: `https://api-publica.datajud.cnj.jus.br/${parsed.datajud.alias}/_search`,
              tribunalInfo: parsed.datajud
            });
          } else {
            setEditableRequest({ 
              ...editableRequest, 
              numeroProcesso: cnjSelecionado.replace(/[^0-9]/g, '') 
            });
          }
          setQueryType('numeroProcesso');
        }}
        escritorioId={escritorioId}
      />
      
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
        <h4 className="font-semibold text-sm">⚙️ Configurar Requisição</h4>
        
        <div className="grid gap-3">
          <div>
            <Label className="text-xs">Endpoint Tribunal</Label>
            <div className="flex gap-2">
              <Input
                value={editableRequest.endpoint}
                onChange={(e) => {
                  const valor = e.target.value.replace(/^https?:\/\/[^\/]+\//, '').replace(/\/_search$/, '');
                  setEditableRequest({ 
                    ...editableRequest, 
                    endpoint: valor,
                    urlCompleta: `https://api-publica.datajud.cnj.jus.br/${valor}/_search`
                  });
                }}
                placeholder="api_publica_tjsp"
                className={`font-mono text-xs ${!editableRequest.endpoint || editableRequest.endpoint === '[endpoint]' ? 'border-red-500' : ''}`}
              />
              {editableRequest.tribunalInfo && (
                <Badge variant="outline" className="whitespace-nowrap">
                  {editableRequest.tribunalInfo.name}
                </Badge>
              )}
            </div>
            {(!editableRequest.endpoint || editableRequest.endpoint === '[endpoint]') && (
              <p className="text-xs text-red-600 mt-1">⚠️ Digite um CNJ válido para obter o endpoint automaticamente</p>
            )}
          </div>

          <div>
            <Label className="text-xs">Tipo de Consulta</Label>
            <Select value={queryType} onValueChange={setQueryType}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="numeroProcesso">Número do Processo</SelectItem>
                <SelectItem value="classeOrgao">Classe + Órgão</SelectItem>
                <SelectItem value="assunto">Assunto</SelectItem>
                <SelectItem value="data">Intervalo de Datas</SelectItem>
                <SelectItem value="parte">Nome de Parte</SelectItem>
                <SelectItem value="advogado">Nome de Advogado</SelectItem>
                <SelectItem value="custom">JSON Customizado</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {queryType === 'numeroProcesso' && (
            <div>
              <Label className="text-xs">Número do Processo (CNJ com Autocomplete)</Label>
              <BuscaCNJAutocomplete
                value={CNJParser.format(editableRequest.numeroProcesso) || editableRequest.numeroProcesso}
                onChange={(value) => {
                  const parsed = CNJParser.parse(value);
                  if (parsed.valido && parsed.datajud) {
                    setEditableRequest(prev => ({
                      ...prev,
                      numeroProcesso: value.replace(/\D/g, ''),
                      endpoint: parsed.datajud.alias,
                      urlCompleta: `https://api-publica.datajud.cnj.jus.br/${parsed.datajud.alias}/_search`,
                      tribunalInfo: parsed.datajud,
                      bodyManual: '' // Limpa body manual
                    }));
                  } else {
                    setEditableRequest(prev => ({ 
                      ...prev, 
                      numeroProcesso: value.replace(/\D/g, ''),
                      bodyManual: '' // Limpa body manual
                    }));
                  }
                }}
                placeholder="Digite o CNJ (com autocomplete de processos recentes)"
              />
              {editableRequest.numeroProcesso && editableRequest.numeroProcesso.length !== 20 && (
                <p className="text-xs text-orange-600 mt-1">
                  ⚠️ {editableRequest.numeroProcesso.length}/20 dígitos
                </p>
              )}
            </div>
          )}

          {queryType === 'classeOrgao' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Classe Código</Label>
                <Input
                  type="number"
                  value={editableRequest.classeCodigo}
                  onChange={(e) => setEditableRequest({ ...editableRequest, classeCodigo: e.target.value })}
                  placeholder="1116"
                  className="font-mono text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Órgão Julgador Código</Label>
                <Input
                  type="number"
                  value={editableRequest.orgaoJulgadorCodigo}
                  onChange={(e) => setEditableRequest({ ...editableRequest, orgaoJulgadorCodigo: e.target.value })}
                  placeholder="13597"
                  className="font-mono text-xs"
                />
              </div>
            </div>
          )}

          {queryType === 'assunto' && (
            <div>
              <Label className="text-xs">Código do Assunto</Label>
              <Input
                type="number"
                value={editableRequest.assuntoCodigo}
                onChange={(e) => setEditableRequest({ ...editableRequest, assuntoCodigo: e.target.value })}
                placeholder="5003"
                className="font-mono text-xs"
              />
            </div>
          )}

          {queryType === 'data' && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Label className="text-xs">Data Início</Label>
                <Input
                  type="date"
                  value={editableRequest.dataInicio}
                  onChange={(e) => setEditableRequest({ ...editableRequest, dataInicio: e.target.value })}
                  className="text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Data Fim</Label>
                <Input
                  type="date"
                  value={editableRequest.dataFim}
                  onChange={(e) => setEditableRequest({ ...editableRequest, dataFim: e.target.value })}
                  className="text-xs"
                />
              </div>
            </div>
          )}

          {queryType === 'parte' && (
            <div>
              <Label className="text-xs">Nome da Parte</Label>
              <Input
                value={editableRequest.parteNome}
                onChange={(e) => setEditableRequest({ ...editableRequest, parteNome: e.target.value })}
                placeholder="João da Silva"
                className="text-xs"
              />
            </div>
          )}

          {queryType === 'advogado' && (
            <div>
              <Label className="text-xs">Nome do Advogado</Label>
              <Input
                value={editableRequest.advogadoNome}
                onChange={(e) => setEditableRequest({ ...editableRequest, advogadoNome: e.target.value })}
                placeholder="Dr. Maria Santos"
                className="text-xs"
              />
            </div>
          )}

          {queryType === 'custom' && (
            <div>
              <Label className="text-xs">Query JSON Customizada</Label>
              <Textarea
                value={editableRequest.customQuery}
                onChange={(e) => setEditableRequest({ ...editableRequest, customQuery: e.target.value })}
                placeholder='{"query": {"match_all": {}}, "size": 10}'
                rows={8}
                className="font-mono text-xs"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label className="text-xs">Size (resultados/página)</Label>
              <Input
                type="number"
                value={editableRequest.size}
                onChange={(e) => setEditableRequest({ ...editableRequest, size: e.target.value })}
                min="1"
                max="10000"
                className="text-xs"
              />
            </div>
            <div>
              <Label className="text-xs">Search After (paginação)</Label>
              <Input
                value={editableRequest.searchAfter}
                onChange={(e) => setEditableRequest({ ...editableRequest, searchAfter: e.target.value })}
                placeholder="[1681366085550]"
                className="font-mono text-xs"
              />
            </div>
          </div>

          {queryType !== 'custom' && (
            <Button onClick={handleCarregarTemplate} variant="outline" size="sm" className="w-full">
              Carregar Template de Exemplo
            </Button>
          )}

          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-xs font-semibold">URL Completa (Editável)</Label>
              <Button size="sm" variant="ghost" onClick={() => {
                navigator.clipboard.writeText(editableRequest.urlCompleta);
                toast.success('URL copiada');
              }}>
                <Copy className="w-3 h-3" />
              </Button>
            </div>
            <Input
              value={editableRequest.urlCompleta}
              onChange={(e) => {
                const novaUrl = e.target.value;
                const alias = novaUrl.replace('https://api-publica.datajud.cnj.jus.br/', '').replace('/_search', '').trim();
                setEditableRequest({ ...editableRequest, urlCompleta: novaUrl, endpoint: alias });
              }}
              className="font-mono text-xs bg-yellow-50 border-yellow-300"
              placeholder="https://api-publica.datajud.cnj.jus.br/api_publica_tjsp/_search"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Label className="text-xs font-semibold">Body JSON (Editável)</Label>
                {isJSONValido ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
              </div>
              <div className="flex gap-1">
                <Button size="sm" variant="outline" onClick={() => setEditandoJSON(!editandoJSON)}>
                  {editandoJSON ? 'Preview' : 'Editar'}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCopyBody}>
                  {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCopyCURL}>
                  cURL
                </Button>
              </div>
            </div>
            
            {!isJSONValido && (
              <div className="bg-red-50 border border-red-200 rounded p-2 mb-2">
                <p className="text-xs text-red-700">⚠️ JSON inválido. Corrija antes de executar.</p>
              </div>
            )}

            {editandoJSON || queryType === 'custom' ? (
              <Textarea
                value={editableRequest.bodyManual || JSON.stringify(bodyJSON, null, 2)}
                onChange={(e) => setEditableRequest({ ...editableRequest, bodyManual: e.target.value })}
                rows={12}
                className="font-mono text-xs bg-gray-900 text-green-400 p-3"
              />
            ) : (
              <pre className="text-xs bg-gray-900 text-green-400 p-3 rounded overflow-x-auto max-h-64">
                {JSON.stringify(bodyJSON, null, 2)}
              </pre>
            )}
          </div>

          <div>
            <Label className="text-xs font-semibold">Headers Customizados (Opcional)</Label>
            <Textarea
              value={editableRequest.customHeaders}
              onChange={(e) => setEditableRequest({ ...editableRequest, customHeaders: e.target.value })}
              placeholder='{"X-Custom-Header": "valor"}'
              rows={3}
              className="font-mono text-xs"
            />
            <p className="text-xs text-gray-500 mt-1">
              JSON opcional para sobrescrever headers padrão
            </p>
          </div>
        </div>

        <Button 
          onClick={handleTest}
          disabled={testando || !editableRequest.endpoint || !isJSONValido}
          className="w-full"
        >
          {testando ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Executando API Real...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Executar Teste DataJud
            </>
          )}
        </Button>
      </div>

      {resultado && (
        <>
          <TestResultCard result={resultado} />
          {resultado.success && resultado.dados?.hits?.hits?.length > 0 && (
            <AdicionarResultadoProcesso 
              dadosDatajud={resultado.dados}
              escritorioId={escritorioId}
            />
          )}
        </>
      )}
    </div>
  );
}
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Key, MapPin, CreditCard } from 'lucide-react';
import ChannelInfoCard from './ChannelInfoCard';
import IDCopyButton from '@/components/common/IDCopyButton';

export default function EndpointInfoPanel({ endpoint, provedor }) {
  const parametros = endpoint.parametros || [];
  const apiKeyConfig = provedor?.api_key_config || {};
  
  const getLocationBadge = (localizacao) => {
    const config = {
      query: { icon: '🔗', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' },
      header: { icon: '📤', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' },
      body: { icon: '📦', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' },
      path: { icon: '🛣️', color: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200' }
    };
    const cfg = config[localizacao] || config.query;
    return (
      <Badge variant="outline" className={`text-xs ${cfg.color}`}>
        {cfg.icon} {localizacao}
      </Badge>
    );
  };

  const authLocation = apiKeyConfig.query_param_name ? 'query' : 'header';
  const authParamName = apiKeyConfig.query_param_name || apiKeyConfig.header_name || 'Authorization';
  const secretMasked = '***Xy7a';

  const exampleValues = parametros.reduce((acc, p) => {
    acc[p.nome] = p.exemplo || `example_${p.nome}`;
    return acc;
  }, {});

  const buildExampleCall = () => {
    let baseUrl = endpoint.versao_api === 'V2' ? provedor?.base_url_v2 : provedor?.base_url_v1;
    
    if (!baseUrl) {
      return { url: 'Base URL não configurada', headers: {}, body: null };
    }

    // Remover trailing slash
    baseUrl = baseUrl.replace(/\/$/, '');

    // Construir path
    let path = endpoint.path || '';
    if (!path.startsWith('/')) {
      path = '/' + path;
    }

    // Substituir path params
    const pathParams = parametros.filter(p => p.localizacao === 'path');
    pathParams.forEach(p => {
      const valor = exampleValues[p.nome];
      path = path.replace(`{${p.nome}}`, valor);
    });

    let url = baseUrl + path;
    const queryParams = [];
    const headers = {};
    let body = null;

    // Adicionar autenticação
    if (authLocation === 'query') {
      queryParams.push(`${authParamName}=${secretMasked}`);
    } else {
      const prefix = apiKeyConfig.prefix || 'Bearer';
      headers[authParamName] = `${prefix} ${secretMasked}`;
    }

    // Processar query params
    parametros.filter(p => p.localizacao === 'query').forEach(p => {
      const valor = exampleValues[p.nome];
      if (valor) queryParams.push(`${p.nome}=${valor}`);
    });

    // Headers
    parametros.filter(p => p.localizacao === 'header').forEach(p => {
      headers[p.nome] = exampleValues[p.nome];
    });

    // Body
    parametros.filter(p => p.localizacao === 'body').forEach(p => {
      if (!body) body = {};
      body[p.nome] = exampleValues[p.nome];
    });

    if (queryParams.length > 0) {
      url += `?${queryParams.join('&')}`;
    }

    return { url, headers, body };
  };

  const example = buildExampleCall();

  return (
    <div className="space-y-4">
      <IDCopyButton id={endpoint.id} label="Endpoint ID" />
      <ChannelInfoCard provedor={provedor} />
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Custo / Quota
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {endpoint.creditos_consumidos > 0 && (
            <div>
              <div className="text-xs text-[var(--text-tertiary)]">Créditos</div>
              <div className="text-xl font-bold text-[var(--brand-primary)]">
                {endpoint.creditos_consumidos}
              </div>
            </div>
          )}
          {endpoint.custo_quota && (
            <div>
              <div className="text-xs text-[var(--text-tertiary)]">Quota (YouTube/Google)</div>
              <div className="text-xl font-bold text-blue-600">
                {endpoint.custo_quota} unidades
              </div>
              <div className="text-[10px] text-[var(--text-tertiary)] mt-1">
                Limite diário: 10.000 unidades
              </div>
            </div>
          )}
          {!endpoint.creditos_consumidos && !endpoint.custo_quota && (
            <div className="text-xs text-[var(--text-tertiary)]">
              Sem custo configurado
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Key className="w-4 h-4" />
            Autenticação
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-center justify-between p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
            <span className="text-xs font-medium">Localização:</span>
            {getLocationBadge(authLocation)}
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
            <span className="text-xs font-medium">Parâmetro:</span>
            <code className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded">
              {authParamName}
            </code>
          </div>
          <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
            <span className="text-xs font-medium">Secret:</span>
            <code className="text-xs bg-yellow-100 dark:bg-yellow-900 px-2 py-0.5 rounded text-yellow-800 dark:text-yellow-200">
              {secretMasked}
            </code>
          </div>
          {apiKeyConfig.prefix && (
            <div className="flex items-center justify-between p-2 bg-slate-50 dark:bg-slate-800 rounded">
              <span className="text-xs font-medium">Prefixo:</span>
              <code className="text-xs">{apiKeyConfig.prefix}</code>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Parâmetros ({parametros.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {parametros.length === 0 ? (
            <p className="text-xs text-[var(--text-tertiary)] text-center py-4">
              Nenhum parâmetro configurado
            </p>
          ) : (
            <div className="space-y-2">
              {parametros.map((param, idx) => (
                <div 
                  key={idx}
                  className="p-3 border rounded-lg space-y-2 bg-[var(--bg-secondary)]"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-semibold">{param.nome}</code>
                      {param.obrigatorio && (
                        <Badge variant="destructive" className="text-xs">Obrigatório</Badge>
                      )}
                    </div>
                    {getLocationBadge(param.localizacao || 'query')}
                  </div>
                  {param.descricao && (
                    <p className="text-xs text-[var(--text-secondary)]">{param.descricao}</p>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-[var(--text-tertiary)]">Tipo:</span>{' '}
                      <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">{param.tipo}</code>
                    </div>
                    {param.exemplo && (
                      <div>
                        <span className="text-[var(--text-tertiary)]">Exemplo:</span>{' '}
                        <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">{param.exemplo}</code>
                      </div>
                    )}
                  </div>
                  {param.valor_padrao && (
                    <div className="text-xs">
                      <span className="text-[var(--text-tertiary)]">Padrão:</span>{' '}
                      <code className="bg-slate-200 dark:bg-slate-700 px-1 rounded">{param.valor_padrao}</code>
                    </div>
                  )}
                  {param.opcoes_validas && param.opcoes_validas.length > 0 && (
                    <div className="text-xs">
                      <span className="text-[var(--text-tertiary)]">Opções:</span>{' '}
                      <div className="flex flex-wrap gap-1 mt-1">
                        {param.opcoes_validas.map((opt, i) => (
                          <Badge key={i} variant="outline" className="text-xs">
                            {opt}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center gap-2">
            <Code className="w-4 h-4" />
            Exemplo de Chamada Completa
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">URL</p>
            <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto select-all">
              {example.url}
            </pre>
          </div>
          
          {Object.keys(example.headers).length > 0 && (
            <div>
              <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">Headers</p>
              <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto select-all">
                {JSON.stringify(example.headers, null, 2)}
              </pre>
            </div>
          )}
          
          {example.body && (
            <div>
              <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">Body</p>
              <pre className="bg-slate-900 text-slate-100 p-2 rounded text-xs overflow-x-auto select-all">
                {JSON.stringify(example.body, null, 2)}
              </pre>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold mb-1 text-[var(--text-secondary)]">cURL Completo</p>
            <pre className="bg-slate-900 text-slate-100 p-3 rounded text-xs overflow-x-auto select-all">
{`curl -X ${endpoint.metodo} '${example.url}'${Object.entries(example.headers).map(([k, v]) => ` \\\n  -H '${k}: ${v}'`).join('')}${example.body ? ` \\\n  -d '${JSON.stringify(example.body)}'` : ''}`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
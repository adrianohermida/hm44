import React from 'react';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, AlertTriangle, Clock } from 'lucide-react';

export default function TesteResultStatus({ status, httpStatus }) {
  const configs = {
    SUCESSO: { icon: CheckCircle2, color: 'bg-green-500/20 text-green-700 border-green-300', label: 'Sucesso' },
    ERRO: { icon: XCircle, color: 'bg-red-500/20 text-red-700 border-red-300', label: 'Erro' },
    TIMEOUT: { icon: Clock, color: 'bg-amber-500/20 text-amber-700 border-amber-300', label: 'Timeout' },
  };

  const config = configs[status] || configs.ERRO;
  const Icon = config.icon;

  // HTTP status color logic
  const getHttpStatusColor = (code) => {
    if (!code) return 'border-slate-300 text-slate-600';
    if (code >= 200 && code < 300) return 'border-green-300 text-green-700 bg-green-50';
    if (code >= 300 && code < 400) return 'border-blue-300 text-blue-700 bg-blue-50';
    if (code >= 400 && code < 500) return 'border-amber-300 text-amber-700 bg-amber-50';
    if (code >= 500) return 'border-red-300 text-red-700 bg-red-50';
    return 'border-slate-300 text-slate-600';
  };

  const getHttpStatusLabel = (code) => {
    const labels = {
      200: '200 OK',
      201: '201 Created',
      204: '204 No Content',
      400: '400 Bad Request',
      401: '401 Unauthorized',
      403: '403 Forbidden',
      404: '404 Not Found',
      422: '422 Unprocessable',
      429: '429 Rate Limit',
      500: '500 Server Error',
      502: '502 Bad Gateway',
      503: '503 Unavailable',
      504: '504 Timeout',
    };
    return labels[code] || `${code}`;
  };

  return (
    <div className="flex items-center gap-2">
      <Badge className={`${config.color} border`} variant="outline">
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </Badge>
      {httpStatus && (
        <Badge 
          variant="outline" 
          className={`font-mono ${getHttpStatusColor(httpStatus)}`}
        >
          {getHttpStatusLabel(httpStatus)}
        </Badge>
      )}
    </div>
  );
}
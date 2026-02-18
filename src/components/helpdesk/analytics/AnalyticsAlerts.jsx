import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { AlertTriangle, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function AnalyticsAlerts({ alertas }) {
  if (!alertas.slaProximoExpirar && !alertas.semResposta4h) {
    return null;
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <AlertTriangle className="w-5 h-5" />
          Alertas Inteligentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {alertas.slaProximoExpirar > 0 && (
          <Link 
            to={createPageUrl('Helpdesk')}
            className="flex items-center gap-2 p-2 bg-white rounded hover:bg-orange-100"
          >
            <Clock className="w-4 h-4 text-orange-600" />
            <span className="text-sm">
              <strong>{alertas.slaProximoExpirar}</strong> ticket{alertas.slaProximoExpirar > 1 ? 's' : ''} com SLA próximo de expirar
            </span>
          </Link>
        )}

        {alertas.semResposta4h > 0 && (
          <Link 
            to={createPageUrl('Helpdesk')}
            className="flex items-center gap-2 p-2 bg-white rounded hover:bg-orange-100"
          >
            <AlertTriangle className="w-4 h-4 text-orange-600" />
            <span className="text-sm">
              <strong>{alertas.semResposta4h}</strong> ticket{alertas.semResposta4h > 1 ? 's' : ''} sem resposta há mais de 4h
            </span>
          </Link>
        )}
      </CardContent>
    </Card>
  );
}
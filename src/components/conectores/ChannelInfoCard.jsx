import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Youtube, User } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export default function ChannelInfoCard({ provedor }) {
  if (!provedor?.schemas_resposta_exemplos) return null;

  const { channel_id, for_username } = provedor.schemas_resposta_exemplos;
  
  if (!channel_id && !for_username) return null;

  return (
    <Card className="bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800">
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Youtube className="w-4 h-4 text-red-600" />
          Canal YouTube Configurado
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {channel_id && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Channel ID:</span>
            <code className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border font-mono">
              {channel_id}
            </code>
          </div>
        )}
        {for_username && (
          <div className="flex items-center justify-between">
            <span className="text-xs text-[var(--text-secondary)]">Username:</span>
            <code className="text-xs bg-white dark:bg-slate-800 px-2 py-1 rounded border font-mono">
              {for_username}
            </code>
          </div>
        )}
        <div className="text-[10px] text-[var(--text-tertiary)] pt-2 border-t">
          Valores padrão herdados por todos endpoints
        </div>
      </CardContent>
    </Card>
  );
}
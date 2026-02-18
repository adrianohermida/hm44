import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, RefreshCw } from 'lucide-react';

export default function CalendarSyncCard({ onSync, syncing, lastSync }) {
  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-[var(--brand-primary-100)] rounded-lg flex items-center justify-center flex-shrink-0">
            <Calendar className="w-6 h-6 text-[var(--brand-primary-700)]" />
          </div>
          <div className="flex-1">
            <h3 className="font-bold text-[var(--text-primary)] mb-2">
              Sincronização Automática
            </h3>
            <p className="text-sm text-[var(--text-secondary)] mb-4">
              Sincronize audiências e compromissos automaticamente
            </p>
            {lastSync && (
              <p className="text-xs text-[var(--text-tertiary)] mb-3">
                Última sincronização: {new Date(lastSync).toLocaleString('pt-BR')}
              </p>
            )}
            <Button 
              onClick={onSync} 
              disabled={syncing}
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? 'Sincronizando...' : 'Sincronizar Agora'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileDown, BarChart3 } from 'lucide-react';
import ProcessoHeaderInfo from './ProcessoHeaderInfo';
import ProcessoModoVisualizacao from './ProcessoModoVisualizacao';
import ProcessoActionsMenu from './ProcessoActionsMenu';
import ProcessoRefreshButton from './ProcessoRefreshButton';
import ProcessoMonitorButton from './ProcessoMonitorButton';
import ProcessoAnalyticsPanel from './ProcessoAnalyticsPanel';

export default function ProcessoAppBar({ processo, modo, onModoChange, actions = {} }) {
  const [analyticsOpen, setAnalyticsOpen] = useState(false);
  
  if (!processo) return null;

  return (
    <>
      <div className="sticky top-0 z-10 bg-[var(--bg-primary)] border-b border-[var(--border-primary)]" role="banner">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-between py-3 gap-3">
            <div className="flex items-center gap-2 min-w-0 flex-1">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={actions?.onBack} 
                aria-label="Voltar para lista de processos" 
                className="flex-shrink-0"
                title="Atalho: ESC"
              >
                <ArrowLeft className="w-5 h-5" aria-hidden="true" />
              </Button>
              <ProcessoHeaderInfo processo={processo} />
            </div>

            <div className="hidden lg:flex">
              <ProcessoModoVisualizacao modo={modo} onModoChange={onModoChange} />
            </div>

            <div className="flex items-center gap-2">
              <ProcessoActionsMenu 
                actions={{...actions, onOpenAnalytics: () => setAnalyticsOpen(true)}} 
              />
            </div>
          </div>
        </div>
      </div>
      <ProcessoAnalyticsPanel processo={processo} open={analyticsOpen} onClose={() => setAnalyticsOpen(false)} />
    </>
  );
}
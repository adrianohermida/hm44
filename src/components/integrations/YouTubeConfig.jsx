import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function YouTubeConfig() {
  const [syncing, setSyncing] = useState(false);
  const [message, setMessage] = useState(null);

  const handleSync = async () => {
    setSyncing(true);
    setMessage(null);
    
    try {
      const result = await base44.functions.syncYouTubeShorts();
      
      if (result.success) {
        setMessage({ 
          type: 'success', 
          text: `${result.synced} shorts sincronizados com sucesso!` 
        });
      } else {
        setMessage({ 
          type: 'error', 
          text: result.error || 'Erro na sincronização' 
        });
      }
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    }
    
    setSyncing(false);
  };

  return (
    <div className="space-y-4">
      {message && (
        <Alert className={message.type === 'success' ? 'border-[var(--brand-success)] bg-green-50' : 'border-red-200 bg-red-50'}>
          {message.type === 'success' 
            ? <CheckCircle className="h-4 w-4 text-[var(--brand-success)]" /> 
            : <AlertCircle className="h-4 w-4 text-red-600" />}
          <AlertDescription className={message.type === 'success' ? 'text-green-800' : 'text-red-800'}>
            {message.text}
          </AlertDescription>
        </Alert>
      )}
      
      <Button 
        onClick={handleSync} 
        disabled={syncing}
        className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
      >
        <RefreshCw className={`w-4 h-4 mr-2 ${syncing ? 'animate-spin' : ''}`} />
        {syncing ? 'Sincronizando...' : 'Sincronizar Shorts'}
      </Button>
    </div>
  );
}
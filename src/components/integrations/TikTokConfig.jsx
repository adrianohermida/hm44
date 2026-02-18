import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Music, AlertCircle, Info } from 'lucide-react';
import { useOAuthFlow } from '@/components/hooks/useOAuthFlow';

export default function TikTokConfig() {
  const { authorize, loading, error } = useOAuthFlow('tiktok');

  return (
    <div className="space-y-4">
      <Alert className="border-purple-200 bg-purple-50">
        <Info className="h-4 w-4 text-purple-600" />
        <AlertDescription className="text-purple-800 text-sm">
          Acesso a perfil e estatísticas básicas. Upload não disponível.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => authorize(['user.info.basic', 'user.info.stats', 'video.list'])}
        disabled={loading}
        className="w-full bg-black text-white hover:bg-gray-800"
      >
        <Music className="w-4 h-4 mr-2" />
        {loading ? 'Conectando...' : 'Autorizar TikTok'}
      </Button>
    </div>
  );
}
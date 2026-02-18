import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MessageSquare, AlertCircle } from 'lucide-react';
import { useOAuthFlow } from '@/components/hooks/useOAuthFlow';

export default function SlackConfig() {
  const { authorize, loading, error } = useOAuthFlow('slack');

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => authorize(['chat:write', 'channels:read', 'users:read'])}
        disabled={loading}
        className="w-full bg-[#4A154B] text-white hover:bg-[#611f69]"
      >
        <MessageSquare className="w-4 h-4 mr-2" />
        {loading ? 'Conectando...' : 'Autorizar Slack'}
      </Button>
    </div>
  );
}
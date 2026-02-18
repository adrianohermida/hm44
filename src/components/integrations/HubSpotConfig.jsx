import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Target, AlertCircle } from 'lucide-react';
import { useOAuthFlow } from '@/components/hooks/useOAuthFlow';

export default function HubSpotConfig() {
  const { authorize, loading, error } = useOAuthFlow('hubspot');

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => authorize(['crm.objects.contacts.read', 'crm.objects.contacts.write'])}
        disabled={loading}
        className="w-full bg-[#FF7A59] text-white hover:bg-[#ff5a30]"
      >
        <Target className="w-4 h-4 mr-2" />
        {loading ? 'Conectando...' : 'Autorizar HubSpot'}
      </Button>
    </div>
  );
}
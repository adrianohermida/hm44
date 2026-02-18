import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Linkedin, AlertCircle, Info } from 'lucide-react';
import { useOAuthFlow } from '@/components/hooks/useOAuthFlow';

export default function LinkedInConfig() {
  const { authorize, loading, error } = useOAuthFlow('linkedin');

  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          Publique conteúdo profissional e gerencie seu perfil.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => authorize(['openid', 'profile', 'w_member_social'])}
        disabled={loading}
        className="w-full bg-[#0A66C2] text-white hover:bg-[#004182]"
      >
        <Linkedin className="w-4 h-4 mr-2" />
        {loading ? 'Conectando...' : 'Autorizar LinkedIn'}
      </Button>
    </div>
  );
}
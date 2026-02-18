import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FileText, AlertCircle } from 'lucide-react';
import { useOAuthFlow } from '@/components/hooks/useOAuthFlow';

export default function GoogleDocsConfig() {
  const { authorize, loading, error } = useOAuthFlow('googledocs');

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => authorize(['https://www.googleapis.com/auth/documents'])}
        disabled={loading}
        className="w-full bg-[var(--brand-primary)]"
      >
        <FileText className="w-4 h-4 mr-2" />
        {loading ? 'Conectando...' : 'Autorizar Google Docs'}
      </Button>
    </div>
  );
}
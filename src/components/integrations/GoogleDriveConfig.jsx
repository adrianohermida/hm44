import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { FolderOpen, Info } from 'lucide-react';
import { useOAuthFlow } from '@/components/hooks/useOAuthFlow';

export default function GoogleDriveConfig() {
  const { authorize, loading, error } = useOAuthFlow('googledrive');

  return (
    <div className="space-y-4">
      <Alert className="border-blue-200 bg-blue-50">
        <Info className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800 text-sm">
          Acesso limitado a arquivos criados pelo app ou selecionados por você.
        </AlertDescription>
      </Alert>

      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => authorize(['https://www.googleapis.com/auth/drive.file'])}
        disabled={loading}
        className="w-full bg-[var(--brand-primary)]"
      >
        <FolderOpen className="w-4 h-4 mr-2" />
        {loading ? 'Conectando...' : 'Autorizar Google Drive'}
      </Button>
    </div>
  );
}
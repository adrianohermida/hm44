import React from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, AlertCircle } from 'lucide-react';
import { useOAuthFlow } from '@/components/hooks/useOAuthFlow';

export default function GoogleSheetsConfig() {
  const { authorize, loading, error } = useOAuthFlow('googlesheets');

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Button
        onClick={() => authorize(['https://www.googleapis.com/auth/spreadsheets'])}
        disabled={loading}
        className="w-full bg-[var(--brand-primary)]"
      >
        <Table className="w-4 h-4 mr-2" />
        {loading ? 'Conectando...' : 'Autorizar Google Sheets'}
      </Button>
    </div>
  );
}
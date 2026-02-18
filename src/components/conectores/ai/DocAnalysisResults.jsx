import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileJson, Key } from 'lucide-react';

export default function DocAnalysisResults({ resultado }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Análise Completa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div>
          <Badge>{resultado.endpoints?.length || 0} endpoints</Badge>
        </div>
        <div className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <FileJson className="w-4 h-4 text-blue-500" />
            <span>Base URL: {resultado.base_url}</span>
          </div>
          <div className="flex items-center gap-2">
            <Key className="w-4 h-4 text-amber-500" />
            <span>Auth: {resultado.auth_type}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
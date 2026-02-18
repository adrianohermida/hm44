import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play } from 'lucide-react';
import TestResult from './TestResult';

export default function TestSection({ test, loading, result, onRun }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-lg">{test.name}</CardTitle>
            <p className="text-sm text-[var(--text-secondary)] mt-1">{test.description}</p>
          </div>
          <Button 
            onClick={onRun} 
            disabled={loading}
            size="sm"
            className="bg-[var(--brand-primary)]"
          >
            {loading ? (
              <>Executando...</>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Executar
              </>
            )}
          </Button>
        </div>
      </CardHeader>
      {result && (
        <CardContent>
          <TestResult result={result} />
        </CardContent>
      )}
    </Card>
  );
}
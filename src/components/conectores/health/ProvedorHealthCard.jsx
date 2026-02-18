import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity } from 'lucide-react';
import HealthBadge from './HealthBadge';
import HealthMetrics from './HealthMetrics';
import HealthTestButton from './HealthTestButton';
import HealthTestResult from './HealthTestResult';
import HealthTestLog from './HealthTestLog';
import HealthCardSkeleton from '@/components/conectores/skeletons/HealthCardSkeleton';

export default function ProvedorHealthCard({ provedor, onTest, isLoading = false }) {
  if (isLoading) return <HealthCardSkeleton />;
  const [testResult, setTestResult] = useState(null);

  const handleTestResult = (result) => {
    setTestResult(result);
    onTest?.();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-[var(--text-primary)] flex items-center gap-2">
          <Activity className="w-5 h-5" /> Status de Saúde
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <HealthBadge status={provedor.saude_status} />
        <HealthMetrics provedor={provedor} />
        <HealthTestButton provedor={provedor} onTestResult={handleTestResult} />
        <HealthTestResult result={testResult} />
        <HealthTestLog result={testResult} />
      </CardContent>
    </Card>
  );
}
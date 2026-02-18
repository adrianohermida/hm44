import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import RateLimitIndicator from './RateLimitIndicator';
import RateLimitWarning from './RateLimitWarning';

export default function RateLimitStats({ usado, limite, periodo }) {
  const percent = (usado / limite) * 100;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Rate Limit</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <RateLimitIndicator usado={usado} limite={limite} periodo={periodo} />
        <RateLimitWarning percentual={percent} limite={limite} periodo={periodo} />
      </CardContent>
    </Card>
  );
}
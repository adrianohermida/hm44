import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StepContent({ step, children }) {
  const StepIcon = step.icon;
  
  return (
    <Card className="shadow-sm">
      <CardHeader className="border-b border-[var(--border-primary)] p-4">
        <CardTitle className="flex items-center gap-2 text-base md:text-lg">
          <StepIcon className="w-5 h-5" />
          {step.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-6">
        {children}
      </CardContent>
    </Card>
  );
}
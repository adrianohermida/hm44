import React from 'react';
import { CardHeader, CardTitle } from '@/components/ui/card';

export default function CardHeaderActions({ title, children }) {
  return (
    <CardHeader className="flex flex-row items-center justify-between">
      <CardTitle>{title}</CardTitle>
      {children && (
        <div className="flex gap-2">
          {children}
        </div>
      )}
    </CardHeader>
  );
}
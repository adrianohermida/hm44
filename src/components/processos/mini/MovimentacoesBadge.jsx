import React from 'react';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';

export default function MovimentacoesBadge({ count }) {
  if (!count) return null;
  
  return (
    <Badge variant="outline" className="gap-1">
      <FileText className="w-3 h-3" />
      {count} mov.
    </Badge>
  );
}
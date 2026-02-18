import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';

export default function AudienciasBadge({ count }) {
  if (!count) return null;
  
  return (
    <Badge variant="outline" className="gap-1">
      <Calendar className="w-3 h-3" />
      {count} aud.
    </Badge>
  );
}
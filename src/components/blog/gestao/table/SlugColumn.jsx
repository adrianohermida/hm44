import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Link2, AlertTriangle } from 'lucide-react';

export default function SlugColumn({ artigo }) {
  if (!artigo.slug) {
    return (
      <div className="flex items-center gap-2 text-orange-600">
        <AlertTriangle className="w-4 h-4" />
        <span className="text-xs">Sem slug</span>
      </div>
    );
  }

  const score = artigo.score_slug || 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <Link2 className="w-3 h-3 text-gray-400" />
        <code className="text-xs text-gray-600 truncate max-w-[200px]">
          /blog/{artigo.slug}
        </code>
      </div>
      <Badge 
        variant={score >= 80 ? 'default' : score >= 60 ? 'secondary' : 'destructive'}
        className="text-xs"
      >
        {score}/100
      </Badge>
    </div>
  );
}
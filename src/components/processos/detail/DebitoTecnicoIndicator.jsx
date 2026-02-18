import React, { useState } from 'react';
import { AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

export default function DebitoTecnicoIndicator({ issues = [], isAdmin = false }) {
  if (!isAdmin || issues.length === 0) return null;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-orange-600 hover:text-orange-700">
          <AlertCircle className="w-4 h-4" />
          <Badge variant="destructive" className="bg-orange-500">
            {issues.length}
          </Badge>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-orange-600" />
            <h4 className="font-semibold text-sm">Débito Técnico</h4>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Dados órfãos que não estão sendo exibidos:
          </p>
          <ul className="space-y-1 text-xs">
            {issues.map((issue, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-orange-600 mt-0.5">•</span>
                <span>{issue}</span>
              </li>
            ))}
          </ul>
        </div>
      </PopoverContent>
    </Popover>
  );
}
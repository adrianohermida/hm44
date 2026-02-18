import React from 'react';
import { Button } from '@/components/ui/button';
import { Bold, Italic, Link as LinkIcon, List } from 'lucide-react';

export default function ComposerToolbar({ onInsertTag }) {
  return (
    <div className="flex gap-1 px-4 pt-3 pb-2 border-b border-[var(--border-primary)]">
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onInsertTag('**', '**')}
        className="h-7 w-7 p-0"
        title="Negrito"
      >
        <Bold className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onInsertTag('_', '_')}
        className="h-7 w-7 p-0"
        title="Itálico"
      >
        <Italic className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onInsertTag('[texto](', ')')}
        className="h-7 w-7 p-0"
        title="Link"
      >
        <LinkIcon className="w-3.5 h-3.5" />
      </Button>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={() => onInsertTag('\n- ', '')}
        className="h-7 w-7 p-0"
        title="Lista"
      >
        <List className="w-3.5 h-3.5" />
      </Button>
    </div>
  );
}
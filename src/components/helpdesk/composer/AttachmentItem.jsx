import React from 'react';
import { Button } from '@/components/ui/button';
import { X, File } from 'lucide-react';

export default function AttachmentItem({ anexo, onRemove }) {
  return (
    <div className="flex items-center gap-2 p-2 bg-gray-50 rounded text-sm">
      <File className="w-3.5 h-3.5 text-gray-500" />
      <span className="flex-1 truncate text-xs">{anexo.nome}</span>
      <Button
        type="button"
        size="sm"
        variant="ghost"
        onClick={onRemove}
        className="h-6 w-6 p-0"
      >
        <X className="w-3 h-3" />
      </Button>
    </div>
  );
}
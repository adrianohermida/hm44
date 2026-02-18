import React from 'react';
import { FileText, Image, FileType, Download, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const iconMap = {
  'application/pdf': FileText,
  'image/jpeg': Image,
  'image/png': Image,
  'image/jpg': Image,
  'default': FileType
};

export default function ArquivoItem({ anexo, onRemover }) {
  const Icon = iconMap[anexo.tipo] || iconMap.default;

  return (
    <div className="p-3 bg-[var(--bg-secondary)] rounded-lg flex items-start gap-3 hover:bg-[var(--bg-tertiary)] transition-colors">
      <Icon className="w-5 h-5 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
          {anexo.nome}
        </p>
        <p className="text-xs text-[var(--text-tertiary)]">
          {anexo.tipo?.split('/')[1]?.toUpperCase() || 'Arquivo'}
        </p>
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => window.open(anexo.url, '_blank')}
        >
          <Download className="w-3 h-3" />
        </Button>
        {onRemover && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-600 hover:text-red-700"
            onClick={onRemover}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        )}
      </div>
    </div>
  );
}
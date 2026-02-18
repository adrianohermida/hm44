import React from 'react';
import { FileText, Image, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function MessageAttachments({ anexos = [] }) {
  if (!anexos?.length) return null;

  const getIcon = (tipo) => {
    if (tipo?.includes('image')) return Image;
    return FileText;
  };

  return (
    <div className="mt-2 space-y-2">
      {anexos.map((anexo, idx) => {
        const Icon = getIcon(anexo.tipo);
        return (
          <a
            key={idx}
            href={anexo.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 p-2 bg-black/5 rounded hover:bg-black/10 transition-colors"
          >
            <Icon className="w-4 h-4" />
            <span className="text-xs flex-1 truncate">{anexo.nome}</span>
            <Download className="w-3 h-3" />
          </a>
        );
      })}
    </div>
  );
}
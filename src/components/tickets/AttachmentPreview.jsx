import React from 'react';
import { X, FileText, Image as ImageIcon } from 'lucide-react';

export default function AttachmentPreview({ files, onRemove }) {
  if (!files?.length) return null;

  const getIcon = (file) => {
    if (file.type.startsWith('image/')) return ImageIcon;
    return FileText;
  };

  return (
    <div className="flex flex-wrap gap-2 p-2 border-t border-[var(--border-primary)]">
      {files.map((file, idx) => {
        const Icon = getIcon(file);
        return (
          <div
            key={idx}
            className="flex items-center gap-2 bg-[var(--bg-secondary)] px-3 py-2 rounded-lg"
          >
            <Icon className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-sm text-[var(--text-primary)] max-w-[120px] truncate">
              {file.name}
            </span>
            <button
              onClick={() => onRemove(idx)}
              className="text-[var(--text-tertiary)] hover:text-[var(--brand-error)]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
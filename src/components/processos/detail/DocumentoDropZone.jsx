import React from 'react';
import { Upload } from 'lucide-react';

export default function DocumentoDropZone({ onDrop, uploading }) {
  const [dragging, setDragging] = React.useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragging(true);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    const files = Array.from(e.dataTransfer.files);
    onDrop(files);
  };

  return (
    <div 
      onDragOver={handleDragOver}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
        dragging ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]' : 'border-[var(--border-primary)]'
      } ${uploading ? 'opacity-50 pointer-events-none' : ''}`}
    >
      <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--text-tertiary)]" />
      <p className="text-sm text-[var(--text-secondary)]">Arraste arquivos ou clique para selecionar</p>
      <p className="text-xs text-[var(--text-tertiary)] mt-1">Múltiplos arquivos suportados</p>
    </div>
  );
}
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function CSVUploader({ onFileSelect }) {
  const inputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      onFileSelect(file);
    }
  };

  return (
    <div className="border-2 border-dashed border-[var(--border-primary)] rounded-lg p-8 text-center">
      <Upload className="w-12 h-12 mx-auto text-[var(--text-tertiary)] mb-4" />
      <p className="text-[var(--text-secondary)] mb-4">
        Arraste um arquivo CSV ou clique para selecionar
      </p>
      <input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />
      <Button onClick={() => inputRef.current?.click()}>
        Selecionar Arquivo
      </Button>
    </div>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function FileUploader({ onUpload }) {
  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (file) onUpload(file);
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <Upload className="w-12 h-12 mx-auto mb-4 text-[var(--text-tertiary)]" />
      <p className="mb-4 text-[var(--text-secondary)]">
        Formatos: CSV, XLSX, JSON
      </p>
      <input
        type="file"
        accept=".csv,.xlsx,.json"
        onChange={handleFile}
        className="hidden"
        id="file-upload"
      />
      <Button asChild>
        <label htmlFor="file-upload" className="cursor-pointer">
          Selecionar Arquivo
        </label>
      </Button>
    </div>
  );
}
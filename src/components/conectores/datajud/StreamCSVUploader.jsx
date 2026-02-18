import React from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function StreamCSVUploader({ file, onFileSelect, onFileRemove, disabled }) {
  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.size > 50 * 1024 * 1024) {
        alert('Arquivo muito grande. Máximo: 50MB');
        return;
      }
      if (!selectedFile.name.endsWith('.csv')) {
        alert('Formato inválido. Apenas CSV permitido.');
        return;
      }
      onFileSelect(selectedFile);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        {!file ? (
          <label className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-6 cursor-pointer hover:border-[var(--brand-primary)] transition-colors">
            <Upload className="w-8 h-8 text-[var(--text-tertiary)] mb-2" />
            <span className="text-sm text-[var(--text-secondary)]">
              Arraste ou clique para selecionar CSV
            </span>
            <span className="text-xs text-[var(--text-tertiary)] mt-1">
              Máximo 50MB
            </span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              disabled={disabled}
              className="hidden"
            />
          </label>
        ) : (
          <div className="flex items-center justify-between p-4 bg-[var(--bg-secondary)] rounded-lg">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-[var(--brand-primary)]" />
              <div>
                <p className="text-sm font-medium">{file.name}</p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFileRemove}
              disabled={disabled}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
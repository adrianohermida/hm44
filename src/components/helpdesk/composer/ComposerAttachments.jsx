import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { X, Upload, Paperclip } from 'lucide-react';
import { useFileUpload } from './hooks/useFileUpload';

export default function ComposerAttachments({ anexos, onAnexosChange }) {
  const fileInputRef = useRef(null);
  const { processFiles, isUploading } = useFileUpload(anexos, onAnexosChange);

  const handleDrop = async (e) => {
    e.preventDefault();
    await processFiles(e.dataTransfer.files);
  };

  const handleFileSelect = async (e) => {
    if (e.target.files.length > 0) {
      await processFiles(e.target.files);
    }
  };

  const removeAnexo = (idx) => {
    onAnexosChange(anexos.filter((_, i) => i !== idx));
  };

  return (
    <div className="space-y-2">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="border-2 border-dashed rounded-lg p-6 text-center hover:border-[var(--brand-primary)] transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
        <p className="text-sm text-gray-500">
          Arraste arquivos ou clique para selecionar
        </p>
        <p className="text-xs text-gray-400 mt-1">
          PDF, DOC, XLS, IMG (máx 10MB cada, 25MB total)
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      {anexos.map((anexo, idx) => (
        <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
          <div className="flex items-center gap-2">
            <Paperclip className="w-4 h-4 text-gray-400" />
            <span className="text-sm">{anexo.filename}</span>
            <span className="text-xs text-gray-400">
              ({(anexo.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => removeAnexo(idx)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      ))}
    </div>
  );
}
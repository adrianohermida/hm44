import React, { useState, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Paperclip, X, Upload, Loader2, Sparkles } from 'lucide-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function DescricaoComAnexos({ 
  value, 
  onChange, 
  anexos = [],
  onAnexosChange,
  templates = [],
  onSelectTemplate,
  isUploading = false,
  onUpload
}) {
  const [dragActive, setDragActive] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => onUpload(file));
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => onUpload(file));
  };

  const removeAnexo = (idx) => {
    onAnexosChange(anexos.filter((_, i) => i !== idx));
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link'],
      ['clean']
    ]
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label>Descrição</Label>
        {templates.length > 0 && (
          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={() => setShowTemplates(!showTemplates)}
          >
            <Sparkles className="w-4 h-4 mr-1" />
            Templates
          </Button>
        )}
      </div>

      {showTemplates && (
        <div className="border border-[var(--border-primary)] rounded-lg p-3 space-y-2 mb-2">
          {templates.map(t => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                onSelectTemplate(t);
                setShowTemplates(false);
              }}
              className="w-full text-left p-2 hover:bg-[var(--bg-tertiary)] rounded"
            >
              <div className="font-medium text-sm">{t.nome}</div>
              {t.atalho && (
                <div className="text-xs text-[var(--text-tertiary)]">
                  Atalho: {t.atalho}
                </div>
              )}
            </button>
          ))}
        </div>
      )}

      <div
        className={`relative border-2 border-dashed rounded-lg transition-colors ${
          dragActive 
            ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]' 
            : 'border-[var(--border-primary)]'
        }`}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          if (e.currentTarget === e.target) {
            setDragActive(false);
          }
        }}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <ReactQuill
          theme="snow"
          value={value}
          onChange={onChange}
          modules={quillModules}
          placeholder="Detalhes do ticket..."
          className="min-h-[200px]"
        />

        {dragActive && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--brand-primary-50)] bg-opacity-90 rounded-lg pointer-events-none">
            <div className="text-center">
              <Upload className="w-12 h-12 mx-auto mb-2 text-[var(--brand-primary)]" />
              <p className="text-sm font-medium text-[var(--brand-primary)]">
                Solte os arquivos aqui
              </p>
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Até 20MB por arquivo
              </p>
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
      />

      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => fileInputRef.current?.click()}
        disabled={isUploading}
        className="w-full"
      >
        {isUploading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Enviando...
          </>
        ) : (
          <>
            <Paperclip className="w-4 h-4 mr-2" />
            Anexar arquivos
          </>
        )}
      </Button>

      {anexos.length > 0 && (
        <div className="space-y-2 pt-2">
          {anexos.map((anexo, idx) => (
            <div 
              key={idx} 
              className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded border"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Paperclip className="w-4 h-4 text-[var(--text-tertiary)] flex-shrink-0" />
                <span className="text-sm truncate">{anexo.nome}</span>
                <span className="text-xs text-[var(--text-tertiary)] whitespace-nowrap">
                  ({(anexo.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeAnexo(idx)}
                className="flex-shrink-0 p-1 hover:bg-red-100 rounded"
              >
                <X className="w-4 h-4 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
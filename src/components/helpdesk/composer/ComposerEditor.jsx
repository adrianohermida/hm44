import React, { forwardRef, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { Upload, X, Paperclip } from 'lucide-react';
import { useFileUpload } from './hooks/useFileUpload';

const modules = {
  toolbar: [
    ['bold', 'italic', 'underline'],
    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
    ['link']
  ]
};

const ComposerEditor = forwardRef(({ 
  value, 
  onChange, 
  placeholder = "Digite sua resposta...",
  anexos = [],
  onAnexosChange 
}, ref) => {
  const [dragActive, setDragActive] = useState(false);
  const { processFiles } = useFileUpload(anexos, onAnexosChange);

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      processFiles(files);
    }
  };

  return (
    <div 
      className="relative"
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
      <div className="rich-text-editor">
        <ReactQuill
          value={value}
          onChange={onChange}
          modules={modules}
          placeholder={placeholder}
          className="border-0"
          style={{ minHeight: '280px' }}
        />
      </div>

      {dragActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 bg-opacity-95 rounded-lg pointer-events-none z-10 border-2 border-dashed border-[var(--brand-primary)] animate-pulse">
          <div className="text-center">
            <Upload className="w-12 h-12 mx-auto mb-2 text-[var(--brand-primary)] animate-bounce" />
            <p className="text-sm font-medium text-[var(--brand-primary)]">
              Solte os arquivos aqui
            </p>
            <p className="text-xs text-[var(--text-tertiary)] mt-1">
              Até 10MB por arquivo, máx 25MB total
            </p>
          </div>
        </div>
      )}

      {anexos.length > 0 && (
        <div className="mt-3 space-y-2">
          {anexos.map((anexo, idx) => (
            <div 
              key={idx}
              className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded border text-xs transition-all hover:shadow-sm hover:bg-[var(--bg-tertiary)]"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <Paperclip className="w-3 h-3 text-[var(--text-tertiary)] flex-shrink-0" />
                <span className="truncate">{anexo.filename}</span>
                <span className="text-[var(--text-tertiary)] whitespace-nowrap">
                  ({(anexo.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => onAnexosChange(anexos.filter((_, i) => i !== idx))}
                className="flex-shrink-0 p-1 hover:bg-red-100 rounded transition-colors"
                aria-label={`Remover ${anexo.filename}`}
              >
                <X className="w-3 h-3 text-red-600" />
              </button>
            </div>
          ))}
        </div>
      )}

      <input
        type="file"
        multiple
        onChange={handleFileSelect}
        className="hidden"
        id="file-upload"
        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx"
      />
      <label
        htmlFor="file-upload"
        className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 text-xs bg-white border rounded cursor-pointer hover:bg-gray-50"
      >
        <Paperclip className="w-3 h-3" />
        Anexar arquivos
      </label>
    </div>
  );
});

ComposerEditor.displayName = 'ComposerEditor';

export default ComposerEditor;
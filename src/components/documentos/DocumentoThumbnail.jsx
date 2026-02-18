import React from 'react';
import { FileText, Image, FileArchive, File } from 'lucide-react';

const ICONES_TIPO = {
  'application/pdf': FileText,
  'image/jpeg': Image,
  'image/png': Image,
  'image/jpg': Image,
  'application/zip': FileArchive,
};

export default function DocumentoThumbnail({ documento, onClick, className = '' }) {
  const Icon = ICONES_TIPO[documento.mime_type] || File;
  const isPdf = documento.mime_type === 'application/pdf';
  const isImage = documento.mime_type?.startsWith('image/');

  return (
    <button
      onClick={onClick}
      className={`group relative aspect-[3/4] rounded-lg border-2 border-[var(--border-primary)] hover:border-[var(--brand-primary)] bg-[var(--bg-primary)] overflow-hidden transition-all hover:shadow-lg ${className}`}
      aria-label={`Visualizar ${documento.nome_arquivo}`}
    >
      {isImage ? (
        <img 
          src={documento.url_arquivo} 
          alt={documento.nome_arquivo}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="flex flex-col items-center justify-center h-full p-4 bg-[var(--bg-secondary)]">
          <Icon className="w-12 h-12 text-[var(--brand-primary)] mb-2" aria-hidden="true" />
          <p className="text-xs text-center text-[var(--text-secondary)] line-clamp-2 font-medium">
            {documento.nome_arquivo}
          </p>
        </div>
      )}
      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
        <span className="text-[var(--brand-text-on-primary)] text-sm font-semibold">Visualizar</span>
      </div>
    </button>
  );
}
import React from 'react';
import DocumentoPublicoItem from './DocumentoPublicoItem';

export default function DocumentosPublicosLista({ documentos, onDownload }) {
  if (!documentos || documentos.length === 0) {
    return (
      <p className="text-sm text-[var(--brand-text-tertiary)] text-center py-4">
        Nenhum documento disponível
      </p>
    );
  }

  return (
    <div className="space-y-2">
      {documentos.map(doc => (
        <DocumentoPublicoItem key={doc.id} documento={doc} onDownload={onDownload} />
      ))}
    </div>
  );
}
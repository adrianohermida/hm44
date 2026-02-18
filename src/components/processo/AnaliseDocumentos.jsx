import React, { useState } from 'react';
import SolicitarAnaliseButton from './SolicitarAnaliseButton';
import ResumoExecutivoCard from './ResumoExecutivoCard';

export default function AnaliseDocumentos({ documentoUrls, numeroCnj }) {
  const [resumo, setResumo] = useState(null);

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <SolicitarAnaliseButton
          documentoUrls={documentoUrls}
          numeroCnj={numeroCnj}
          onComplete={setResumo}
        />
      </div>
      {resumo && <ResumoExecutivoCard resumo={resumo} />}
    </div>
  );
}
import React from 'react';
import ProcessoHeader from './ProcessoHeader';
import ProcessoContent from './ProcessoContent';

export default function ProcessoDetail({ processo, andamentos, onVoltar, onEditar }) {
  return (
    <div className="space-y-6">
      <ProcessoHeader 
        processo={processo}
        onVoltar={onVoltar}
        onEditar={onEditar}
      />
      <ProcessoContent 
        processo={processo}
        andamentos={andamentos}
      />
    </div>
  );
}
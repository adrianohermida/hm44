import React from 'react';
import ConversaoReport from './ConversaoReport';
import LeadsReport from './LeadsReport';
import ProcessosReport from './ProcessosReport';
import FinanceiroReport from './FinanceiroReport';
import ConsultasReport from './ConsultasReport';
import ComunicacaoReport from './ComunicacaoReport';
import PrazosReport from './PrazosReport';

export default function RelatorioContent({ reportType }) {
  const reports = {
    conversoes: <ConversaoReport />,
    leads: <LeadsReport />,
    processos: <ProcessosReport />,
    financeiro: <FinanceiroReport />,
    consultas: <ConsultasReport />,
    prazos: <PrazosReport />,
    comunicacao: <ComunicacaoReport />,
  };

  return (
    <div className="flex-1 overflow-auto bg-[var(--bg-primary)] p-4 md:p-6">
      {reports[reportType] ?? (
        <div className="text-center py-16 text-[var(--text-secondary)]">
          Selecione uma categoria no menu lateral
        </div>
      )}
    </div>
  );
}
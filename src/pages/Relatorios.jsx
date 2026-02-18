import React, { useState } from 'react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import RelatoriosHeader from '@/components/analytics/RelatoriosHeader';
import RelatoriosSidebar from '@/components/analytics/RelatoriosSidebar';
import RelatorioContent from '@/components/analytics/RelatorioContent';

export default function Relatorios() {
  const [selectedReport, setSelectedReport] = useState('conversoes');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)] overflow-hidden">
      <div className="flex-shrink-0 p-4 md:p-6 border-b border-[var(--border-primary)] bg-[var(--bg-elevated)]">
        <Breadcrumb items={[{ label: 'Relatórios' }]} />
        <RelatoriosHeader />
      </div>

      <div className="flex-1 flex overflow-hidden">
        <RelatoriosSidebar
          selected={selectedReport}
          onSelect={setSelectedReport}
          isOpen={sidebarOpen}
          onToggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <RelatorioContent reportType={selectedReport} />
      </div>
    </div>
  );
}
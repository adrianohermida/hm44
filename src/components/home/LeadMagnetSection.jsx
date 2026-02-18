import React, { useState } from 'react';
import { Gift } from 'lucide-react';
import { useLeadMagnets } from '@/components/hooks/useLeadMagnets';
import MagnetGrid from '@/components/leadmagnet/MagnetGrid';
import CapturaModal from '@/components/leadmagnet/CapturaModal';

export default function LeadMagnetSection() {
  const { magnets } = useLeadMagnets('ativo');
  const [selectedMagnet, setSelectedMagnet] = useState(null);

  const handleDownloadSuccess = (url) => {
    window.open(url, '_blank');
    setSelectedMagnet(null);
  };

  if (magnets.length === 0) return null;

  return (
    <section className="py-20 bg-[var(--bg-primary)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full mb-4">
            <Gift className="w-4 h-4" />
            <span className="font-semibold">Conteúdo Exclusivo</span>
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Recursos para Sua Liberdade Financeira</h2>
          <p className="text-lg text-[var(--text-secondary)]">Baixe gratuitamente nossos guias especializados</p>
        </div>

        <MagnetGrid magnets={magnets} onDownload={setSelectedMagnet} />

        {selectedMagnet && (
          <CapturaModal
            magnet={selectedMagnet}
            open={!!selectedMagnet}
            onClose={() => setSelectedMagnet(null)}
            onSuccess={handleDownloadSuccess}
          />
        )}
      </div>
    </section>
  );
}
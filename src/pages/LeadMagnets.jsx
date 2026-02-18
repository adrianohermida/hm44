import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Gift, Plus } from 'lucide-react';
import MagnetGrid from '@/components/leadmagnet/MagnetGrid';
import MagnetStats from '@/components/leadmagnet/MagnetStats';
import CapturaModal from '@/components/leadmagnet/CapturaModal';
import MagnetFormModal from '@/components/leadmagnet/MagnetFormModal';

export default function LeadMagnets() {
  const [selectedMagnet, setSelectedMagnet] = useState(null);
  const [editingMagnet, setEditingMagnet] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const queryClient = useQueryClient();

  const { data: magnets = [] } = useQuery({
    queryKey: ['lead-magnets-admin'],
    queryFn: () => base44.entities.LeadMagnet.list('-created_date')
  });

  const { data: leads = [] } = useQuery({
    queryKey: ['lead-capturas'],
    queryFn: () => base44.entities.LeadCaptura.list('-created_date', 100)
  });

  const downloads = magnets.reduce((sum, m) => sum + (m.total_downloads || 0), 0);
  const totalLeads = leads.length;
  const conversao = downloads > 0 ? ((totalLeads / downloads) * 100).toFixed(1) : 0;

  const handleDownloadSuccess = (url) => {
    window.open(url, '_blank');
    setSelectedMagnet(null);
    queryClient.invalidateQueries(['lead-magnets-admin']);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Gift className="w-8 h-8 text-[var(--brand-primary)]" />
            <h1 className="text-3xl font-bold">Lead Magnets</h1>
          </div>
          <Button className="bg-[var(--brand-primary)]" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />Adicionar Material
          </Button>
        </div>

        <MagnetStats downloads={downloads} leads={totalLeads} conversao={conversao} />
        <MagnetGrid magnets={magnets} onDownload={setSelectedMagnet} onEdit={(m) => { setEditingMagnet(m); setShowForm(true); }} />

        {selectedMagnet && (
          <CapturaModal
            magnet={selectedMagnet}
            open={!!selectedMagnet}
            onClose={() => setSelectedMagnet(null)}
            onSuccess={handleDownloadSuccess}
          />
        )}

        <MagnetFormModal
          magnet={editingMagnet}
          open={showForm}
          onClose={() => {
            setShowForm(false);
            setEditingMagnet(null);
          }}
        />
      </div>
    </div>
  );
}
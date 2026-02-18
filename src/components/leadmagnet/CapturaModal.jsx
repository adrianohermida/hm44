import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function CapturaModal({ magnet, open, onClose, onSuccess }) {
  const [form, setForm] = useState({ nome: '', email: '', telefone: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.LeadCaptura.create({
        ...form,
        lead_magnet_id: magnet.id,
        origem: 'home'
      });
      await base44.entities.LeadMagnet.update(magnet.id, {
        total_leads_gerados: (magnet.total_leads_gerados || 0) + 1,
        total_downloads: (magnet.total_downloads || 0) + 1
      });
      onSuccess?.(magnet.arquivo_url);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Baixe Gratuitamente: {magnet?.titulo}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input placeholder="Seu nome" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
          <Input type="email" placeholder="Seu melhor e-mail" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
          <Input placeholder="WhatsApp" value={form.telefone} onChange={(e) => setForm({...form, telefone: e.target.value})} />
          <Button type="submit" disabled={loading} className="w-full bg-[var(--brand-primary)]">
            {loading ? 'Enviando...' : 'Baixar Material'}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
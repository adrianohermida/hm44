import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';

export default function ExitPopupForm({ onSuccess }) {
  const [form, setForm] = useState({ nome: '', email: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await base44.entities.LeadCaptura.create({
        ...form,
        lead_magnet_id: 'exit-popup',
        origem: 'popup'
      });
      onSuccess?.();
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Input placeholder="Seu nome" value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})} required />
      <Input type="email" placeholder="Seu e-mail" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} required />
      <Button type="submit" disabled={loading} className="w-full bg-[var(--brand-primary)]">
        {loading ? 'Enviando...' : 'Quero o Guia Grátis'}
      </Button>
    </form>
  );
}
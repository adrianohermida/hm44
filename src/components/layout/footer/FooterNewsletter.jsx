import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function FooterNewsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    try {
      const escritorios = await base44.entities.Escritorio.list();
      const escritorioId = escritorios[0]?.id;

      await base44.entities.NewsletterSubscriber.create({
        email,
        escritorio_id: escritorioId,
        origem: 'footer',
        status: 'ativo'
      });
      
      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch {
      setStatus('idle');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-[var(--brand-primary-900)] border border-[var(--brand-primary-700)] rounded-lg p-4 text-center">
        <CheckCircle className="w-8 h-8 text-[var(--brand-primary)] mx-auto mb-2" />
        <p className="text-sm text-[var(--brand-primary-300)]">Inscrito com sucesso!</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <h4 className="font-bold text-[var(--footer-text)] text-sm uppercase tracking-wider">Newsletter Jurídica</h4>
      <p className="text-xs text-[var(--footer-text-muted)]">Receba dicas e atualizações sobre seus direitos</p>
      <div className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Seu email"
          className="flex-1 px-3 py-2 bg-[var(--footer-input-bg)] border border-[var(--footer-input-border)] rounded-lg text-sm text-[var(--footer-text)] placeholder-[var(--footer-text-muted)] focus:outline-none focus:border-[var(--brand-primary)]"
          required
        />
        <button type="submit" disabled={status === 'loading'} className="px-3 py-2 bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-[var(--text-on-primary)] rounded-lg transition-colors disabled:opacity-50">
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
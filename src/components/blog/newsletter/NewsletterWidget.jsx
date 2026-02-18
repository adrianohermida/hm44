import React, { useState } from 'react';
import { X, Mail, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { base44 } from '@/api/base44Client';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';

export default function NewsletterWidget({ escritorioId, tags = [] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [nome, setNome] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async (data) => {
      return base44.entities.NewsletterSubscriber.create(data);
    },
    onSuccess: () => {
      setSubscribed(true);
      toast.success('Inscrição realizada com sucesso!');
      setTimeout(() => {
        setIsOpen(false);
        setSubscribed(false);
        setEmail('');
        setNome('');
      }, 3000);
    },
    onError: () => {
      toast.error('Erro ao se inscrever. Tente novamente.');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;

    subscribeMutation.mutate({
      email,
      nome: nome || null,
      escritorio_id: escritorioId,
      tags,
      status: 'ativo',
      origem: 'blog_widget'
    });
  };

  return (
    <div className="fixed right-0 top-1/2 -translate-y-1/2 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[var(--brand-primary)] text-white px-4 py-6 rounded-l-lg shadow-lg hover:bg-[var(--brand-primary-600)] transition-all"
          style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
        >
          <Mail className="w-5 h-5 mb-2" style={{ transform: 'rotate(90deg)' }} />
          Newsletter
        </button>
      ) : (
        <div className="bg-[var(--bg-elevated)] rounded-l-xl shadow-2xl w-80 p-6 border-l-4 border-[var(--brand-primary)]">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>

          {!subscribed ? (
            <>
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-[var(--brand-primary-100)] p-2 rounded-lg">
                  <Mail className="w-6 h-6 text-[var(--brand-primary)]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg text-[var(--text-primary)]">Newsletter</h3>
                  <p className="text-sm text-[var(--text-secondary)]">Receba novidades</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-3">
                <Input
                  type="text"
                  placeholder="Seu nome (opcional)"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] placeholder:text-[var(--text-tertiary)]"
                />
                <Input
                  type="email"
                  placeholder="Seu e-mail"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full bg-[var(--bg-primary)] text-[var(--text-primary)] border-[var(--border-primary)] placeholder:text-[var(--text-tertiary)]"
                />
                <Button 
                  type="submit"
                  className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
                  disabled={subscribeMutation.isPending}
                >
                  {subscribeMutation.isPending ? 'Inscrevendo...' : 'Inscrever-se'}
                </Button>
              </form>
              <p className="text-xs text-[var(--text-tertiary)] mt-3">
                Receba artigos e novidades jurídicas diretamente no seu e-mail.
              </p>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="bg-green-100 dark:bg-green-900 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="font-bold text-lg mb-2 text-[var(--text-primary)]">Inscrição Confirmada!</h3>
              <p className="text-sm text-[var(--text-secondary)]">
                Você receberá nossos conteúdos em breve.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
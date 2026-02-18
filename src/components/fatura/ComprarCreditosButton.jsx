import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { CreditCard } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function ComprarCreditosButton({ quantidade, valor }) {
  const [loading, setLoading] = useState(false);

  const comprar = async () => {
    setLoading(true);
    try {
      const res = await base44.functions.invoke('criarFaturaCreditos', { quantidade_creditos: quantidade, valor });
      window.location.href = res.data.url;
    } catch {
      toast.error('Erro ao criar fatura');
    }
    setLoading(false);
  };

  return (
    <Button onClick={comprar} disabled={loading} className="w-full">
      <CreditCard className="w-4 h-4 mr-2" />
      {loading ? 'Processando...' : `Comprar ${quantidade} créditos`}
    </Button>
  );
}
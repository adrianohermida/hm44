import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function SolicitarAnaliseButton({ documentoUrls, numeroCnj, onComplete }) {
  const [loading, setLoading] = useState(false);

  const analisar = async () => {
    if (!documentoUrls?.length) {
      toast.error('Nenhum documento disponível');
      return;
    }
    
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('analisarDocumentoProcesso', {
        documento_urls: documentoUrls,
        numero_cnj: numeroCnj
      });
      toast.success('Análise concluída');
      onComplete(data.resumo);
    } catch (error) {
      toast.error('Erro ao analisar documentos');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button onClick={analisar} disabled={loading} className="bg-[var(--brand-primary)]">
      {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Sparkles className="w-4 h-4 mr-2" />}
      Gerar Resumo com IA
    </Button>
  );
}
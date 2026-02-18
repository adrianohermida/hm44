import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function BuscaPorDocumento({ onResultados }) {
  const [doc, setDoc] = useState('');
  const [loading, setLoading] = useState(false);

  const buscar = async () => {
    if (!doc) return toast.error('Informe o CPF/CNPJ');
    setLoading(true);
    try {
      const docLimpo = doc.replace(/\D/g, '');
      const payload = docLimpo.length === 11 ? { cpf: docLimpo } : { cnpj: docLimpo };
      
      const { data } = await base44.functions.invoke('buscarProcessosPorEnvolvido', payload);
      
      if (data.envolvido_encontrado) {
        toast.info(`Envolvido: ${data.envolvido_encontrado.nome} (${data.envolvido_encontrado.quantidade_processos} processos)`);
      }
      
      onResultados({ 
        processos: data.processos || [], 
        processos_salvos: data.processos_salvos || 0 
      });
      toast.success(`${data.processos_salvos || 0} processo(s) adicionado(s) | ${data.creditos_consumidos} créditos`);
    } catch (err) {
      toast.error(err.message || 'Erro na busca');
      onResultados({ processos: [] });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <Input 
        placeholder="CPF ou CNPJ"
        value={doc}
        onChange={(e) => setDoc(e.target.value)}
      />
      <Button onClick={buscar} disabled={loading}>
        {loading ? 'Buscando...' : 'Buscar'}
      </Button>
    </div>
  );
}
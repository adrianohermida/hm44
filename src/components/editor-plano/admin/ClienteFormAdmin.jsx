import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import CPFInput from '@/components/clientes/CPFInput';
import ClienteFormStep from '../ClienteFormStep';

export default function ClienteFormAdmin({ onClienteCreated, escritorioId }) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState({
    nome_completo: '', cpf: '', data_nascimento: '',
    estado_civil: 'solteiro', numero_dependentes: 0,
    profissao: '', renda_mensal: 0
  });

  const consultarCPF = async () => {
    if (!data.cpf || data.cpf.replace(/\D/g, '').length !== 11) return;
    setLoading(true);
    try {
      const { data: result } = await base44.functions.invoke('consultarCPFDirectData', { cpf: data.cpf });
      if (result.retorno) {
        const r = result.retorno;
        setData(prev => ({
          ...prev,
          nome_completo: r.Nome || prev.nome_completo,
          data_nascimento: r.DataNascimento?.split('T')[0] || prev.data_nascimento,
          profissao: r.Profissao || prev.profissao,
          renda_mensal: r.RendaPresumida || prev.renda_mensal
        }));
        toast.success('Dados preenchidos automaticamente');
      }
    } catch {
      toast.error('Erro ao consultar CPF');
    }
    setLoading(false);
  };

  const criar = async () => {
    if (!data.nome_completo || !data.cpf) {
      toast.error('Nome e CPF são obrigatórios');
      return;
    }
    setLoading(true);
    try {
      const cliente = await base44.entities.Cliente.create({
        ...data,
        tipo_pessoa: 'fisica',
        escritorio_id: escritorioId
      });
      toast.success('Cliente criado');
      onClienteCreated(cliente.id);
    } catch {
      toast.error('Erro ao criar cliente');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4">
      <CPFInput value={data.cpf} onChange={(v) => setData({...data, cpf: v})} onConsultar={consultarCPF} loading={loading} />
      <ClienteFormStep data={data} onChange={setData} isNewClient />
      <Button onClick={criar} disabled={loading} className="w-full">
        {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : null}
        Criar Cliente
      </Button>
    </div>
  );
}
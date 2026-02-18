import React, { useState } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { useEscritorio } from '@/components/hooks/useEscritorio';
import useClientesSelector from './hooks/useClientesSelector';
import ValidacaoCNJPanel from './ValidacaoCNJPanel';
import ProcessoFormBasicFields from './forms/ProcessoFormBasicFields';
import ProcessoFormDetailsFields from './forms/ProcessoFormDetailsFields';
import ProcessoFormActions from './forms/ProcessoFormActions';

export default function ProcessoManualForm({ processo, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    numero_cnj: processo?.numero_cnj || '',
    cliente_id: processo?.cliente_id || '',
    titulo: processo?.titulo || '',
    tribunal: processo?.tribunal || '',
    classe: processo?.classe || '',
    assunto: processo?.assunto || '',
    area: processo?.area || '',
    orgao_julgador: processo?.orgao_julgador || '',
    valor_causa: processo?.valor_causa || '',
    polo_ativo: processo?.polo_ativo || '',
    polo_passivo: processo?.polo_passivo || '',
    data_distribuicao: processo?.data_distribuicao || '',
    observacoes: processo?.observacoes || ''
  });
  const [validando, setValidando] = useState(false);
  const [validado, setValidado] = useState(false);

  const { data: escritorio } = useEscritorio();
  const { clientes } = useClientesSelector();

  const buscarEPreencherCNJ = async () => {
    if (!form.numero_cnj) {
      toast.error('Informe o número CNJ');
      return;
    }

    if (!escritorio?.id) {
      toast.error('Escritório não identificado');
      return;
    }
    
    setValidando(true);
    setValidado(false);
    
    try {
      const result = await base44.functions.invoke('buscarProcessoPorCNJ', {
        numero_cnj: form.numero_cnj,
        escritorio_id: escritorio.id
      });

      if (result.data?.error) {
        throw new Error(result.data.error);
      }

      if (result.data?.processo) {
        const proc = result.data.processo;
        const capa = proc.fontes?.[0]?.capa || {};
        
        setForm({
          ...form,
          titulo: proc.titulo_polo_ativo || proc.titulo || form.titulo,
          tribunal: proc.estado_origem?.sigla || proc.tribunal || form.tribunal,
          classe: capa.classe || form.classe,
          assunto: capa.assunto || form.assunto,
          area: capa.area || form.area,
          orgao_julgador: capa.orgao_julgador || form.orgao_julgador,
          valor_causa: capa.valor_causa?.valor_formatado || form.valor_causa,
          polo_ativo: proc.titulo_polo_ativo || form.polo_ativo,
          polo_passivo: proc.titulo_polo_passivo || form.polo_passivo,
          data_distribuicao: proc.data_inicio || form.data_distribuicao
        });
        setValidado(true);
        toast.success('✅ Dados preenchidos automaticamente do Escavador');
      } else {
        toast.info('CNJ não encontrado no Escavador, preencha manualmente');
      }
    } catch (err) {
      console.error('Erro ao validar CNJ:', err);
      if (err.response?.status === 404) {
        toast.info('CNJ não encontrado no Escavador');
      } else if (err.response?.status === 403) {
        toast.error('Sem permissão para acessar API Escavador');
      } else {
        toast.error('Erro ao buscar CNJ: ' + (err.message || 'Erro desconhecido'));
      }
    } finally {
      setValidando(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <ValidacaoCNJPanel 
        numeroCNJ={form.numero_cnj}
        onChange={(cnj) => {
          setForm({...form, numero_cnj: cnj});
          setValidado(false);
        }}
        onValidar={buscarEPreencherCNJ}
        validando={validando}
        validado={validado}
        escritorioDisponivel={!!escritorio}
      />
      <ProcessoFormBasicFields form={form} onChange={setForm} clientes={clientes} />
      <ProcessoFormDetailsFields form={form} onChange={setForm} />
      <div>
        <Label>Observações</Label>
        <Textarea 
          value={form.observacoes} 
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })} 
          className="bg-[var(--bg-primary)] border-[var(--border-primary)]" 
        />
      </div>
      <ProcessoFormActions onCancel={onCancel} />
    </form>
  );
}
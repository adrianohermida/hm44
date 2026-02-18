import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export function useImportacao(tipoEntidade) {
  const [loading, setLoading] = useState(false);

  const iniciarImportacao = async (arquivo_url, formato, mapeamento, total, delimitador, encoding) => {
    setLoading(true);
    try {
      const user = await base44.auth.me();
      const job = await base44.entities.JobImportacao.create({
        escritorio_id: user.escritorio_id,
        usuario_email: user.email,
        tipo_entidade: tipoEntidade,
        arquivo_url,
        formato_arquivo: formato,
        delimitador_detectado: delimitador,
        encoding_detectado: encoding,
        total_linhas: total,
        mapeamento_colunas: mapeamento,
        status: 'PENDENTE'
      });

      await base44.functions.invoke('processarImportacaoLote', { job_id: job.id });
      toast.success('Importação iniciada em segundo plano');
      return job;
    } catch (err) {
      toast.error('Erro ao iniciar importação');
    } finally {
      setLoading(false);
    }
  };

  return { iniciarImportacao, loading };
}
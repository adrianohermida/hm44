import { useState } from 'react';
import { toast } from 'sonner';
import { useQueryClient } from '@tanstack/react-query';
import { useEscritorio } from '@/components/hooks/useEscritorio';
import { criarJobImportacao, iniciarProcessamento, validarDadosImportacao } from '../ImportacaoService';
import { extrairCNJDeCampo } from '../parsers/cnjParser';

let metadataArquivo = {};

export function useImportacaoState({ onSuccess, config }) {
  const [dados, setDados] = useState([]);
  const [validacao, setValidacao] = useState(null);
  const [ignorarErros, setIgnorarErros] = useState(false);
  const [jobId, setJobId] = useState(null);
  
  const { data: escritorio } = useEscritorio();
  const queryClient = useQueryClient();

  const handleDataParsed = async (parseResult, metadata = {}) => {
    const parsedData = parseResult.dados || parseResult;
    const modelo = parseResult.modelo || 'desconhecido';
    const mapeamento = parseResult.mapeamento || {};
    const headers = parseResult.headers || Object.keys(parsedData[0] || {});
    
    console.log('[useImportacaoState] Dados recebidos:', parsedData.length, 'registros, modelo:', modelo);
    
    metadataArquivo = { ...metadata, modelo, mapeamento, headers };
    
    const dadosNormalizados = parsedData.map(row => ({
      ...row,
      numero_cnj: extrairCNJDeCampo(row)
    }));
    
    setDados(dadosNormalizados);
    
    if (!escritorio?.id) {
      toast.error('Escritório não encontrado');
      return;
    }
    
    try {
      toast.loading('Validando dados...', { id: 'validacao' });
      const result = await validarDadosImportacao(dadosNormalizados, escritorio.id);
      toast.success('Validação concluída', { id: 'validacao' });
      setValidacao({ ...result, modelo, mapeamento, headers });
      console.log('[useImportacaoState] Validação:', result);
    } catch (error) {
      toast.error(`Erro ao validar: ${error.message}`, { id: 'validacao' });
      console.error('[useImportacaoState] Erro validação:', error);
    }
  };

  const handleImportar = async () => {
    if (!escritorio?.id || !dados.length) {
      toast.error('Dados insuficientes para importar');
      return;
    }

    try {
      toast.loading('Preparando importação...', { id: 'import-prep' });
      
      const opcoesJob = {
        ignorar_erros: ignorarErros,
        batchSize: config?.batchSize || 100,
        duplicateStrategy: config?.duplicateStrategy || 'skip',
        validateCNJ: config?.validateCNJ !== false,
        autoLinkCliente: config?.autoLinkCliente !== false,
        ...metadataArquivo
      };
      
      console.log('[useImportacaoState] Criando job com opções:', opcoesJob);
      
      const job = await criarJobImportacao(dados, escritorio.id, 'IMPORTACAO_ARQUIVO', opcoesJob);
      
      console.log('[useImportacaoState] Job criado:', job.id);
      toast.success('Importação iniciada', { id: 'import-prep' });
      setJobId(job.id);
      
      const response = await iniciarProcessamento(job.id);
      console.log('[useImportacaoState] Processamento iniciado:', response);
      
      queryClient.invalidateQueries(['jobs-queue']);
    } catch (err) {
      toast.error('Erro: ' + err.message, { id: 'import-prep' });
      console.error('[useImportacaoState] Erro ao importar:', err);
    }
  };

  const handleJobComplete = (job) => {
    queryClient.invalidateQueries(['processos']);
    toast.success(`${job.registros_sucesso} processos importados!`);
    onSuccess?.();
  };

  return {
    dados,
    setDados,
    validacao,
    ignorarErros,
    jobId,
    escritorio,
    setIgnorarErros,
    setJobId,
    handleDataParsed,
    handleImportar,
    handleJobComplete
  };
}
import { base44 } from '@/api/base44Client';
import { normalizarCNJ } from './parsers/cnjParser';

/**
 * SERVIÇO UNIFICADO DE IMPORTAÇÃO
 * Consolida Manual + CSV + Busca Tribunal
 * Sempre usa JobImportacao + processarJobImportacao
 */

export async function criarJobImportacao(processos, escritorioId, fonte = 'MANUAL', opcoes = {}) {
  try {
    if (!escritorioId) throw new Error('Escritório não informado');
    if (!processos?.length) throw new Error('Nenhum processo para importar');

    const user = await base44.auth.me();
    if (!user?.email) throw new Error('Usuário não autenticado');

    const processosNormalizados = processos.map(p => ({
      ...p,
      numero_cnj: normalizarCNJ(p.numero_cnj) || p.numero_cnj
    }));

    const job = await base44.entities.JobImportacao.create({
      escritorio_id: escritorioId,
      user_email: user.email,
      total_registros: processosNormalizados.length,
      registros_processados: 0,
      registros_sucesso: 0,
      registros_falha: 0,
      status: 'pendente',
      tipo: 'IMPORTACAO_PROCESSOS',
      fonte_origem: fonte,
      dados: processosNormalizados,
      opcoes
    });

    return job;
  } catch (err) {
    throw new Error(`Erro ao criar job: ${err.message}`);
  }
}

export async function iniciarProcessamento(jobId) {
  try {
    if (!jobId) throw new Error('JobId não informado');
    console.log('[ImportacaoService] Iniciando processamento do job:', jobId);
    const response = await base44.functions.invoke('processarJobImportacao', { jobId });
    console.log('[ImportacaoService] Resposta do backend:', response);
    if (!response?.data) throw new Error('Resposta inválida do servidor');
    return response.data;
  } catch (err) {
    console.error('[ImportacaoService] Erro ao invocar função:', err);
    throw new Error(`Erro ao iniciar processamento: ${err.message}`);
  }
}

export async function obterStatusJob(jobId) {
  try {
    if (!jobId) throw new Error('JobId não informado');
    const jobs = await base44.entities.JobImportacao.filter({ id: jobId });
    if (!jobs?.length) throw new Error('Job não encontrado');
    return jobs[0];
  } catch (err) {
    throw new Error(`Erro ao buscar job: ${err.message}`);
  }
}

export function calcularProgresso(job) {
  if (!job || job.total_registros === 0) return 0;
  return Math.round((job.registros_processados / job.total_registros) * 100);
}

export async function validarDadosImportacao(dados, escritorioId) {
  const result = await base44.functions.invoke('importarProcessosLote', {
    action: 'validate',
    dados,
    escritorioId
  });
  return result.data;
}
import { base44 } from '@/api/base44Client';
import { extrairPartes } from './ProcessoPartesExtractor';
import { criarOuObterCliente } from './ClienteAutoService';
import { mapearProcessoCompleto } from './ProcessoMapper';
import { criarPartesSemDuplicar } from './PartesDedupService';

export async function importarProcessoCompleto(processoRaw, escritorioId, oabBuscada) {
  const partes = extrairPartes(processoRaw, oabBuscada);
  const parteCliente = partes.find(p => p.e_cliente_escritorio);

  const clienteId = await criarOuObterCliente(parteCliente, escritorioId);
  const dadosProcesso = mapearProcessoCompleto(processoRaw);

  const processo = await base44.entities.Processo.create({
    ...dadosProcesso,
    escritorio_id: escritorioId,
    cliente_id: clienteId
  });

  await criarPartesSemDuplicar(partes, processo.id, escritorioId, clienteId);

  return { processo, clienteId, totalPartes: partes.length };
}
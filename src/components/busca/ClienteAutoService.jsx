import { base44 } from '@/api/base44Client';

export async function criarOuObterCliente(parteCliente, escritorioId) {
  if (!parteCliente) return null;

  const filtro = {
    escritorio_id: escritorioId,
    nome_completo: parteCliente.nome
  };

  if (parteCliente.cpf_cnpj) {
    if (parteCliente.tipo_pessoa === 'fisica') {
      filtro.cpf = parteCliente.cpf_cnpj;
    } else {
      filtro.cnpj = parteCliente.cpf_cnpj;
    }
  }

  const existentes = await base44.entities.Cliente.filter(filtro);

  if (existentes.length > 0) {
    return existentes[0].id;
  }

  const novoCliente = await base44.entities.Cliente.create({
    escritorio_id: escritorioId,
    nome_completo: parteCliente.nome,
    tipo_pessoa: parteCliente.tipo_pessoa,
    cpf: parteCliente.tipo_pessoa === 'fisica' ? parteCliente.cpf_cnpj : null,
    cnpj: parteCliente.tipo_pessoa === 'juridica' ? parteCliente.cpf_cnpj : null,
    status: 'ativo'
  });

  return novoCliente.id;
}
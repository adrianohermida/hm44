import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useClienteValidation(escritorioId) {
  const verificarDuplicata = async (cpfCnpj, tipo) => {
    if (!cpfCnpj || !escritorioId) return { duplicata: false };

    const campo = tipo === 'fisica' ? 'cpf' : 'cnpj';
    const clientes = await base44.entities.Cliente.filter({
      escritorio_id: escritorioId,
      [campo]: cpfCnpj
    });

    return {
      duplicata: clientes.length > 0,
      clienteExistente: clientes[0] || null
    };
  };

  return { verificarDuplicata };
}
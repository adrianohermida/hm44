import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useClienteSearch(busca) {
  return useQuery({
    queryKey: ['clientes-search', busca],
    queryFn: async () => {
      const result = await base44.entities.Cliente.filter({}, undefined, 20);
      return result;
    },
    select: (data) => data.filter(c => {
      const termo = busca.toLowerCase();
      const nome = c.nome_completo?.toLowerCase() || c.razao_social?.toLowerCase() || '';
      const email = c.email_principal?.toLowerCase() || '';
      return nome.includes(termo) || email.includes(termo);
    }),
    enabled: busca.length > 2
  });
}
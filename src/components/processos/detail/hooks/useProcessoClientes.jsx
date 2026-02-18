import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useProcessoClientes(processoId, partes = []) {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list()
  });

  const partesClientes = partes.filter(p => p.e_cliente_escritorio === true);
  const clienteIds = partesClientes.map(p => p.cliente_id).filter(Boolean);

  return useQuery({
    queryKey: ['processo-clientes', processoId, ...clienteIds],
    queryFn: async () => {
      if (!escritorio?.[0]?.id) return [];
      if (clienteIds.length === 0) return [];
      
      const clientesPromises = clienteIds.map(id => 
        base44.entities.Cliente.filter({ id }).then(r => r[0]).catch(() => null)
      );
      
      const clientesResults = await Promise.all(clientesPromises);
      const clientes = clientesResults.filter(c => c && c.escritorio_id === escritorio[0].id);
      
      return clientes.map(c => {
        const parte = partesClientes.find(p => p.cliente_id === c.id);
        return {
          ...c,
          parte_id: parte?.id,
          parte_polo: parte?.tipo_parte,
          parte_qualificacao: parte?.qualificacao
        };
      });
    },
    enabled: !!processoId && !!escritorio?.[0]?.id && clienteIds.length > 0,
    staleTime: 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true
  });
}
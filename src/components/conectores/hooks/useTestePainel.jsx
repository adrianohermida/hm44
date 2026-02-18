import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useTestePainel(selectedId) {
  const [resultado, setResultado] = useState(null);

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio', user?.email],
    queryFn: async () => {
      if (user.role === 'admin' && user.email === 'adrianohermida@gmail.com') {
        const result = await base44.entities.Escritorio.list();
        return result[0];
      }
      const result = await base44.entities.Escritorio.filter({ created_by: user.email });
      return result[0];
    },
    enabled: !!user?.email
  });

  const { data: provedores = [] } = useQuery({
    queryKey: ['provedores', escritorio?.id, user?.email],
    queryFn: async () => {
      if (user.role === 'admin' && user.email === 'adrianohermida@gmail.com') {
        return await base44.entities.ProvedorAPI.list();
      }
      return await base44.entities.ProvedorAPI.filter({ escritorio_id: escritorio.id });
    },
    enabled: !!escritorio
  });

  const { data: endpoints = [] } = useQuery({
    queryKey: ['endpoints', escritorio?.id, user?.email],
    queryFn: async () => {
      if (user.role === 'admin' && user.email === 'adrianohermida@gmail.com') {
        return await base44.entities.EndpointAPI.list();
      }
      const allEndpoints = await base44.entities.EndpointAPI.list();
      return allEndpoints.filter(e => 
        provedores.some(p => p.id === e.provedor_id)
      );
    },
    enabled: !!escritorio && provedores.length > 0
  });

  const { data: testes = [] } = useQuery({
    queryKey: ['testes', selectedId, escritorio?.id],
    queryFn: () => base44.entities.TesteEndpoint.filter({ 
      endpoint_id: selectedId,
      escritorio_id: escritorio.id
    }),
    enabled: !!selectedId && !!escritorio
  });

  const { data: alertas = [] } = useQuery({
    queryKey: ['alertas', selectedId, escritorio?.id],
    queryFn: () => base44.entities.AlertaConector.filter({ 
      endpoint_id: selectedId,
      escritorio_id: escritorio.id
    }),
    enabled: !!selectedId && !!escritorio
  });

  const endpoint = endpoints.find(e => e.id === selectedId);

  return {
    endpoint,
    endpoints,
    provedores,
    testes,
    alertas,
    resultado,
    setResultado
  };
}
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useSocialProofsAprovados(tipo = null) {
  const { data: proofs = [] } = useQuery({
    queryKey: ['proofs-aprovados', tipo],
    queryFn: async () => {
      const query = { status: 'aprovado', conformidade_oab: true };
      if (tipo) query.tipo = tipo;
      return base44.entities.SocialProof.filter(query, '-score_credibilidade', 20);
    },
  });

  return { proofs };
}
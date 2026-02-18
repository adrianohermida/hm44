import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import AdvogadosOmniLayout from './AdvogadosOmniLayout';
import LoadingState from '@/components/common/LoadingState';

export default function AdvogadosTab({ escritorioId }) {
  const [filtros, setFiltros] = useState({ tipo: 'todos', vinculado: 'todos' });
  const [advogadoSelecionado, setAdvogadoSelecionado] = useState(null);

  const { data: partes = [], isLoading } = useQuery({
    queryKey: ['advogados-cadastrados', escritorioId],
    queryFn: () => base44.entities.ProcessoParte.filter({ escritorio_id: escritorioId }),
    enabled: !!escritorioId
  });

  // Extrair todos advogados das partes
  const advogados = partes
    .flatMap(parte => parte.advogados || [])
    .reduce((acc, adv) => {
      const key = `${adv.nome}-${adv.oab_numero}-${adv.oab_uf}`;
      if (!acc[key]) {
        acc[key] = { ...adv, processos: 1 };
      } else {
        acc[key].processos++;
      }
      return acc;
    }, {});

  const advogadosArray = Object.values(advogados).filter(adv => {
    if (filtros.vinculado === 'sim' && !adv.cliente_vinculado_id) return false;
    if (filtros.vinculado === 'nao' && adv.cliente_vinculado_id) return false;
    return true;
  });

  if (isLoading) return <LoadingState message="Carregando advogados..." />;

  return (
    <div className="h-[calc(100vh-300px)]">
      <AdvogadosOmniLayout
        advogados={advogadosArray}
        filtros={filtros}
        onFiltrosChange={setFiltros}
        advogadoSelecionado={advogadoSelecionado}
        onSelectAdvogado={setAdvogadoSelecionado}
      />
    </div>
  );
}
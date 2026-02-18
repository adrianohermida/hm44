import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import BuscaTribunalProgressModal from '@/components/processos/busca/BuscaTribunalProgressModal';

export default function BuscarNoTribunalButton({ 
  nome, 
  cpf_cnpj, 
  escritorio_id,
  compact = false 
}) {
  const [showModal, setShowModal] = useState(false);
  const [stats, setStats] = useState(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const queryClient = useQueryClient();

  const handleComplete = (data) => {
    queryClient.invalidateQueries(['processos']);
    queryClient.invalidateQueries(['processos-cliente']);
    queryClient.invalidateQueries(['processos-parte']);
    queryClient.invalidateQueries(['partes']);
    setShowModal(false);
  };

  React.useEffect(() => {
    if (nome && escritorio_id) {
      loadStats();
    }
  }, [nome, escritorio_id]);

  const loadStats = async () => {
    setIsLoadingStats(true);
    try {
      const response = await base44.functions.invoke('verificarProcessosDisponiveis', {
        nome,
        cpf_cnpj,
        escritorio_id,
        limite: 5000
      });
      setStats(response.data);
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
    setIsLoadingStats(false);
  };

  if (!nome) return null;

  const jaExistem = stats?.ja_cadastrados || 0;
  const faltam = stats?.faltam_cadastrar || 0;
  const total = jaExistem + faltam;
  const todosImportados = total > 0 && faltam === 0;

  return (
    <>
      <Button
        variant={compact ? "ghost" : "outline"}
        size={compact ? "sm" : "default"}
        onClick={() => setShowModal(true)}
        disabled={todosImportados || isLoadingStats}
        className="gap-2 relative"
      >
        <Search className="w-4 h-4" />
        <span>Buscar no Tribunal</span>
        {isLoadingStats ? (
          <Loader2 className="w-3 h-3 animate-spin ml-1" />
        ) : stats && total > 0 ? (
          <span className={`ml-1 px-2 py-0.5 rounded-full text-xs font-medium ${
            todosImportados 
              ? 'bg-green-100 text-green-700 border border-green-300'
              : faltam > 0
              ? 'bg-amber-100 text-amber-700 border border-amber-300'
              : 'bg-gray-100 text-gray-600 border border-gray-300'
          }`}>
            {jaExistem}/{total}
          </span>
        ) : null}
      </Button>

      <BuscaTribunalProgressModal
        open={showModal}
        onClose={() => setShowModal(false)}
        nome={nome}
        cpf_cnpj={cpf_cnpj}
        escritorio_id={escritorio_id}
        onComplete={handleComplete}
      />
    </>
  );
}
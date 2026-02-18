import { useMemo } from 'react';

export default function useClientePermissions(modo, userRole) {
  return useMemo(() => {
    const isCliente = modo === 'cliente' || userRole === 'user';
    
    return {
      canSeePrazos: !isCliente,
      canSeeAllDocs: !isCliente,
      canSeeAllTarefas: !isCliente,
      canSeeHonorarios: !isCliente,
      canSeeMovimentacoes: true,
      canSeePublicacoes: true,
      canSeePartes: true,
      canSeeInfoProcesso: true,
      canUploadDocs: true,
      canEditProcesso: !isCliente,
      canDeleteProcesso: !isCliente
    };
  }, [modo, userRole]);
}
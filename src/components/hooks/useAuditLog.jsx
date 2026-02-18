import { useMutation } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export default function useAuditLog() {
  const registrarAcesso = useMutation({
    mutationFn: async ({ recurso_tipo, recurso_id, acao, detalhes }) => {
      const user = await base44.auth.me();
      return base44.entities.AuditoriaAcesso.create({
        user_id: user.id,
        user_email: user.email,
        recurso_tipo,
        recurso_id,
        acao,
        detalhes,
        ip_address: null,
        user_agent: navigator.userAgent,
        timestamp: new Date().toISOString()
      });
    }
  });

  return {
    log: registrarAcesso.mutateAsync,
    logView: (recurso_tipo, recurso_id) => 
      registrarAcesso.mutate({ recurso_tipo, recurso_id, acao: 'VIEW' }),
    logEdit: (recurso_tipo, recurso_id, detalhes) => 
      registrarAcesso.mutate({ recurso_tipo, recurso_id, acao: 'EDIT', detalhes }),
    logDelete: (recurso_tipo, recurso_id) => 
      registrarAcesso.mutate({ recurso_tipo, recurso_id, acao: 'DELETE' }),
    logDownload: (recurso_tipo, recurso_id) => 
      registrarAcesso.mutate({ recurso_tipo, recurso_id, acao: 'DOWNLOAD' })
  };
}
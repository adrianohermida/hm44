import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export function useProcessoClientesActions() {
  const navigate = useNavigate();

  const handleLigar = (cliente) => {
    const telefone = cliente.telefone || cliente.telefones?.[0]?.numero;
    if (!telefone) {
      toast.error('Telefone não cadastrado');
      return;
    }
    window.open(`tel:${telefone}`);
  };

  const handleEmail = (cliente) => {
    if (!cliente.email) {
      toast.error('Email não cadastrado');
      return;
    }
    window.open(`mailto:${cliente.email}`);
  };

  const handleMensagem = (cliente) => {
    if (!cliente.email) {
      toast.error('Email não cadastrado');
      return;
    }
    window.dispatchEvent(new CustomEvent('openChatWithClient', {
      detail: { 
        clienteEmail: cliente.email, 
        clienteNome: cliente.nome_completo 
      }
    }));
  };

  const handleAgendar = () => {
    navigate(createPageUrl('AgendarConsulta'));
  };

  return {
    handleLigar,
    handleEmail,
    handleMensagem,
    handleAgendar
  };
}
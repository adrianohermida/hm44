import { 
  Inbox, 
  UserCircle, 
  FolderOpen,
  CheckCircle,
  Archive,
  AlertTriangle,
  XCircle,
  ClipboardList
} from 'lucide-react';
import { useMemo } from 'react';

export function useSidebarFilters(tickets = [], user, onFiltrosChange) {
  return useMemo(() => {
    const meusAbertos = tickets.filter(t => 
      t.responsavel_email === user?.email && 
      ['aberto', 'em_atendimento'].includes(t.status)
    ).length;
    
    const criadosPorMim = tickets.filter(t => t.created_by === user?.email).length;
    const todosCount = tickets.length;
    const triagem = tickets.filter(t => t.status === 'triagem').length;
    const naoResolvidos = tickets.filter(t => !['resolvido', 'fechado'].includes(t.status)).length;
    const fechados = tickets.filter(t => t.status === 'fechado').length;
    const arquivados = tickets.filter(t => t.arquivado).length;
    const spam = tickets.filter(t => t.is_spam).length;

    return [
    { 
      id: 'triagem', 
      label: 'Triagem', 
      icon: ClipboardList, 
      count: triagem,
      action: () => onFiltrosChange({ status: 'triagem', responsavel: 'todos', departamento: 'todos' })
    },
    { 
      id: 'meus_abertos', 
      label: 'Meus tickets abertos e novos', 
      icon: Inbox, 
      count: meusAbertos,
      action: () => onFiltrosChange({ status: 'aberto,em_atendimento', responsavel: 'meus', departamento: 'todos' })
    },
    { 
      id: 'criados', 
      label: 'Tickets criados por mim', 
      icon: UserCircle, 
      count: criadosPorMim,
      action: () => onFiltrosChange({ status: 'todos', created_by: user?.email, departamento: 'todos' })
    },
    { 
      id: 'todos', 
      label: 'Todos os tickets', 
      icon: FolderOpen, 
      count: todosCount,
      action: () => onFiltrosChange({ status: 'todos', responsavel: 'todos', departamento: 'todos' })
    },
    { 
      id: 'nao_resolvidos', 
      label: 'Todos os tickets não resolvidos', 
      icon: CheckCircle, 
      count: naoResolvidos,
      action: () => onFiltrosChange({ status: 'triagem,aberto,em_atendimento,aguardando_cliente', responsavel: 'todos', departamento: 'todos' })
    },
    { 
      id: 'fechados', 
      label: 'Fechados', 
      icon: XCircle, 
      count: fechados,
      action: () => onFiltrosChange({ status: 'fechado', responsavel: 'todos', departamento: 'todos' })
    },
    { 
      id: 'arquivados', 
      label: 'Arquivar', 
      icon: Archive, 
      count: arquivados,
      action: () => onFiltrosChange({ status: 'todos', arquivado: true, departamento: 'todos' })
    },
    { 
      id: 'spam', 
      label: 'Spam', 
      icon: AlertTriangle, 
      count: spam,
      action: () => onFiltrosChange({ status: 'todos', is_spam: true, departamento: 'todos' })
    },
  ];
  }, [tickets, user, onFiltrosChange]);
}
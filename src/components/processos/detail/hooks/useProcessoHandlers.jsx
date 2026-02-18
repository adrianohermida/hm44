import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';

export default function useProcessoHandlers(processoId, fromClient, actions, modals) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleBack = () => {
    if (fromClient) navigate(`${createPageUrl('ClienteDetalhes')}?id=${fromClient}`);
    else navigate(createPageUrl('Processos'));
  };

  const handleRefresh = async () => {
    try {
      toast.info('Atualizando andamento via API...');
      const { data } = await base44.functions.invoke('refreshProcessoEscavador', {
        processo_id: processoId
      });
      queryClient.invalidateQueries(['processo', processoId]);
      queryClient.invalidateQueries(['partes', processoId]);
      queryClient.invalidateQueries(['movimentacoes', processoId]);
      toast.success(data?.message || 'Processo atualizado com sucesso');
    } catch (error) {
      toast.error('Erro ao atualizar processo: ' + error.message);
    }
  };

  const handleExport = async () => {
    try {
      toast.info('Gerando PDF...');
      const response = await base44.functions.invoke('exportarProcessoPDF', {
        processo_id: processoId
      });
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `processo-${processoId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
      
      toast.success('PDF exportado com sucesso');
    } catch (error) {
      toast.error('Erro ao exportar PDF: ' + error.message);
    }
  };

  const handleChangePolo = (parte) => {
    const novoPolo = parte.tipo_parte === 'polo_ativo' ? 'polo_passivo' : 'polo_ativo';
    actions.updateParte.mutate({ id: parte.id, data: { ...parte, tipo_parte: novoPolo } });
  };

  const handleApensar = async (data) => {
    try {
      const targetProcesso = await base44.entities.Processo.filter({ numero_cnj: data.numero_cnj });
      if (!targetProcesso.length) return toast.error('Processo não encontrado');
      
      const processoFilho = data.direction === 'filho' ? targetProcesso[0].id : processoId;
      const processoPai = data.direction === 'filho' ? processoId : targetProcesso[0].id;
      
      // Atualizar processo filho com novo pai
      await base44.entities.Processo.update(processoFilho, {
        processo_pai_id: processoPai, 
        relation_type: data.relation_type 
      });

      // Herdar processos relacionados: todos os filhos do pai novo também se tornam irmãos
      const filhosDoPai = await base44.entities.Processo.filter({ processo_pai_id: processoPai });
      
      // Invalidar cache de todos os processos envolvidos
      queryClient.invalidateQueries(['processos-relacionados']);
      queryClient.invalidateQueries(['processo', processoFilho]);
      queryClient.invalidateQueries(['processo', processoPai]);
      
      // Invalidar cache dos irmãos
      filhosDoPai.forEach(p => {
        queryClient.invalidateQueries(['processo', p.id]);
      });
      
      modals.apensarModal.hide();
      toast.success(`Processo apensado. ${filhosDoPai.length} processos relacionados atualizados.`);
    } catch (error) {
      toast.error('Erro ao apensar processo');
    }
  };

  return { handleBack, handleRefresh, handleExport, handleChangePolo, handleApensar };
}
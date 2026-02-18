import { useProcessoMutation, useParteMutations, useDocumentoMutation } from './useProcessoMutations';
import { useAtendimentoMutations } from './useAtendimentoMutations';

export default function useProcessoActions() {
  const updateProcesso = useProcessoMutation();
  const { update: updateParte, remove: deleteParte } = useParteMutations();
  const deleteDocumento = useDocumentoMutation();
  const { update: updateAtendimento, remove: deleteAtendimento } = useAtendimentoMutations();

  return { updateProcesso, updateParte, deleteParte, deleteDocumento, updateAtendimento, deleteAtendimento };
}
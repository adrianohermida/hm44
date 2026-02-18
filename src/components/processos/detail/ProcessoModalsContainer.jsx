import React from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import ProcessoEditModal from './ProcessoEditModal';
import AdicionarParteModal from './AdicionarParteModal';
import DocumentoViewModal from './DocumentoViewModal';
import AtendimentoFormModal from './AtendimentoFormModal';
import DocumentoBatchUpload from './DocumentoBatchUpload';
import ApensarProcessoModal from './ApensarProcessoModal';

export default function ProcessoModalsContainer({ 
  processo, 
  modals, 
  actions, 
  viewingDoc,
  onCloseDoc,
  onApensar
}) {
  const queryClient = useQueryClient();
  const processoId = processo.id;

  return (
    <>
      <ProcessoEditModal 
        open={modals.editModal.open}
        onClose={modals.editModal.hide}
        processo={processo}
        onSave={(data) => {
          actions.updateProcesso.mutate({ id: processoId, data });
          modals.editModal.hide();
        }}
      />

      <AdicionarParteModal
        open={modals.parteModal.open}
        onClose={modals.parteModal.hide}
        processoId={processoId}
        escritorioId={processo.escritorio_id}
        parte={modals.parteModal.data}
        onSave={(data) => {
          if (modals.parteModal.data) {
            actions.updateParte.mutate({ id: modals.parteModal.data.id, data });
          } else {
            base44.entities.ProcessoParte.create({ ...data, processo_id: processoId, escritorio_id: processo.escritorio_id })
              .then(() => { 
                queryClient.invalidateQueries(['partes', processoId]);
                queryClient.invalidateQueries(['processo-partes']); 
                toast.success('Parte adicionada'); 
              });
          }
          modals.parteModal.hide();
        }}
      />

      <DocumentoBatchUpload
        open={modals.uploadModal.open}
        onClose={modals.uploadModal.hide}
        processoId={processoId}
        escritorioId={processo.escritorio_id}
        onSuccess={() => queryClient.invalidateQueries(['documentos'])}
      />

      <DocumentoViewModal open={!!viewingDoc} onClose={onCloseDoc} documento={viewingDoc} />

      <AtendimentoFormModal
        open={modals.atendModal.open}
        onClose={modals.atendModal.hide}
        atendimento={modals.atendModal.data}
        onSave={(data) => {
          if (modals.atendModal.data) {
            actions.updateAtendimento.mutate({ id: modals.atendModal.data.id, data });
          } else {
            base44.entities.Atendimento.create({ ...data, processo_id: processoId, cliente_id: processo.cliente_id })
              .then(() => { queryClient.invalidateQueries(['atendimentos']); toast.success('Atendimento registrado'); });
          }
          modals.atendModal.hide();
        }}
      />

      <ApensarProcessoModal
        open={modals.apensarModal.open}
        onClose={modals.apensarModal.hide}
        processoAtual={processo}
        onSave={onApensar}
      />
    </>
  );
}
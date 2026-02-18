import { useState } from 'react';

export default function useProcessoModals() {
  const [editModal, setEditModal] = useState({ open: false });
  const [parteModal, setParteModal] = useState({ open: false, data: null });
  const [uploadModal, setUploadModal] = useState({ open: false });
  const [atendModal, setAtendModal] = useState({ open: false, data: null });
  const [apensarModal, setApensarModal] = useState({ open: false });

  return {
    editModal: {
      open: editModal.open,
      show: () => setEditModal({ open: true }),
      hide: () => setEditModal({ open: false })
    },
    parteModal: {
      open: parteModal.open,
      data: parteModal.data,
      show: (data = null) => setParteModal({ open: true, data }),
      hide: () => setParteModal({ open: false, data: null })
    },
    uploadModal: {
      open: uploadModal.open,
      show: () => setUploadModal({ open: true }),
      hide: () => setUploadModal({ open: false })
    },
    atendModal: {
      open: atendModal.open,
      data: atendModal.data,
      show: (data = null) => setAtendModal({ open: true, data }),
      hide: () => setAtendModal({ open: false, data: null })
    },
    apensarModal: {
      open: apensarModal.open,
      show: () => setApensarModal({ open: true }),
      hide: () => setApensarModal({ open: false })
    }
  };
}
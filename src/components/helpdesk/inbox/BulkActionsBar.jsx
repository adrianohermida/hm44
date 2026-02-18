import React from 'react';
import DeleteConfirmDialog from '../DeleteConfirmDialog';
import BulkActionButtons from './BulkActionButtons';
import { useBulkActions } from './useBulkActions';

export default function BulkActionsBar({ selectedIds, totalTickets, onClearSelection, escritorioId }) {
  const {
    updateMutation,
    deleteMutation,
    showDeleteDialog,
    setShowDeleteDialog,
    isLoading
  } = useBulkActions(onClearSelection);

  const handleBulkAction = (status) => {
    updateMutation.mutate({ ids: selectedIds, data: { status } });
  };

  const confirmDelete = () => {
    deleteMutation.mutate(selectedIds);
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-semibold text-blue-900">
          {selectedIds.length} de {totalTickets} selecionado(s)
        </span>

        <BulkActionButtons
          onAbrir={() => handleBulkAction('aberto')}
          onResolver={() => handleBulkAction('resolvido')}
          onFechar={() => handleBulkAction('fechado')}
          onExcluir={() => setShowDeleteDialog(true)}
          onClear={onClearSelection}
          isLoading={isLoading}
        />
      </div>

      <DeleteConfirmDialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        onConfirm={confirmDelete}
        count={selectedIds.length}
        isLoading={isLoading}
      />
    </div>
  );
}
import React from 'react';
import EndpointCardContent from './cards/EndpointCardContent';
import EndpointCardActions from './cards/EndpointCardActions';
import useEndpointDelete from './hooks/useEndpointDelete';

const EndpointCard = React.memo(({ endpoint, selected, onClick, onEdit, onDelete, onViewDetails }) => {
  const { deletar } = useEndpointDelete();

  const handleDelete = (e) => {
    e.stopPropagation();
    deletar(endpoint.id, onDelete);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit?.(endpoint);
  };

  const handleViewDetails = (e) => {
    e.stopPropagation();
    onViewDetails?.(endpoint);
  };

  return (
    <div
      onClick={onClick}
      className={`w-full cursor-pointer text-left p-3 sm:p-4 rounded border transition-all min-h-[120px] flex flex-col group hover:shadow-md ${
        selected 
          ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)] shadow-sm' 
          : 'border-[var(--border-primary)] hover:border-[var(--brand-primary-200)]'
      }`}
    >
      <EndpointCardContent endpoint={endpoint} />
      <div className="opacity-80 group-hover:opacity-100 transition-opacity">
        <EndpointCardActions 
          onEdit={onEdit ? handleEdit : null}
          onDelete={onDelete ? handleDelete : null}
          onViewDetails={onViewDetails ? handleViewDetails : null}
        />
      </div>
    </div>
  );
});

EndpointCard.displayName = 'EndpointCard';

export default EndpointCard;
import React from 'react';
import AttachmentItem from './AttachmentItem';

export default function AttachmentList({ anexos = [], onRemove }) {
  if (anexos.length === 0) return null;

  return (
    <div className="space-y-1 mb-2">
      {anexos.map((anexo, idx) => (
        <AttachmentItem
          key={idx}
          anexo={anexo}
          onRemove={() => onRemove(idx)}
        />
      ))}
    </div>
  );
}
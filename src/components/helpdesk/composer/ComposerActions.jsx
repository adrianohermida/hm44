import React from 'react';
import ComposerActionsButtons from './ComposerActionsButtons';
import ComposerSubmitButton from './ComposerSubmitButton';

export default function ComposerActions({ 
  onToggleAI,
  onToggleNota,
  onEncaminhar,
  onToggleTemplates,
  onSubmit,
  onSubmitWithStatus,
  disabled,
  isLoading 
}) {
  return (
    <div className="flex items-center justify-between px-4 pb-3">
      <ComposerActionsButtons 
        onToggleAI={onToggleAI}
        onToggleNota={onToggleNota}
        onEncaminhar={onEncaminhar}
        onToggleTemplates={onToggleTemplates}
      />
      <ComposerSubmitButton
        onSubmit={onSubmit}
        onSubmitWithStatus={onSubmitWithStatus}
        disabled={disabled}
        isLoading={isLoading}
      />
    </div>
  );
}
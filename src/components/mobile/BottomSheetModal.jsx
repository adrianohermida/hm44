import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSwipeDismiss } from '@/components/mobile/SwipeDismiss';

export default function BottomSheetModal({ 
  open, 
  onClose, 
  title, 
  children,
  actions = null,
  fullHeight = false 
}) {
  const sheetRef = useSwipeDismiss(onClose, 50);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        ref={sheetRef}
        className={`fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[var(--bg-primary)] rounded-t-2xl transition-all duration-300 ${
          fullHeight ? 'max-h-[90vh]' : 'max-h-[75vh]'
        } overflow-y-auto`}
      >
        {/* Handle Bar */}
        <div className="flex justify-center py-2">
          <div className="w-12 h-1 rounded-full bg-[var(--border-primary)]" />
        </div>

        {/* Header */}
        {title && (
          <div className="sticky top-0 bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">
              {title}
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        )}

        {/* Content */}
        <div className="p-4 pb-20">{children}</div>

        {/* Actions */}
        {actions && (
          <div className="fixed bottom-0 left-0 right-0 bg-[var(--bg-primary)] border-t border-[var(--border-primary)] p-4 flex gap-2">
            {actions}
          </div>
        )}
      </div>
    </>
  );
}
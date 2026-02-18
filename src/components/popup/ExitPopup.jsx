import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ExitPopupContent from './ExitPopupContent';
import ExitPopupForm from './ExitPopupForm';
import { useExitIntent } from '@/components/hooks/useExitIntent';

export default function ExitPopup() {
  const { show, setShow } = useExitIntent();

  const handleSuccess = () => {
    setShow(false);
    alert('✅ Guia enviado para seu e-mail!');
  };

  return (
    <Dialog open={show} onOpenChange={setShow}>
      <DialogContent className="max-w-md">
        <ExitPopupContent onClose={() => setShow(false)} />
        <ExitPopupForm onSuccess={handleSuccess} />
      </DialogContent>
    </Dialog>
  );
}
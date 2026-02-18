import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import ImportarProvedorModal from './ImportarProvedorModal';

export default function ImportarProvedorCSVButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <Upload className="w-4 h-4 mr-2" />
        Importar CSV
      </Button>
      {open && <ImportarProvedorModal onClose={() => setOpen(false)} />}
    </>
  );
}
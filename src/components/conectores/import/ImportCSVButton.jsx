import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';
import ImportCSVPanel from './ImportCSVPanel';

export default function ImportCSVButton({ onSuccess }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        <Upload className="w-4 h-4 mr-2" />
        Importar CSV
      </Button>
      {open && (
        <ImportCSVPanel 
          open={open} 
          onClose={() => setOpen(false)} 
          onSuccess={onSuccess} 
        />
      )}
    </>
  );
}
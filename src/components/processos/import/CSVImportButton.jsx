import React from 'react';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

export default function CSVImportButton({ onClick }) {
  return (
    <Button 
      onClick={onClick} 
      variant="outline"
      className="gap-2"
    >
      <Upload className="w-4 h-4" />
      Importar CSV
    </Button>
  );
}
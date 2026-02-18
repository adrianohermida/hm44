import React from 'react';
import { Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PublicacoesUploadZone({ file, onFileChange }) {
  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
      <input
        type="file"
        accept=".csv"
        onChange={onFileChange}
        className="hidden"
        id="csv-upload"
      />
      <label htmlFor="csv-upload">
        <Button variant="outline" asChild>
          <span>Selecionar arquivo CSV</span>
        </Button>
      </label>
      {file && (
        <p className="mt-2 text-sm text-green-600">
          ✓ {file.name}
        </p>
      )}
    </div>
  );
}
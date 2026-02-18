import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FileUp } from 'lucide-react';

export default function CSVUploader({ onParsed, encoding, delimiter }) {
  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      let text = evt.target.result;
      
      if (encoding === 'latin1') {
        text = text.replace(/Ã¡/g, 'á').replace(/Ã©/g, 'é').replace(/Ã§/g, 'ç');
      }

      const lines = text.split('\n').filter(l => l.trim());
      const headers = lines[0].split(delimiter);
      
      const data = lines.slice(1).map(line => {
        const values = line.split(delimiter);
        const obj = {};
        headers.forEach((h, i) => {
          obj[h.trim()] = values[i]?.trim() || '';
        });
        return obj;
      });
      
      onParsed(data);
    };
    reader.readAsText(file, encoding);
  };

  return (
    <div className="border-2 border-dashed rounded-lg p-8 text-center">
      <FileUp className="w-12 h-12 mx-auto mb-4 text-[var(--text-tertiary)]" />
      <Label htmlFor="csv-upload" className="cursor-pointer">
        <span className="text-[var(--brand-primary)] font-semibold">Selecionar CSV</span>
      </Label>
      <Input
        id="csv-upload"
        type="file"
        accept=".csv"
        onChange={handleFile}
        className="hidden"
      />
    </div>
  );
}
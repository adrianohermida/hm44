import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { base44 } from '@/api/base44Client';
import CSVUploader from './CSVUploader';
import ImportPreview from './ImportPreview';
import ImportProgress from './ImportProgress';
import EncodingDetector from './EncodingDetector';

export default function ImportCSVPanel({ open, onClose, onSuccess }) {
  const [step, setStep] = useState('upload');
  const [parsed, setParsed] = useState([]);
  const [encoding, setEncoding] = useState('utf-8');
  const [delimiter, setDelimiter] = useState(';');
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  const handleParsed = (data) => {
    setParsed(data);
    setStep('preview');
  };

  const handleImport = async () => {
    setImporting(true);
    setStep('importing');
    try {
      const { data } = await base44.functions.invoke('importarEndpointsCSV', {
        endpoints: parsed
      });
      setProgress({ current: data.imported, total: parsed.length });
      onSuccess(data.imported);
      setTimeout(() => onClose(), 2000);
    } catch (error) {
      console.error(error);
    } finally {
      setImporting(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[600px] overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Importar Endpoints via CSV</SheetTitle>
        </SheetHeader>
        <div className="space-y-4 mt-6">
          {step === 'upload' && (
            <>
              <EncodingDetector 
                encoding={encoding}
                delimiter={delimiter}
                onEncodingChange={setEncoding}
                onDelimiterChange={setDelimiter}
              />
              <CSVUploader 
                onParsed={handleParsed} 
                encoding={encoding}
                delimiter={delimiter}
              />
            </>
          )}
          {step === 'preview' && (
            <ImportPreview data={parsed} onConfirm={handleImport} onBack={() => setStep('upload')} />
          )}
          {step === 'importing' && <ImportProgress progress={progress} />}
        </div>
      </SheetContent>
    </Sheet>
  );
}
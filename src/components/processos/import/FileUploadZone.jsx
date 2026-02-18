import React, { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { parseFile } from './parsers/fileParser';
import { detectEncoding } from './parsers/encodingDetector';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export default function FileUploadZone({ onDataParsed, disabled }) {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;
    
    const validExtensions = ['.csv', '.xlsx', '.xls', '.json'];
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf('.'));
    if (!validExtensions.includes(ext)) {
      toast.error('Formato inválido. Use CSV, Excel ou JSON');
      return;
    }

    setLoading(true);
    try {
      const parsedData = await parseFile(file);
      onDataParsed(parsedData);
      toast.success(`${parsedData.length} registros carregados`);
    } catch (error) {
      toast.error(`Erro ao processar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && !loading) setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (disabled || loading) return;
    handleFile(e.dataTransfer.files[0]);
  };

  const handleFileChange = (e) => {
    handleFile(e.target.files[0]);
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200",
        isDragging 
          ? 'border-blue-500 bg-blue-50 scale-105 shadow-lg' 
          : 'border-[var(--border-primary)] bg-[var(--bg-secondary)] hover:border-blue-300',
        (disabled || loading) && 'cursor-not-allowed opacity-60'
      )}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,.xlsx,.xls,.json"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || loading}
      />
      
      {loading ? (
        <div className="space-y-3">
          <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin" />
          <p className="text-sm text-[var(--text-secondary)]">Processando arquivo...</p>
        </div>
      ) : (
        <>
          <div className={cn(
            "w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center transition-colors",
            isDragging ? 'bg-blue-100' : 'bg-[var(--bg-tertiary)]'
          )}>
            <Upload className={cn(
              "w-8 h-8 transition-colors",
              isDragging ? 'text-blue-600' : 'text-[var(--text-tertiary)]'
            )} />
          </div>
          
          <p className="text-[var(--text-primary)] font-medium mb-2">
            {isDragging ? '📂 Solte o arquivo aqui' : 'Arraste o arquivo ou clique para selecionar'}
          </p>
          
          <p className="text-sm text-[var(--text-tertiary)] mb-4">
            CSV, XLSX, XLS, JSON • Máx: 10.000 registros
          </p>
          
          <Button 
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || loading}
          >
            <Upload className="w-4 h-4 mr-2" />
            Selecionar Arquivo
          </Button>
        </>
      )}
    </div>
  );
}
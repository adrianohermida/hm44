import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Paperclip, X } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import RespostasRapidas from './RespostasRapidas';

export default function MensagemInput({ onEnviar, onAnexoAdicionado, value, onChange, compact, loading }) {
  const [texto, setTexto] = useState('');
  const [arquivos, setArquivos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const currentValue = value !== undefined ? value : texto;
  const setCurrentValue = onChange !== undefined ? onChange : setTexto;

  const handleEnviar = async () => {
    if (!currentValue.trim() && arquivos.length === 0) return;
    
    const anexos = arquivos.map(f => ({
      url: f.url,
      nome: f.nome,
      tipo: f.tipo
    }));
    
    await onEnviar(currentValue, anexos);
    setCurrentValue('');
    setArquivos([]);
  };

  const handleFileSelect = async (files) => {
    setUploading(true);
    try {
      const novosArquivos = [];
      for (const file of files) {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        novosArquivos.push({
          url: file_url,
          nome: file.name,
          tipo: file.type
        });
        if (onAnexoAdicionado) onAnexoAdicionado({ url: file_url, nome: file.name, tipo: file.type });
      }
      setArquivos([...arquivos, ...novosArquivos]);
      toast.success('Arquivo(s) anexado(s)');
    } catch (error) {
      toast.error('Erro ao anexar arquivo');
    }
    setUploading(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect(files);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = () => {
    setDragActive(false);
  };

  const removerArquivo = (index) => {
    setArquivos(arquivos.filter((_, i) => i !== index));
  };

  const containerPadding = compact ? 'p-2' : 'p-4';
  const inputHeight = compact ? 'h-10' : 'h-14';
  const iconSize = compact ? 'w-4 h-4' : 'w-5 h-5';
  const buttonSize = compact ? 'h-9 w-9' : 'h-12 w-12';

  return (
    <div 
      className={`${containerPadding} border-t bg-white ${dragActive ? 'bg-[var(--brand-primary-50)]' : ''}`}
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
      {arquivos.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {arquivos.map((arquivo, index) => (
            <div key={index} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded text-xs">
              <span className="truncate max-w-[100px]">{arquivo.nome}</span>
              <button onClick={() => removerArquivo(index)} className="p-0.5">
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
      <div className="flex gap-2 items-end">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(Array.from(e.target.files))}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || loading}
          className={`${buttonSize} flex-shrink-0`}
        >
          <Paperclip className={iconSize} />
        </Button>
        <div className="flex-1">
          <Input
            placeholder="Mensagem..."
            value={currentValue}
            onChange={(e) => setCurrentValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleEnviar()}
            className={`${inputHeight} ${compact ? 'text-sm' : 'text-base'}`}
          />
        </div>
        <Button 
          onClick={handleEnviar} 
          className={`bg-[var(--brand-primary)] ${buttonSize} flex-shrink-0`}
          disabled={uploading || loading}
          size="icon"
        >
          <Send className={iconSize} />
        </Button>
      </div>
    </div>
  );
}
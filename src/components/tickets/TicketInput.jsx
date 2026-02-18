import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Paperclip, Loader2 } from 'lucide-react';
import AttachmentPreview from './AttachmentPreview';
import { base44 } from '@/api/base44Client';

export default function TicketInput({ onSend, disabled }) {
  const [texto, setTexto] = useState('');
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleSend = async () => {
    if (!texto.trim() && files.length === 0) return;
    
    setUploading(true);
    const anexos = await uploadFiles();
    await onSend(texto, anexos);
    setTexto('');
    setFiles([]);
    setUploading(false);
  };

  const uploadFiles = async () => {
    if (files.length === 0) return [];
    
    const uploads = await Promise.all(
      files.map(async (file) => {
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        return { url: file_url, nome: file.name, tipo: file.type };
      })
    );
    return uploads;
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(prev => [...prev, ...droppedFiles]);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div 
      className={`border-t border-[var(--border-primary)] ${isDragging ? 'bg-[var(--brand-primary-50)]' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <AttachmentPreview files={files} onRemove={removeFile} />
      <div className="p-4 flex gap-2">
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading || disabled}
        >
          <Paperclip className="w-4 h-4" />
        </Button>
        <input
          placeholder="Digite sua mensagem..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
          className="flex-1 px-3 py-2 border border-[var(--border-primary)] rounded-md text-sm"
          disabled={uploading || disabled}
        />
        <Button 
          onClick={handleSend} 
          className="bg-[var(--brand-primary)]"
          disabled={uploading || disabled || (!texto.trim() && files.length === 0)}
        >
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
        </Button>
      </div>
    </div>
  );
}
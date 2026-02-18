import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2 } from 'lucide-react';
import ContentGeneratorForm from './ContentGeneratorForm';
import ContentGeneratorPreview from './ContentGeneratorPreview';
import { useContentGenerator } from './hooks/useContentGenerator';

export default function ContentGeneratorModal({ open, onClose }) {
  const [config, setConfig] = useState(null);
  const [preview, setPreview] = useState(null);
  const { generateMutation, saveMutation } = useContentGenerator();

  const handleGenerate = async (formData) => {
    setConfig(formData);
    const result = await generateMutation.mutateAsync(formData);
    setPreview(result);
  };

  const handleSave = async () => {
    await saveMutation.mutateAsync({ config, content: preview });
    onClose();
  };

  const handleReset = () => {
    setConfig(null);
    setPreview(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[var(--brand-primary)]" />
            Gerador de Conteúdo IA
          </DialogTitle>
        </DialogHeader>

        {!preview ? (
          <ContentGeneratorForm 
            onGenerate={handleGenerate}
            loading={generateMutation.isPending}
          />
        ) : (
          <ContentGeneratorPreview
            content={preview}
            config={config}
            onSave={handleSave}
            onRegenerate={handleReset}
            loading={saveMutation.isPending}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
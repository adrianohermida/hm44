import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';

export default function TemplateEditor({ template, onChange }) {
  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">
            Nome do Template
          </label>
          <Input 
            value={template.nome} 
            onChange={(e) => onChange({...template, nome: e.target.value})}
            placeholder="Ex: Newsletter Mensal"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">
            Assunto
          </label>
          <Input 
            value={template.assunto} 
            onChange={(e) => onChange({...template, assunto: e.target.value})}
            placeholder="Ex: Novidades Jurídicas"
          />
        </div>
        <div>
          <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">
            Conteúdo HTML
          </label>
          <Textarea 
            value={template.html} 
            onChange={(e) => onChange({...template, html: e.target.value})}
            placeholder="Cole ou escreva seu HTML aqui..."
            className="min-h-[300px] font-mono text-sm"
          />
        </div>
      </div>
    </Card>
  );
}
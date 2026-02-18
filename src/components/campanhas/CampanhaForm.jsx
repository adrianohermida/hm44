import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Send } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';

export default function CampanhaForm({ onSubmit, isLoading }) {
  const [form, setForm] = useState({
    titulo: '',
    assunto: '',
    mensagem: '',
    template_id: '',
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.TemplateEmail.list('-updated_date'),
  });

  const handleTemplateSelect = (templateId) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setForm({
        ...form,
        template_id: templateId,
        assunto: template.assunto,
        mensagem: template.html,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">Usar Template</label>
        <Select onValueChange={handleTemplateSelect}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione um template (opcional)" />
          </SelectTrigger>
          <SelectContent>
            {templates.map(t => (
              <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">Título da Campanha</label>
        <Input 
          value={form.titulo} 
          onChange={(e) => setForm({...form, titulo: e.target.value})}
          placeholder="Ex: Newsletter Mensal"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">Assunto do Email</label>
        <Input 
          value={form.assunto} 
          onChange={(e) => setForm({...form, assunto: e.target.value})}
          placeholder="Ex: Novidades Jurídicas de Janeiro"
          required
        />
      </div>
      <div>
        <label className="text-sm font-medium mb-2 block text-[var(--text-primary)]">Mensagem</label>
        <Textarea 
          value={form.mensagem} 
          onChange={(e) => setForm({...form, mensagem: e.target.value})}
          placeholder="Digite a mensagem da campanha..."
          className="min-h-[200px]"
          required
        />
      </div>
      <Button type="submit" disabled={isLoading} className="w-full bg-[var(--brand-primary)]">
        <Send className="w-4 h-4 mr-2" />
        {isLoading ? 'Enviando...' : 'Enviar Campanha'}
      </Button>
    </form>
  );
}
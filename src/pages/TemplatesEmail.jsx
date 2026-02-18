import React, { useState, useEffect } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Button } from '@/components/ui/button';
import { Plus, Save } from 'lucide-react';
import TemplateEditor from '@/components/campanhas/TemplateEditor';
import TemplatePreview from '@/components/campanhas/TemplatePreview';
import AITemplateGenerator from '@/components/campanhas/AITemplateGenerator';
import TemplateList from '@/components/campanhas/TemplateList';
import VisualBuilder from '@/components/campanhas/VisualBuilder';
import UnsubscribeFooter from '@/components/campanhas/UnsubscribeFooter';
import { toast } from 'sonner';

export default function TemplatesEmail() {
  const [user, setUser] = useState(null);
  const [currentTemplate, setCurrentTemplate] = useState({
    nome: '', assunto: '', html: ''
  });
  const queryClient = useQueryClient();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    const userData = await base44.auth.me();
    setUser(userData);
  };

  const { data: templates = [] } = useQuery({
    queryKey: ['templates'],
    queryFn: () => base44.entities.TemplateEmail.list('-updated_date'),
  });

  const saveMutation = useMutation({
    mutationFn: async () => {
      const data = {
        ...currentTemplate,
        escritorio_id: user?.escritorio_id || '6948bed65e7da7a1c1eb64d1'
      };
      if (currentTemplate.id) {
        return base44.entities.TemplateEmail.update(currentTemplate.id, data);
      }
      return base44.entities.TemplateEmail.create(data);
    },
    onSuccess: () => {
      toast.success('Template salvo!');
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      setCurrentTemplate({ nome: '', assunto: '', html: '' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.TemplateEmail.delete(id),
    onSuccess: () => {
      toast.success('Template excluído!');
      queryClient.invalidateQueries({ queryKey: ['templates'] });
    },
  });

  const generateMutation = useMutation({
    mutationFn: async (prompt) => {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Crie um template de email HTML profissional e responsivo para um escritório de advocacia. ${prompt}. 
        Use cores elegantes, estrutura clean, e inclua header, corpo e footer. 
        Retorne apenas o HTML completo.`,
      });
      return response;
    },
    onSuccess: (html) => {
      setCurrentTemplate(prev => ({ ...prev, html }));
      toast.success('Template gerado!');
    },
  });

  const handleInsert = (html) => {
    setCurrentTemplate(prev => ({ ...prev, html: prev.html + '\n' + html }));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] p-6">
      <div className="max-w-7xl mx-auto">
        <Breadcrumb items={[{ label: 'Templates de Email' }]} />
        
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">Templates de Email</h1>
          <Button onClick={() => saveMutation.mutate()} disabled={!currentTemplate.nome} className="bg-[var(--brand-primary)]">
            <Save className="w-4 h-4 mr-2" />
            Salvar Template
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <TemplateEditor template={currentTemplate} onChange={setCurrentTemplate} />
            <UnsubscribeFooter unsubscribeToken="EXEMPLO-TOKEN" />
            <TemplatePreview html={currentTemplate.html} />
          </div>

          <div className="space-y-6">
            <AITemplateGenerator 
              onGenerate={(prompt) => generateMutation.mutate(prompt)}
              isLoading={generateMutation.isPending}
            />
            <VisualBuilder onInsert={handleInsert} />
            <div>
              <h3 className="text-lg font-bold text-[var(--text-primary)] mb-4">Meus Templates</h3>
              <TemplateList 
                templates={templates}
                onSelect={setCurrentTemplate}
                onDelete={(id) => deleteMutation.mutate(id)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
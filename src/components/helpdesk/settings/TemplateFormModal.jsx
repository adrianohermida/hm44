import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { Copy } from 'lucide-react';

export default function TemplateFormModal({ template, onClose, escritorioId }) {
  const [formData, setFormData] = useState(template || {
    nome: '',
    assunto: '',
    corpo: '',
    atalho: '',
    categoria: 'outro'
  });

  const queryClient = useQueryClient();

  const variaveis = [
    { grupo: 'Cliente', itens: ['{{cliente.nome}}', '{{cliente.email}}', '{{cliente.telefone}}'] },
    { grupo: 'Ticket', itens: ['{{ticket.numero}}', '{{ticket.titulo}}', '{{ticket.status}}', '{{ticket.prioridade}}'] },
    { grupo: 'Agente', itens: ['{{agente.nome}}', '{{agente.email}}'] },
    { grupo: 'Escritório', itens: ['{{escritorio.nome}}', '{{escritorio.email}}', '{{escritorio.telefone}}'] },
    { grupo: 'Data', itens: ['{{data.hoje}}', '{{data.hora}}', '{{data.completa}}'] }
  ];

  const inserirVariavel = (variavel) => {
    const textarea = document.querySelector('textarea[name="corpo"]');
    if (!textarea) return;
    
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const texto = formData.corpo || '';
    const novoTexto = texto.substring(0, start) + variavel + texto.substring(end);
    
    setFormData({...formData, corpo: novoTexto});
    toast.success('Variável inserida');
    
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + variavel.length, start + variavel.length);
    }, 0);
  };

  const saveMutation = useMutation({
    mutationFn: (data) => {
      if (template) {
        return base44.entities.TemplateResposta.update(template.id, data);
      }
      return base44.entities.TemplateResposta.create({ ...data, escritorio_id: escritorioId });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['templates-resposta']);
      toast.success('Template salvo');
      onClose();
    }
  });

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>{template ? 'Editar' : 'Novo'} Template</DialogTitle>
        </DialogHeader>
        
        <div className="flex gap-6 flex-1 overflow-hidden">
          {/* Form Principal */}
          <div className="flex-1 space-y-4 overflow-y-auto pr-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Nome do Template</Label>
                <Input 
                  value={formData.nome} 
                  onChange={(e) => setFormData({...formData, nome: e.target.value})} 
                  placeholder="Ex: Boas-vindas ao cliente"
                />
              </div>
              <div>
                <Label>Categoria</Label>
                <Select 
                  value={formData.categoria} 
                  onValueChange={(value) => setFormData({...formData, categoria: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="boas_vindas">👋 Boas-vindas</SelectItem>
                    <SelectItem value="confirmacao">✅ Confirmação</SelectItem>
                    <SelectItem value="resolucao">🎯 Resolução</SelectItem>
                    <SelectItem value="follow_up">📬 Follow-up</SelectItem>
                    <SelectItem value="outro">📝 Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Atalho (opcional)</Label>
              <Input 
                value={formData.atalho} 
                onChange={(e) => setFormData({...formData, atalho: e.target.value})} 
                placeholder="Ex: /bv"
              />
            </div>

            <div>
              <Label>Assunto do Email (opcional)</Label>
              <Input 
                value={formData.assunto} 
                onChange={(e) => setFormData({...formData, assunto: e.target.value})}
                placeholder="Ex: Re: {{ticket.titulo}}"
              />
            </div>

            <div>
              <Label>Corpo da Mensagem</Label>
              <Textarea 
                name="corpo"
                value={formData.corpo} 
                onChange={(e) => setFormData({...formData, corpo: e.target.value})}
                className="min-h-[300px] font-mono text-sm"
                placeholder="Olá {{cliente.nome}}, obrigado por entrar em contato..."
              />
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>Cancelar</Button>
              <Button 
                onClick={() => saveMutation.mutate(formData)} 
                disabled={saveMutation.isPending || !formData.nome || !formData.corpo}
              >
                {saveMutation.isPending ? 'Salvando...' : 'Salvar Template'}
              </Button>
            </div>
          </div>

          {/* Sidebar Variáveis */}
          <div className="w-64 border-l border-[var(--border-primary)] pl-6 overflow-y-auto">
            <h3 className="text-sm font-semibold mb-3">Variáveis Disponíveis</h3>
            <div className="space-y-3">
              {variaveis.map(({ grupo, itens }) => (
                <div key={grupo}>
                  <h4 className="text-xs font-semibold text-[var(--text-secondary)] mb-1">
                    {grupo}
                  </h4>
                  <div className="space-y-1">
                    {itens.map(v => (
                      <button
                        key={v}
                        onClick={() => inserirVariavel(v)}
                        className="w-full flex items-center justify-between p-2 rounded hover:bg-[var(--bg-tertiary)] transition-colors group"
                      >
                        <code className="text-xs text-[var(--brand-primary)] font-mono">
                          {v}
                        </code>
                        <Copy className="w-3 h-3 opacity-0 group-hover:opacity-100 text-[var(--text-secondary)]" />
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4 p-2 bg-[var(--bg-tertiary)] rounded text-xs text-[var(--text-secondary)]">
              💡 Clique em uma variável para inserir no cursor
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
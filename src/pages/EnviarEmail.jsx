import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Paperclip, X, Upload, Loader2, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

export default function EnviarEmail() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  
  const [formData, setFormData] = useState({
    para: [],
    paraInput: '',
    cc: [],
    ccInput: '',
    assunto: '',
    corpo: '',
    prioridade: 'media',
    status: 'aberto',
    grupo: '',
    tipo: 'email',
    tags: ''
  });

  const [anexos, setAnexos] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showAISuggestions, setShowAISuggestions] = useState(false);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos'],
    queryFn: () => base44.entities.Departamento.filter({ ativo: true })
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates-email'],
    queryFn: () => base44.entities.TemplateResposta.filter({ ativo: true })
  });

  const { data: clientes = [] } = useQuery({
    queryKey: ['clientes-autocomplete', formData.paraInput],
    queryFn: () => base44.entities.Cliente.filter({}, undefined, 50),
    select: (data) => data
      .map(c => ({
        id: c.id,
        nome: c.nome_completo || c.razao_social || 'Sem nome',
        email: c.email_principal || c.emails?.[0]?.email
      }))
      .filter(c => c.email && c.email.toLowerCase().includes(formData.paraInput.toLowerCase())),
    enabled: formData.paraInput.length > 2
  });

  const uploadMutation = useMutation({
    mutationFn: async (file) => {
      const { data } = await base44.integrations.Core.UploadFile({ file });
      return data;
    },
    onSuccess: (data, file) => {
      setAnexos(prev => [...prev, {
        url: data.file_url,
        nome: file.name,
        tipo: file.type,
        size: file.size
      }]);
      toast.success('Arquivo anexado');
    },
    onError: () => toast.error('Erro ao anexar arquivo')
  });

  const enviarEmailMutation = useMutation({
    mutationFn: async (data) => {
      const ticket = await base44.entities.Ticket.create({
        escritorio_id: escritorio.id,
        titulo: data.assunto,
        descricao: data.corpo,
        cliente_email: data.para[0],
        status: data.status,
        prioridade: data.prioridade,
        departamento_id: data.grupo || null,
        canal: 'email',
        categoria: data.tipo,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        numero_ticket: `T${Date.now()}`,
        ultima_atualizacao: new Date().toISOString()
      });

      await base44.functions.invoke('sendEmailSendGrid', {
        ticket_id: ticket.id,
        to: data.para[0],
        cc: data.cc,
        subject: data.assunto,
        body: data.corpo,
        attachments: anexos.map(a => ({ url: a.url, filename: a.nome }))
      });

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Email enviado com sucesso!');
      navigate(createPageUrl('Helpdesk'));
    },
    onError: (error) => toast.error('Erro: ' + error.message)
  });

  const handleAddEmail = (type = 'para') => {
    const inputValue = type === 'para' ? formData.paraInput : formData.ccInput;
    const field = type === 'para' ? 'para' : 'cc';
    const inputField = type === 'para' ? 'paraInput' : 'ccInput';

    if (inputValue && inputValue.includes('@')) {
      setFormData({
        ...formData,
        [field]: [...formData[field], inputValue],
        [inputField]: ''
      });
    }
  };

  const handleRemoveEmail = (email, type = 'para') => {
    setFormData({
      ...formData,
      [type]: formData[type].filter(e => e !== email)
    });
  };

  const handleSelectCliente = (cliente) => {
    if (!formData.para.includes(cliente.email)) {
      setFormData({
        ...formData,
        para: [...formData.para, cliente.email],
        paraInput: ''
      });
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} excede 20MB`);
        return;
      }
      uploadMutation.mutate(file);
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragActive(false);
    const files = Array.from(e.dataTransfer.files);
    files.forEach(file => {
      if (file.size > 20 * 1024 * 1024) {
        toast.error(`${file.name} excede 20MB`);
        return;
      }
      uploadMutation.mutate(file);
    });
  };

  const handleSelectTemplate = (template) => {
    setFormData({
      ...formData,
      corpo: template.corpo,
      assunto: template.assunto || formData.assunto
    });
    setShowTemplates(false);
    toast.success('Template aplicado');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (formData.para.length === 0) {
      toast.error('Adicione pelo menos um destinatário');
      return;
    }

    if (!formData.assunto.trim()) {
      toast.error('Preencha o assunto');
      return;
    }

    if (!formData.corpo.trim()) {
      toast.error('Escreva uma mensagem');
      return;
    }

    enviarEmailMutation.mutate(formData);
  };

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'size': ['small', false, 'large', 'huge'] }],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'align': [] }],
      ['link', 'image'],
      [{ 'color': [] }, { 'background': [] }],
      ['blockquote', 'code-block'],
      ['clean']
    ]
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto p-6">
        <Breadcrumb items={[
          { label: 'Atendimento', url: createPageUrl('Helpdesk') },
          { label: 'Novo Email' }
        ]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Novo Email
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Crie um ticket e envie email profissional
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <form onSubmit={handleSubmit} className="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)] p-6 space-y-4">
              {/* PARA */}
              <div className="space-y-2">
                <Label>Para *</Label>
                <div className="relative">
                  <Input
                    type="email"
                    value={formData.paraInput}
                    onChange={(e) => setFormData({ ...formData, paraInput: e.target.value })}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail('para'))}
                    placeholder="Digite email ou escolha contato..."
                    autoComplete="off"
                  />
                  
                  {formData.paraInput.length > 2 && clientes.length > 0 && (
                    <div className="absolute z-50 w-full mt-1 bg-white border border-[var(--border-primary)] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {clientes.map(cliente => (
                        <button
                          key={cliente.id}
                          type="button"
                          onClick={() => handleSelectCliente(cliente)}
                          className="w-full text-left p-3 hover:bg-[var(--bg-tertiary)] transition-colors border-b last:border-0"
                        >
                          <div className="font-medium text-sm">{cliente.nome}</div>
                          <div className="text-xs text-[var(--text-secondary)]">{cliente.email}</div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {formData.para.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.para.map(email => (
                      <div key={email} className="flex items-center gap-1 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-2 py-1 rounded">
                        <span className="text-sm">{email}</span>
                        <button type="button" onClick={() => handleRemoveEmail(email, 'para')}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* CC */}
              <div className="space-y-2">
                <Label>CC (opcional)</Label>
                <Input
                  type="email"
                  value={formData.ccInput}
                  onChange={(e) => setFormData({ ...formData, ccInput: e.target.value })}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddEmail('cc'))}
                  placeholder="email@exemplo.com"
                />
                {formData.cc.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.cc.map(email => (
                      <div key={email} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded">
                        <span className="text-sm">{email}</span>
                        <button type="button" onClick={() => handleRemoveEmail(email, 'cc')}>
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ASSUNTO */}
              <div className="space-y-2">
                <Label>Assunto *</Label>
                <Input
                  value={formData.assunto}
                  onChange={(e) => setFormData({ ...formData, assunto: e.target.value })}
                  placeholder="Assunto do email"
                  required
                />
              </div>

              {/* TAGS */}
              <div className="space-y-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="urgente, pendente, cliente-vip"
                />
              </div>

              {/* EDITOR */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Descrição *</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowTemplates(!showTemplates)}
                    >
                      Respostas Predefinidas
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setShowAISuggestions(!showAISuggestions)}
                    >
                      <Sparkles className="w-4 h-4 mr-1" />
                      Sugestões IA
                    </Button>
                  </div>
                </div>

                {showTemplates && (
                  <div className="border border-[var(--border-primary)] rounded-lg p-3 space-y-2 mb-2">
                    {templates.map(t => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => handleSelectTemplate(t)}
                        className="w-full text-left p-2 hover:bg-[var(--bg-tertiary)] rounded"
                      >
                        <div className="font-medium text-sm">{t.nome}</div>
                        {t.atalho && <div className="text-xs text-[var(--text-tertiary)]">Atalho: {t.atalho}</div>}
                      </button>
                    ))}
                  </div>
                )}

                <ReactQuill
                  theme="snow"
                  value={formData.corpo}
                  onChange={(value) => setFormData({ ...formData, corpo: value })}
                  modules={quillModules}
                  placeholder="Digite sua mensagem..."
                  className="h-64 mb-12"
                />
              </div>

              {/* ANEXOS */}
              <div
                className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  dragActive ? 'border-[var(--brand-primary)] bg-[var(--brand-primary-50)]' : 'border-[var(--border-primary)]'
                }`}
                onDragEnter={() => setDragActive(true)}
                onDragLeave={() => setDragActive(false)}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <Upload className="w-8 h-8 mx-auto mb-2 text-[var(--text-tertiary)]" />
                <p className="text-sm text-[var(--text-primary)] mb-1">
                  Arraste arquivos ou{' '}
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[var(--brand-primary)] hover:underline"
                  >
                    clique para anexar
                  </button>
                </p>
                <p className="text-xs text-[var(--text-tertiary)]">
                  Até 20MB por arquivo
                </p>

                {anexos.length > 0 && (
                  <div className="mt-4 space-y-2">
                    {anexos.map((anexo, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-[var(--bg-secondary)] rounded">
                        <div className="flex items-center gap-2">
                          <Paperclip className="w-4 h-4 text-[var(--text-tertiary)]" />
                          <span className="text-sm">{anexo.nome}</span>
                          <span className="text-xs text-[var(--text-tertiary)]">
                            ({(anexo.size / 1024).toFixed(1)} KB)
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAnexos(prev => prev.filter((_, i) => i !== idx))}
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* METADATA */}
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-[var(--border-primary)]">
                <div className="space-y-2">
                  <Label>Prioridade</Label>
                  <Select value={formData.prioridade} onValueChange={(v) => setFormData({ ...formData, prioridade: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="baixa">Baixa</SelectItem>
                      <SelectItem value="media">Média</SelectItem>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="urgente">Urgente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={formData.status} onValueChange={(v) => setFormData({ ...formData, status: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="aberto">Aberto</SelectItem>
                      <SelectItem value="em_atendimento">Em Atendimento</SelectItem>
                      <SelectItem value="aguardando_cliente">Pendente</SelectItem>
                      <SelectItem value="resolvido">Resolvido</SelectItem>
                      <SelectItem value="fechado">Fechado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Grupo (Departamento)</Label>
                  <Select value={formData.grupo} onValueChange={(v) => setFormData({ ...formData, grupo: v })}>
                    <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value={null}>Nenhum</SelectItem>
                      {departamentos.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tipo</Label>
                  <Select value={formData.tipo} onValueChange={(v) => setFormData({ ...formData, tipo: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="duvida">Dúvida</SelectItem>
                      <SelectItem value="problema">Problema</SelectItem>
                      <SelectItem value="solicitacao">Solicitação</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* ACTIONS */}
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)}>
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={enviarEmailMutation.isPending || uploadMutation.isPending}
                  className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
                >
                  {enviarEmailMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar Email
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          {/* SIDEBAR */}
          <div className="space-y-4">
            <div className="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)] p-4">
              <h3 className="font-semibold mb-3">Dicas</h3>
              <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                <li>• Ctrl+B: Negrito</li>
                <li>• Ctrl+I: Itálico</li>
                <li>• Ctrl+U: Sublinhado</li>
                <li>• Use templates para agilizar</li>
                <li>• Anexe até 20MB por arquivo</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
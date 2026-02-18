import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Send, Loader2 } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { toast } from 'sonner';
import Breadcrumb from '@/components/seo/Breadcrumb';
import ProcessoSelector from '@/components/helpdesk/processo/ProcessoSelector';
import ClienteAutocompleteEnhanced from '@/components/helpdesk/ticket/ClienteAutocompleteEnhanced';
import ClienteSidebar from '@/components/helpdesk/ticket/ClienteSidebar';
import DescricaoComAnexos from '@/components/helpdesk/ticket/DescricaoComAnexos';
import EmailDetailsCard from '@/components/helpdesk/email/EmailDetailsCard';

export default function EnviarTicket() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const location = useLocation();
  
  const processoInicial = location.state?.processo || null;
  
  const [clienteSelecionado, setClienteSelecionado] = useState(null);
  const [formData, setFormData] = useState({
    titulo: processoInicial ? `Suporte - Processo ${processoInicial.numero_cnj || processoInicial.titulo}` : '',
    descricao: processoInicial ? `Ticket a partir do processo: ${processoInicial.titulo}\nNúmero CNJ: ${processoInicial.numero_cnj || 'N/A'}` : '',
    prioridade: 'media',
    categoria: 'duvida',
    canal: 'email',
    departamento_id: '',
    processo_id: processoInicial?.id || '',
    tags: ''
  });

  const [anexos, setAnexos] = useState([]);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: departamentos = [] } = useQuery({
    queryKey: ['departamentos', escritorio?.id],
    queryFn: () => base44.entities.Departamento.filter({ 
      escritorio_id: escritorio.id,
      ativo: true 
    }),
    enabled: !!escritorio?.id
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['templates-ticket', escritorio?.id],
    queryFn: () => base44.entities.TemplateResposta.filter({ 
      escritorio_id: escritorio.id,
      ativo: true 
    }),
    enabled: !!escritorio?.id
  });

  const { data: tarefasCliente = [] } = useQuery({
    queryKey: ['tarefas-cliente', clienteSelecionado?.id],
    queryFn: () => base44.entities.Tarefa.filter({
      cliente_id: clienteSelecionado.id,
      status: 'pendente'
    }),
    enabled: !!clienteSelecionado?.id
  });

  const { data: timelineCliente = [] } = useQuery({
    queryKey: ['timeline-cliente', clienteSelecionado?.id],
    queryFn: async () => {
      const tickets = await base44.entities.Ticket.filter({
        cliente_id: clienteSelecionado.id
      });
      return tickets.slice(0, 10);
    },
    enabled: !!clienteSelecionado?.id
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

  const criarTicketMutation = useMutation({
    mutationFn: async (data) => {
      if (!clienteSelecionado) {
        throw new Error('Selecione um cliente');
      }

      const ticket = await base44.entities.Ticket.create({
        escritorio_id: escritorio.id,
        titulo: data.titulo,
        descricao: data.descricao,
        cliente_id: clienteSelecionado.id,
        cliente_email: clienteSelecionado.email_principal,
        cliente_nome: clienteSelecionado.nome_completo || clienteSelecionado.razao_social,
        status: 'aberto',
        prioridade: data.prioridade,
        categoria: data.categoria,
        canal: data.canal,
        departamento_id: data.departamento_id || null,
        processo_id: data.processo_id || null,
        tags: data.tags ? data.tags.split(',').map(t => t.trim()) : [],
        numero_ticket: `T${Date.now()}`,
        ultima_atualizacao: new Date().toISOString()
      });

      if (anexos.length > 0) {
        await base44.entities.TicketMensagem.create({
          escritorio_id: escritorio.id,
          ticket_id: ticket.id,
          remetente_email: clienteSelecionado.email_principal,
          remetente_nome: clienteSelecionado.nome_completo || clienteSelecionado.razao_social,
          tipo_remetente: 'cliente',
          conteudo: 'Anexos enviados',
          anexos: anexos,
          canal: data.canal
        });
      }

      return ticket;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['helpdesk-tickets']);
      toast.success('Ticket criado com sucesso!');
      navigate(createPageUrl('Helpdesk'));
    },
    onError: (error) => toast.error('Erro: ' + error.message)
  });

  const handleUploadFile = (file) => {
    if (file.size > 20 * 1024 * 1024) {
      toast.error(`${file.name} excede 20MB`);
      return;
    }
    uploadMutation.mutate(file);
  };

  const handleSelectTemplate = (template) => {
    setFormData({
      ...formData,
      descricao: template.corpo,
      titulo: template.assunto || formData.titulo
    });
    toast.success('Template aplicado');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!clienteSelecionado) {
      toast.error('Selecione um cliente');
      return;
    }

    if (!formData.titulo.trim()) {
      toast.error('Preencha o título');
      return;
    }

    criarTicketMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <Breadcrumb items={[
          { label: 'Atendimento', url: createPageUrl('Helpdesk') },
          { label: 'Novo Ticket' }
        ]} />

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)]">
              Novo Ticket
            </h1>
            <p className="text-sm text-[var(--text-secondary)]">
              Abra um novo ticket de atendimento
            </p>
          </div>

          <Button variant="outline" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <form 
              onSubmit={handleSubmit} 
              className="bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)] p-4 md:p-6 space-y-4"
            >
              {processoInicial && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="text-sm text-blue-900">
                    <strong>Processo vinculado:</strong> {processoInicial.numero_cnj || processoInicial.titulo}
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Buscar Cliente *</Label>
                <ClienteAutocompleteEnhanced
                  selectedCliente={clienteSelecionado}
                  onSelect={setClienteSelecionado}
                  onCreate={() => navigate(createPageUrl('Clientes'))}
                />
              </div>

              {formData.titulo && (
                <div className="space-y-2">
                  <Input
                    placeholder="Email do destinatário"
                    value={formData.cliente_email}
                    onChange={(e) => setFormData({ ...formData, cliente_email: e.target.value })}
                  />
                  {formData.cliente_email && (
                    <EmailDetailsCard email={formData.cliente_email} />
                  )}
                </div>
              )}

              {clienteSelecionado && (
                <ProcessoSelector
                  clienteId={clienteSelecionado.id}
                  onSelect={(processo) => {
                    setFormData({ ...formData, processo_id: processo.id });
                    toast.success('Processo vinculado');
                  }}
                  onSkip={() => {}}
                />
              )}

              <div className="space-y-2">
                <Label>Título *</Label>
                <Input
                  value={formData.titulo}
                  onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                  placeholder="Resumo do ticket"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label>Tags (separadas por vírgula)</Label>
                <Input
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="urgente, dúvida, cliente-vip"
                />
              </div>

              <DescricaoComAnexos
                value={formData.descricao}
                onChange={(value) => setFormData({ ...formData, descricao: value })}
                anexos={anexos}
                onAnexosChange={setAnexos}
                templates={templates}
                onSelectTemplate={handleSelectTemplate}
                isUploading={uploadMutation.isPending}
                onUpload={handleUploadFile}
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-[var(--border-primary)]">
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
                  <Label>Categoria</Label>
                  <Select value={formData.categoria} onValueChange={(v) => setFormData({ ...formData, categoria: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="duvida">Dúvida</SelectItem>
                      <SelectItem value="problema">Problema</SelectItem>
                      <SelectItem value="solicitacao">Solicitação</SelectItem>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Canal</Label>
                  <Select value={formData.canal} onValueChange={(v) => setFormData({ ...formData, canal: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="chat">Chat</SelectItem>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Departamento</Label>
                  <Select value={formData.departamento_id} onValueChange={(v) => setFormData({ ...formData, departamento_id: v })}>
                    <SelectTrigger><SelectValue placeholder="Nenhum" /></SelectTrigger>
                    <SelectContent>
                      {departamentos.map(d => (
                        <SelectItem key={d.id} value={d.id}>{d.nome}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col-reverse md:flex-row justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => navigate(-1)} className="w-full md:w-auto">
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={criarTicketMutation.isPending || uploadMutation.isPending}
                  className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] w-full md:w-auto"
                >
                  {criarTicketMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Criando...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Criar Ticket
                    </>
                  )}
                </Button>
              </div>
            </form>
          </div>

          <div className="space-y-4">
            {clienteSelecionado ? (
              <ClienteSidebar 
                cliente={clienteSelecionado}
                tarefas={tarefasCliente}
                timeline={timelineCliente}
              />
            ) : (
              <div className="hidden lg:block bg-[var(--bg-elevated)] rounded-lg border border-[var(--border-primary)] p-4">
                <h3 className="font-semibold mb-3">Dicas</h3>
                <ul className="text-sm text-[var(--text-secondary)] space-y-2">
                  <li>• Selecione cliente da lista</li>
                  <li>• Use templates para agilizar</li>
                  <li>• Arraste arquivos na descrição</li>
                  <li>• Defina prioridade correta</li>
                  <li>• Tags ajudam na organização</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
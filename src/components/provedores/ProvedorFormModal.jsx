import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import useProvedorOperations from './hooks/useProvedorOperations';
import { toast } from 'sonner';
import OAuthConfigEditor from './OAuthConfigEditor';
import { Loader2 } from 'lucide-react';
import ErrorBoundary from '@/components/common/ErrorBoundary';

const SECRETS_DISPONIVEIS = [
  'YOUTUBE_API_KEY',
  'YOUTUBE_ANALYTICS_API_KEY',
  'YOUTUBE_CLIENT_ID',
  'YOUTUBE_SECRET_KEY',
  'ESCAVADOR_API_TOKEN',
  'DATAJUD_API_TOKEN',
  'DIRECTDATA_API_KEY',
  'SENDGRID_API_TOKEN',
  'OUTRO_PERSONALIZADO'
];

function ProvedorFormModalContent({ provedor, onClose }) {
  const [form, setForm] = useState({
    id: provedor?.id || null,
    codigo_identificador: provedor?.codigo_identificador || '', 
    nome: provedor?.nome || '', 
    tipo: provedor?.tipo || 'REST', 
    requer_autenticacao: provedor?.requer_autenticacao ?? true,
    tipo_autenticacao: provedor?.tipo_autenticacao || 'api_key',
    base_url_v1: provedor?.base_url_v1 || '', 
    base_url_v2: provedor?.base_url_v2 || '', 
    secret_name: provedor?.secret_name || '', 
    api_key_config: provedor?.api_key_config || { secret_name: '', header_name: 'Authorization', prefix: 'Bearer' },
    oauth_config: provedor?.oauth_config || {},
    documentacao_url: provedor?.documentacao_url || '', 
    endpoint_saldo_id: provedor?.endpoint_saldo_id || '',
    ativo: provedor?.ativo ?? true
  });

  const { save, saving } = useProvedorOperations();

  const handleSave = () => {
    if (!form.nome?.trim()) {
      toast.error('Nome do provedor é obrigatório');
      return;
    }
    if (!form.tipo) {
      toast.error('Tipo da API é obrigatório');
      return;
    }
    if (form.requer_autenticacao && form.tipo_autenticacao === 'api_key' && !form.api_key_config?.secret_name) {
      toast.error('Selecione o secret para autenticação');
      return;
    }
    
    const savedForm = { 
      ...form,
      id: provedor?.id || null,
      oauth_config: form.oauth_config || {},
      api_key_config: form.api_key_config || {}
    };
    
    if (form.tipo_autenticacao === 'api_key' && form.api_key_config?.secret_name) {
      savedForm.secret_name = form.api_key_config.secret_name;
    }
    
    save(savedForm);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle>{provedor ? 'Editar' : 'Novo'} Provedor</DialogTitle></DialogHeader>
        <div className="space-y-3 max-h-[70vh] overflow-y-auto">
          <Input placeholder="Código Identificador (ex: ESCAV-001)" value={form.codigo_identificador || ''} onChange={e => setForm({...form, codigo_identificador: e.target.value})} />
          <Input placeholder="Nome" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} />
          <Select value={form.tipo} onValueChange={v => setForm({...form, tipo: v})}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {['REST','SOAP','GRAPHQL'].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2">
            <Checkbox 
              id="requer_auth"
              checked={form.requer_autenticacao} 
              onCheckedChange={v => setForm({...form, requer_autenticacao: v})} 
            />
            <Label htmlFor="requer_auth" className="text-sm">Requer autenticação</Label>
          </div>
          
          <Select value={form.tipo_autenticacao || 'api_key'} onValueChange={v => setForm({...form, tipo_autenticacao: v})}>
            <SelectTrigger><SelectValue placeholder="Tipo Autenticação" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="api_key">API Key</SelectItem>
              <SelectItem value="oauth2">OAuth 2.0</SelectItem>
              <SelectItem value="bearer_token">Bearer Token</SelectItem>
              <SelectItem value="hybrid">Híbrido (OAuth + API Key)</SelectItem>
            </SelectContent>
          </Select>

          <Input placeholder="URL Base V1" value={form.base_url_v1} onChange={e => setForm({...form, base_url_v1: e.target.value})} />
          <Input placeholder="URL Base V2" value={form.base_url_v2} onChange={e => setForm({...form, base_url_v2: e.target.value})} />
          
          {form.requer_autenticacao && (form.tipo_autenticacao === 'api_key' || form.tipo_autenticacao === 'hybrid') && (
            <>
              <Label className="text-sm font-medium">API Key Configuration</Label>
              <Select 
                value={form.api_key_config?.secret_name || ''} 
                onValueChange={v => setForm({...form, api_key_config: {...(form.api_key_config || {}), secret_name: v}})}
              >
                <SelectTrigger><SelectValue placeholder="Selecione o Secret" /></SelectTrigger>
                <SelectContent>
                  {SECRETS_DISPONIVEIS.map(s => (
                    <SelectItem key={s} value={s}>{s}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <div className="grid grid-cols-2 gap-2">
                <Input 
                  placeholder="Header (ex: X-API-Key)" 
                  value={form.api_key_config?.header_name || 'Authorization'} 
                  onChange={e => setForm({...form, api_key_config: {...(form.api_key_config || {}), header_name: e.target.value}})} 
                />
                <Input 
                  placeholder="Prefixo (ex: Bearer)" 
                  value={form.api_key_config?.prefix || ''} 
                  onChange={e => setForm({...form, api_key_config: {...(form.api_key_config || {}), prefix: e.target.value}})} 
                />
              </div>
              <Input 
                placeholder="Query Param Name (opcional, ex: key)" 
                value={form.api_key_config?.query_param_name || ''} 
                onChange={e => setForm({...form, api_key_config: {...(form.api_key_config || {}), query_param_name: e.target.value}})} 
              />
            </>
          )}

          {form.requer_autenticacao && (form.tipo_autenticacao === 'oauth2' || form.tipo_autenticacao === 'hybrid') && (
            <OAuthConfigEditor 
              value={form.oauth_config}
              onChange={oauth_config => setForm({...form, oauth_config})}
              providerName={form.nome}
            />
          )}
          
          <Input placeholder="URL Documentação" value={form.documentacao_url} onChange={e => setForm({...form, documentacao_url: e.target.value})} />
          
          <Label className="text-sm font-medium">Endpoint de Saldo (opcional)</Label>
          <Input 
            placeholder="ID do Endpoint de Saldo" 
            value={form.endpoint_saldo_id || ''} 
            onChange={e => setForm({...form, endpoint_saldo_id: e.target.value})} 
          />
          
          <div className="flex gap-2 pt-2">
            <Button onClick={onClose} variant="outline" disabled={saving}>
              Cancelar
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProvedorFormModal(props) {
  return (
    <ErrorBoundary>
      <ProvedorFormModalContent {...props} />
    </ErrorBoundary>
  );
}
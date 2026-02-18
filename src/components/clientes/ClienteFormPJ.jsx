import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import CNPJInput from './CNPJInput';
import ClienteFormBasicFields from './ClienteFormBasicFields';
import ClienteFormAddressFields from './ClienteFormAddressFields';
import EnderecosList from './forms/EnderecosList';
import TelefonesList from './forms/TelefonesList';
import EmailsList from './forms/EmailsList';
import { useClienteValidation } from './hooks/useClienteValidation';

export default function ClienteFormPJ({ cliente, onSubmit, onCancel, escritorioId }) {
  const { verificarDuplicata } = useClienteValidation(escritorioId);
  const [duplicataInfo, setDuplicataInfo] = useState(null);
  const [loadingCNPJ, setLoadingCNPJ] = useState(false);
  const [form, setForm] = useState({
    tipo_pessoa: 'juridica',
    nome_completo: cliente?.nome_completo || '',
    cnpj: cliente?.cnpj || '',
    email: cliente?.email || '',
    emails_adicionais: cliente?.emails_adicionais || [],
    telefone: cliente?.telefone || '',
    telefone_secundario: cliente?.telefone_secundario || '',
    telefones_adicionais: cliente?.telefones_adicionais || [],
    endereco: cliente?.endereco || {},
    enderecos_adicionais: cliente?.enderecos_adicionais || [],
    observacoes: cliente?.observacoes || ''
  });

  const consultarCNPJ = async () => {
    if (!form.cnpj || form.cnpj.replace(/\D/g, '').length !== 14) {
      toast.error('CNPJ inválido');
      return;
    }

    setLoadingCNPJ(true);
    try {
      const { data: result } = await base44.functions.invoke('consultarCNPJDirectData', { cnpj: form.cnpj });

      if (result.error) {
        toast.error(result.error);
        return;
      }

      if (result.retorno) {
        const ret = result.retorno;
        const emails = ret.Emails || ret.emails || [];
        const telefones = ret.Telefones || ret.telefones || [];
        const enderecos = ret.Enderecos || ret.enderecos || [];
        
        setForm(prev => ({
          ...prev,
          nome_completo: ret.RazaoSocial || ret.razaoSocial || ret.NomeFantasia || ret.nomeFantasia || prev.nome_completo,
          email: emails[0]?.EnderecoEmail || emails[0]?.enderecoEmail || prev.email,
          emails_adicionais: emails.map(e => ({
            email: e.EnderecoEmail || e.enderecoEmail,
            tipo: 'trabalho'
          })),
          telefone: telefones[0]?.TelefoneComDDD || telefones[0]?.telefoneComDDD || prev.telefone,
          telefones_adicionais: telefones.map(t => ({
            telefone: t.TelefoneComDDD || t.telefoneComDDD,
            tipo: 'comercial',
            operadora: t.Operadora || t.operadora
          })),
          endereco: enderecos[0] ? {
            logradouro: enderecos[0].Logradouro || enderecos[0].logradouro || '',
            numero: enderecos[0].Numero || enderecos[0].numero || '',
            complemento: enderecos[0].Complemento || enderecos[0].complemento || '',
            bairro: enderecos[0].Bairro || enderecos[0].bairro || '',
            cidade: enderecos[0].Cidade || enderecos[0].cidade || '',
            estado: enderecos[0].UF || enderecos[0].uf || '',
            cep: enderecos[0].CEP || enderecos[0].cep || ''
          } : prev.endereco,
          enderecos_adicionais: enderecos.map((e, idx) => ({
            tipo: 'comercial',
            logradouro: e.Logradouro || e.logradouro || '',
            numero: e.Numero || e.numero || '',
            complemento: e.Complemento || e.complemento || '',
            bairro: e.Bairro || e.bairro || '',
            cidade: e.Cidade || e.cidade || '',
            estado: e.UF || e.uf || '',
            cep: e.CEP || e.cep || '',
            preferencial_correspondencia: idx === 0
          })),
          dados_enriquecidos_api: result
        }));
        toast.success('Dados preenchidos automaticamente');
      }
    } catch (error) {
      toast.error('Erro ao consultar CNPJ');
    } finally {
      setLoadingCNPJ(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar duplicata se não estiver editando
    if (!cliente && form.cnpj) {
      const { duplicata, clienteExistente } = await verificarDuplicata(
        form.cnpj.replace(/\D/g, ''),
        'juridica'
      );

      if (duplicata) {
        setDuplicataInfo(clienteExistente);
        toast.error('Cliente com este CNPJ já existe!');
        return;
      }
    }

    // Normalizar CNPJ para cpf_cnpj
    const dadosNormalizados = {
      ...form,
      cpf_cnpj: form.cnpj?.replace(/\D/g, '')
    };

    onSubmit(dadosNormalizados);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {duplicataInfo && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Cliente já cadastrado: <strong>{duplicataInfo.nome_completo}</strong>
            {duplicataInfo.email && ` (${duplicataInfo.email})`}
          </AlertDescription>
        </Alert>
      )}

      <div>
        <Label>CNPJ *</Label>
        <CNPJInput
          value={form.cnpj}
          onChange={(value) => {
            setForm({ ...form, cnpj: value });
            setDuplicataInfo(null);
          }}
          onConsultar={consultarCNPJ}
          loading={loadingCNPJ}
        />
      </div>
      <ClienteFormBasicFields form={form} setForm={setForm} tipoPessoa="juridica" />
      <ClienteFormAddressFields form={form} setForm={setForm} />
      
      <EmailsList 
        emails={form.emails_adicionais} 
        onChange={(emails) => setForm({...form, emails_adicionais: emails})} 
      />
      
      <TelefonesList 
        telefones={form.telefones_adicionais} 
        onChange={(tels) => setForm({...form, telefones_adicionais: tels})} 
      />
      
      <EnderecosList 
        enderecos={form.enderecos_adicionais} 
        onChange={(ends) => setForm({...form, enderecos_adicionais: ends})} 
      />
      
      <div>
        <Label>Observações</Label>
        <Textarea
          value={form.observacoes}
          onChange={(e) => setForm({ ...form, observacoes: e.target.value })}
          className="bg-[var(--bg-primary)] border-[var(--border-primary)]"
        />
      </div>
      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" className="bg-[var(--brand-primary)]">Salvar</Button>
      </div>
    </form>
  );
}
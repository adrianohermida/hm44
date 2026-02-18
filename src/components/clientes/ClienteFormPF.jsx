import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';
import CPFInput from './CPFInput';
import ClienteFormBasicFields from './ClienteFormBasicFields';
import ClienteFormAddressFields from './ClienteFormAddressFields';
import EnderecosList from './forms/EnderecosList';
import TelefonesList from './forms/TelefonesList';
import EmailsList from './forms/EmailsList';
import ConjugeSelector from './forms/ConjugeSelector';
import { useClienteValidation } from './hooks/useClienteValidation';

export default function ClienteFormPF({ cliente, onSubmit, onCancel, escritorioId }) {
  const { verificarDuplicata } = useClienteValidation(escritorioId);
  const [duplicataInfo, setDuplicataInfo] = useState(null);
  const [form, setForm] = useState({
    tipo_pessoa: 'fisica',
    nome_completo: cliente?.nome_completo || '',
    cpf: cliente?.cpf || '',
    rg: cliente?.rg || '',
    data_nascimento: cliente?.data_nascimento || '',
    estado_civil: cliente?.estado_civil || 'solteiro',
    filiacao: cliente?.filiacao || {},
    profissao: cliente?.profissao || '',
    nacionalidade: cliente?.nacionalidade || 'brasileira',
    email: cliente?.email || '',
    emails_adicionais: cliente?.emails_adicionais || [],
    telefone: cliente?.telefone || '',
    telefone_secundario: cliente?.telefone_secundario || '',
    telefones_adicionais: cliente?.telefones_adicionais || [],
    endereco: cliente?.endereco || {},
    enderecos_adicionais: cliente?.enderecos_adicionais || [],
    observacoes: cliente?.observacoes || ''
  });
  const [loadingCPF, setLoadingCPF] = useState(false);

  const consultarCPF = async () => {
    if (!form.cpf || form.cpf.replace(/\D/g, '').length !== 11) {
      toast.error('CPF inválido');
      return;
    }

    setLoadingCPF(true);
    try {
      const { data: result } = await base44.functions.invoke('consultarCPFDirectData', { cpf: form.cpf });

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
          nome_completo: ret.Nome || ret.nome || prev.nome_completo,
          sexo: ret.Sexo?.toLowerCase() || ret.sexo?.toLowerCase() || prev.sexo,
          data_nascimento: (ret.DataNascimento || ret.dataNascimento)?.split('T')[0] || prev.data_nascimento,
          estado_civil: prev.estado_civil,
          profissao: ret.Profissao || ret.profissao || prev.profissao,
          codigo_profissao: ret.CodigoProfissao || ret.codigoProfissao || prev.codigo_profissao,
          renda_mensal_individual: ret.RendaPresumida || ret.rendaPresumida || prev.renda_mensal_individual,
          filiacao: {
            nome_mae: ret.NomeMae || ret.nomeMae || prev.filiacao?.nome_mae || '',
            nome_pai: ret.NomePai || ret.nomePai || prev.filiacao?.nome_pai || ''
          },
          renda_estimada: ret.RendaEstimada || ret.rendaEstimada || prev.renda_estimada,
          faixa_salarial: ret.RendaFaixaSalarial || ret.rendaFaixaSalarial || prev.faixa_salarial,
          nacionalidade: ret.Nacionalidade || ret.nacionalidade || prev.nacionalidade,
          email: emails[0]?.EnderecoEmail || emails[0]?.enderecoEmail || prev.email,
          emails_adicionais: emails.map(e => ({
            email: e.EnderecoEmail || e.enderecoEmail,
            tipo: 'pessoal'
          })),
          telefone: telefones[0]?.TelefoneComDDD || telefones[0]?.telefoneComDDD || prev.telefone,
          telefones_adicionais: telefones.map(t => ({
            telefone: t.TelefoneComDDD || t.telefoneComDDD,
            tipo: (t.TipoTelefone || t.tipoTelefone)?.toLowerCase() || 'celular',
            operadora: t.Operadora || t.operadora,
            whatsapp: (t.WhatsApp || t.whatsApp) === 'SIM'
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
            tipo: 'residencial',
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
      toast.error('Erro ao consultar CPF');
    } finally {
      setLoadingCPF(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Verificar duplicata se não estiver editando
    if (!cliente && form.cpf) {
      const { duplicata, clienteExistente } = await verificarDuplicata(
        form.cpf.replace(/\D/g, ''),
        'fisica'
      );

      if (duplicata) {
        setDuplicataInfo(clienteExistente);
        toast.error('Cliente com este CPF já existe!');
        return;
      }
    }

    // Normalizar CPF para cpf_cnpj
    const dadosNormalizados = {
      ...form,
      cpf_cnpj: form.cpf?.replace(/\D/g, '')
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
        <Label>CPF *</Label>
        <CPFInput
          value={form.cpf}
          onChange={(value) => {
            setForm({ ...form, cpf: value });
            setDuplicataInfo(null);
          }}
          onConsultar={consultarCPF}
          loading={loadingCPF}
        />
      </div>
      <ClienteFormBasicFields form={form} setForm={setForm} tipoPessoa="fisica" />
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

      {(form.estado_civil === 'casado' || form.estado_civil === 'uniao_estavel') && (
        <ConjugeSelector 
          value={form.conjuge_id}
          regimeBens={form.regime_bens}
          onChange={(id) => setForm({...form, conjuge_id: id})}
          onRegimeChange={(regime) => setForm({...form, regime_bens: regime})}
          escritorioId={cliente?.escritorio_id}
        />
      )}
      
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
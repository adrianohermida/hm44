import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, User, Phone, Mail, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const InfoItem = ({ icon: Icon, label, value, enriched }) => (
  <div className="flex items-start gap-3 p-3 rounded-lg hover:bg-[var(--bg-secondary)] transition-colors">
    <Icon className="w-5 h-5 text-[var(--text-tertiary)] flex-shrink-0 mt-0.5" />
    <div className="flex-1 min-w-0">
      <p className="text-xs text-[var(--text-tertiary)] mb-1">{label}</p>
      <p className="font-medium text-sm text-[var(--text-primary)] break-words flex items-center gap-2">
        {value || '-'}
        {enriched && (
          <Badge className="bg-purple-100 text-purple-700 text-[10px] px-1.5 py-0">
            <Sparkles className="w-3 h-3 mr-1" />
            API
          </Badge>
        )}
      </p>
    </div>
  </div>
);

export default function ClienteInfoSection({ cliente, onEdit }) {
  const [enriching, setEnriching] = useState(false);
  const queryClient = useQueryClient();

  const enrichMutation = useMutation({
    mutationFn: async () => {
      const documento = cliente.cpf || cliente.cnpj;
      if (!documento) throw new Error('Documento não encontrado');

      const response = await base44.functions.invoke(
        cliente.tipo_pessoa === 'fisica' ? 'consultarCPFDirectData' : 'consultarCNPJDirectData',
        { documento }
      );
      
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(['cliente', cliente.id], (old) => ({
        ...old,
        ...data,
        dados_enriquecidos_api: data
      }));
      toast.success('Dados enriquecidos com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao enriquecer dados: ' + error.message);
    }
  });

  const handleEnrich = () => {
    setEnriching(true);
    enrichMutation.mutate();
    setTimeout(() => setEnriching(false), 3000);
  };

  return (
    <Card className="bg-white dark:bg-[var(--bg-elevated)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Dados do Paciente</CardTitle>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleEnrich}
              disabled={enriching || !cliente.cpf}
              className="gap-2"
            >
              {enriching ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              Enriquecer
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={onEdit}
              className="gap-2"
            >
              <Edit className="w-4 h-4" />
              Editar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
              Informações Pessoais
            </h3>
            <div className="space-y-1">
              <InfoItem
                icon={User}
                label={cliente.tipo_pessoa === 'fisica' ? 'CPF' : 'CNPJ'}
                value={cliente.cpf || cliente.cnpj}
              />
              <InfoItem
                icon={User}
                label="Data de Nascimento"
                value={cliente.data_nascimento ? format(new Date(cliente.data_nascimento), 'dd/MM/yyyy') : null}
              />
              <InfoItem
                icon={User}
                label="Nacionalidade"
                value={cliente.nacionalidade}
                enriched={!!cliente.dados_enriquecidos_api?.nacionalidade}
              />
              <InfoItem
                icon={User}
                label="Estado Civil"
                value={cliente.estado_civil}
              />
              <InfoItem
                icon={User}
                label="Profissão"
                value={cliente.profissao}
                enriched={!!cliente.dados_enriquecidos_api?.profissao}
              />
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-[var(--text-secondary)] mb-3 uppercase tracking-wide">
              Contato
            </h3>
            <div className="space-y-1">
              <InfoItem
                icon={Phone}
                label="Celular (Principal)"
                value={cliente.telefone}
              />
              <InfoItem
                icon={Mail}
                label="E-mail (Principal)"
                value={cliente.email}
              />
              <InfoItem
                icon={MapPin}
                label="Endereço"
                value={
                  cliente.endereco ? 
                    `${cliente.endereco.logradouro}, ${cliente.endereco.numero} - ${cliente.endereco.bairro}, ${cliente.endereco.cidade}/${cliente.endereco.estado}` 
                    : null
                }
                enriched={!!cliente.dados_enriquecidos_api?.endereco}
              />
              {cliente.endereco?.cep && (
                <InfoItem
                  icon={MapPin}
                  label="CEP"
                  value={cliente.endereco.cep}
                />
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
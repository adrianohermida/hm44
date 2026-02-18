import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Phone, Mail, MapPin, Building2, Users, DollarSign, Calendar, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { createPageUrl } from '@/utils';
import { useNavigate } from 'react-router-dom';

function SocioItem({ socio, escritorioId }) {
  const navigate = useNavigate();
  
  const { data: clienteVinculado } = useQuery({
    queryKey: ['cliente-socio', socio.documento],
    queryFn: async () => {
      if (!socio.documento) return null;
      const cpfLimpo = socio.documento.replace(/\D/g, '');
      const clientes = await base44.entities.Cliente.filter({
        escritorio_id: escritorioId,
        cpf_cnpj: cpfLimpo
      });
      return clientes[0] || null;
    },
    enabled: !!socio.documento
  });

  return (
    <div className="p-3 bg-[var(--bg-primary)] rounded-lg border border-[var(--border-primary)] hover:border-[var(--brand-primary)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="font-medium text-[var(--text-primary)]">{socio.nome}</div>
          {socio.documento && (
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              CPF: {socio.documento}
            </div>
          )}
          {socio.cargo && (
            <Badge variant="outline" className="text-xs mt-1">
              {socio.cargo}
            </Badge>
          )}
          {socio.dataEntrada && (
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              Entrada: {socio.dataEntrada}
            </div>
          )}
          {socio.percentualParticipacao && (
            <div className="text-xs text-[var(--text-secondary)] mt-1">
              Participação: {socio.percentualParticipacao}
            </div>
          )}
        </div>
        {clienteVinculado && (
          <Button
            size="icon"
            variant="ghost"
            className="h-7 w-7 shrink-0"
            onClick={() => navigate(`${createPageUrl('ClienteDetalhes')}?id=${clienteVinculado.id}`)}
            title="Ver detalhes do cliente"
          >
            <ExternalLink className="w-3 h-3 text-[var(--brand-primary)]" />
          </Button>
        )}
      </div>
    </div>
  );
}

export default function DadosEnriquecidosPJ({ cliente, onEnriquecer, loading }) {
  const dados = cliente?.dados_enriquecidos_api?.retorno;
  
  if (!dados) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Dados Enriquecidos
            </CardTitle>
            <Button size="sm" onClick={onEnriquecer} disabled={loading}>
              <Sparkles className="w-4 h-4 mr-2" />
              Enriquecer
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-[var(--text-secondary)]">
            Nenhum dado enriquecido disponível
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Dados Enriquecidos
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onEnriquecer} disabled={loading}>
            <Sparkles className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {dados.situacaoCadastral && (
          <div className="flex items-center gap-2 text-sm">
            <Building2 className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-[var(--text-secondary)]">Situação:</span>
            <Badge variant={dados.situacaoCadastral === 'ATIVA' ? 'default' : 'secondary'}>
              {dados.situacaoCadastral}
            </Badge>
          </div>
        )}

        {dados.dataFundacao && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-[var(--text-secondary)]">Fundação:</span>
            <span className="font-medium">{dados.dataFundacao}</span>
          </div>
        )}

        {(dados.porte || dados.faixaFuncionarios || dados.faixaFaturamento) && (
          <div className="space-y-2">
            {dados.porte && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)]">Porte:</span>
                <Badge variant="outline">{dados.porte}</Badge>
              </div>
            )}
            {dados.faixaFuncionarios && (
              <div className="flex items-center gap-2 text-sm ml-6">
                <span className="text-[var(--text-secondary)]">Funcionários:</span>
                <span className="text-xs">{dados.faixaFuncionarios}</span>
              </div>
            )}
            {dados.faixaFaturamento && (
              <div className="flex items-center gap-2 text-sm">
                <DollarSign className="w-4 h-4 text-[var(--text-secondary)]" />
                <span className="text-[var(--text-secondary)]">Faturamento:</span>
                <span className="text-xs">{dados.faixaFaturamento}</span>
              </div>
            )}
          </div>
        )}

        {dados.cnaeDescricao && (
          <div className="flex items-start gap-2 text-sm">
            <Building2 className="w-4 h-4 text-[var(--text-secondary)] mt-0.5" />
            <div>
              <span className="text-[var(--text-secondary)]">CNAE:</span>
              <div className="font-medium">{dados.cnaeDescricao}</div>
              {dados.cnaeCodigo && (
                <span className="text-xs text-[var(--text-secondary)]">Código: {dados.cnaeCodigo}</span>
              )}
            </div>
          </div>
        )}

        {dados.telefones?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Phone className="w-4 h-4 text-[var(--text-secondary)]" />
              Telefones ({dados.telefones.length})
            </div>
            <div className="space-y-1 ml-6">
              {dados.telefones.map((tel, idx) => (
                <div key={idx} className="flex items-center gap-2 text-sm">
                  <span>{tel.telefoneComDDD}</span>
                  {tel.whatsApp && <Badge variant="outline" className="text-xs">WhatsApp</Badge>}
                  {tel.operadora && <span className="text-[var(--text-secondary)] text-xs">({tel.operadora})</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {dados.emails?.filter(e => e.enderecoEmail)?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
              Emails
            </div>
            <div className="space-y-1 ml-6">
              {dados.emails.filter(e => e.enderecoEmail).map((email, idx) => (
                <div key={idx} className="text-sm">{email.enderecoEmail}</div>
              ))}
            </div>
          </div>
        )}

        {dados.enderecos?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 text-[var(--text-secondary)]" />
              Endereços
            </div>
            <div className="space-y-2 ml-6">
              {dados.enderecos.map((end, idx) => (
                <div key={idx} className="text-sm">
                  {end.logradouro}, {end.numero}
                  {end.complemento && ` - ${end.complemento}`}
                  <br />
                  {end.bairro} - {end.cidade}/{end.uf}
                  <br />
                  CEP: {end.cep}
                </div>
              ))}
            </div>
          </div>
        )}

        {dados.socios?.length > 0 && (
          <Card className="bg-[var(--bg-secondary)]">
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Users className="w-4 h-4" />
                Sócios ({dados.socios.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {dados.socios.map((socio, idx) => (
                <SocioItem key={idx} socio={socio} escritorioId={cliente.escritorio_id} />
              ))}
            </CardContent>
          </Card>
        )}

        <div className="pt-2 border-t text-xs text-[var(--text-secondary)]">
          Última atualização: {new Date(cliente.updated_date).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
}
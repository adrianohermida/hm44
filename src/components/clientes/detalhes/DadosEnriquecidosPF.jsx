import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Phone, Mail, MapPin, DollarSign, Calendar, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function DadosEnriquecidosPF({ cliente, onEnriquecer, loading }) {
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
            Dados Enriquecidos (DirectData)
          </CardTitle>
          <Button size="sm" variant="outline" onClick={onEnriquecer} disabled={loading}>
            <Sparkles className="w-4 h-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {dados.dataNascimento && (
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-[var(--text-secondary)]">Nascimento:</span>
            <span className="font-medium">{dados.dataNascimento}</span>
            {dados.idade && <Badge variant="outline">{dados.idade} anos</Badge>}
            {dados.signo && <Badge variant="secondary">{dados.signo}</Badge>}
          </div>
        )}

        {dados.nomeMae && (
          <div className="flex items-center gap-2 text-sm">
            <User className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-[var(--text-secondary)]">Mãe:</span>
            <span className="font-medium">{dados.nomeMae}</span>
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

        {dados.emails?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <Mail className="w-4 h-4 text-[var(--text-secondary)]" />
              Emails ({dados.emails.length})
            </div>
            <div className="space-y-1 ml-6">
              {dados.emails.map((email, idx) => (
                <div key={idx} className="text-sm">{email.enderecoEmail}</div>
              ))}
            </div>
          </div>
        )}

        {dados.enderecos?.length > 0 && (
          <div>
            <div className="flex items-center gap-2 text-sm font-medium mb-2">
              <MapPin className="w-4 h-4 text-[var(--text-secondary)]" />
              Endereços ({dados.enderecos.length})
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

        {(dados.rendaEstimada || dados.rendaFaixaSalarial) && (
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-[var(--text-secondary)]" />
            <span className="text-[var(--text-secondary)]">Renda:</span>
            <span className="font-medium">{dados.rendaFaixaSalarial || dados.rendaEstimada}</span>
          </div>
        )}

        <div className="pt-2 border-t text-xs text-[var(--text-secondary)]">
          Última atualização: {new Date(cliente.updated_date).toLocaleDateString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
}
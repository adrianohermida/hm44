import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';

export default function OndeEncontrar() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio-publico'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: unidades = [] } = useQuery({
    queryKey: ['unidades-publicas'],
    queryFn: () => base44.entities.UnidadeEscritorio.filter({ exibir_contato: true }),
    enabled: !!escritorio
  });

  const todasUnidades = escritorio ? [
    {
      tipo: 'sede',
      nome: escritorio.nome,
      endereco_completo: escritorio.endereco,
      cidade: escritorio.cidade,
      estado: escritorio.estado,
      cep: escritorio.cep,
      telefone: escritorio.telefone,
      email: escritorio.email,
      latitude: -23.550520,
      longitude: -46.633308
    },
    ...unidades
  ] : unidades;

  if (todasUnidades.length === 0) return null;

  return (
    <div className="mt-12">
      <h2 className="text-3xl font-bold text-[var(--text-primary)] mb-6 text-center">
        Onde nos Encontrar
      </h2>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {todasUnidades.map((unidade, index) => (
          <Card key={index} className="bg-[var(--bg-elevated)] border-[var(--border-primary)] hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
                <MapPin className="w-5 h-5" />
                {unidade.tipo === 'sede' ? 'Sede' : unidade.nome}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p className="font-medium text-[var(--text-primary)]">
                  {unidade.endereco_completo}
                </p>
                <p className="text-[var(--text-secondary)]">
                  {unidade.cidade}/{unidade.estado} - CEP: {unidade.cep}
                </p>
              </div>

              {unidade.telefone && (
                <a 
                  href={`tel:${unidade.telefone}`}
                  className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline"
                >
                  <Phone className="w-4 h-4" />
                  {unidade.telefone}
                </a>
              )}

              {unidade.email && (
                <a 
                  href={`mailto:${unidade.email}`}
                  className="flex items-center gap-2 text-sm text-[var(--brand-primary)] hover:underline"
                >
                  <Mail className="w-4 h-4" />
                  {unidade.email}
                </a>
              )}

              {escritorio?.horario_atendimento && unidade.tipo === 'sede' && (
                <div className="flex items-start gap-2 text-sm text-[var(--text-secondary)] pt-2 border-t">
                  <Clock className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <div>
                    <p>{escritorio.horario_atendimento.dias}</p>
                    <p>{escritorio.horario_atendimento.horario}</p>
                    <p className="text-xs">{escritorio.horario_atendimento.fuso}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {todasUnidades.some(u => u.latitude && u.longitude) && (
        <Card>
          <CardContent className="p-0">
            <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
              <p className="text-[var(--text-secondary)]">
                Mapa será implementado com react-leaflet
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
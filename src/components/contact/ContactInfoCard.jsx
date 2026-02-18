import React from "react";
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Mail, Phone, Clock, Scale } from "lucide-react";
import RegularidadeLinks from "./RegularidadeLinks";

export default function ContactInfoCard() {
  const { data: escritorio } = useQuery({
    queryKey: ['escritorio-contato'],
    queryFn: async () => {
      const result = await base44.entities.Escritorio.list();
      return result[0];
    }
  });

  const { data: inscricoesOAB = [] } = useQuery({
    queryKey: ['inscricoes-oab-contato'],
    queryFn: () => base44.entities.InscricaoOAB.filter({ ativo: true }),
    enabled: !!escritorio
  });

  const email = escritorio?.email || 'contato@hermidamaia.adv.br';
  const whatsapp = escritorio?.whatsapp || escritorio?.telefone || '+55 (51) 99999-9999';
  const horario = escritorio?.horario_atendimento || { dias: 'Segunda - Sexta', horario: '9:00 - 18:00', fuso: 'horário de Brasília' };

  return (
    <Card className="bg-[var(--bg-elevated)] backdrop-blur-sm border border-[var(--border-primary)]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--text-primary)]">
          <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
          Informações de Contato
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[var(--brand-primary-100)] rounded-lg flex items-center justify-center">
            <Mail className="w-5 h-5 text-[var(--brand-primary-700)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)]">Email</h4>
            <a href={`mailto:${email}`} className="text-[var(--brand-primary)] hover:underline">{email}</a>
            <p className="text-sm text-[var(--text-tertiary)]">Resposta em até 24h</p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-[var(--brand-primary-100)] rounded-lg flex items-center justify-center">
            <Phone className="w-5 h-5 text-[var(--brand-primary-700)]" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)]">WhatsApp</h4>
            <a href={`https://wa.me/${whatsapp.replace(/\D/g, '')}`} className="text-[var(--brand-primary)] hover:underline" target="_blank" rel="noopener noreferrer">
              {whatsapp}
            </a>
            <p className="text-sm text-[var(--text-tertiary)]">{horario.dias}, {horario.horario}</p>
          </div>
        </div>

        {inscricoesOAB.length > 0 && (
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <Scale className="w-5 h-5 text-yellow-700" />
            </div>
            <div>
              <h4 className="font-medium text-[var(--text-primary)]">Registro Profissional</h4>
              {inscricoesOAB.map((insc, i) => (
                <p key={i} className={i === 0 ? "text-[var(--text-secondary)]" : "text-sm text-[var(--text-tertiary)]"}>
                  {insc.tipo === 'sociedade' ? 'Sociedade ' : ''}OAB/{insc.uf} {insc.numero}
                </p>
              ))}
            </div>
          </div>
        )}

        <div className="flex items-start gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Clock className="w-5 h-5 text-blue-700" />
          </div>
          <div>
            <h4 className="font-medium text-[var(--text-primary)]">Horário de Atendimento</h4>
            <p className="text-[var(--text-secondary)]">{horario.dias}</p>
            <p className="text-sm text-[var(--text-tertiary)]">{horario.horario} ({horario.fuso})</p>
          </div>
        </div>

        <RegularidadeLinks />
      </CardContent>
    </Card>
  );
}
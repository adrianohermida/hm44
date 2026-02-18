import React from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Zap } from 'lucide-react';

const RESPOSTAS_RAPIDAS = [
  {
    label: '✅ Recebido',
    texto: 'Obrigado pela mensagem! Recebemos seu contato e retornaremos em breve.'
  },
  {
    label: '📋 Documentos',
    texto: 'Para dar continuidade, precisamos dos seguintes documentos: RG, CPF e comprovante de residência.'
  },
  {
    label: '⏰ Aguarde',
    texto: 'Estamos analisando seu caso. Em breve entraremos em contato com mais informações.'
  },
  {
    label: '📞 Contato',
    texto: 'Nossa equipe entrará em contato por telefone nas próximas 24 horas.'
  },
  {
    label: '✔️ Agendado',
    texto: 'Sua consulta foi agendada! Você receberá um email de confirmação em instantes.'
  }
];

export default function RespostasRapidas({ onSelect }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <Zap className="w-4 h-4" />
          Resposta Rápida
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80">
        {RESPOSTAS_RAPIDAS.map((resposta, i) => (
          <DropdownMenuItem
            key={i}
            onClick={() => onSelect(resposta.texto)}
            className="flex flex-col items-start py-3 cursor-pointer"
          >
            <span className="font-medium text-sm mb-1">{resposta.label}</span>
            <span className="text-xs text-[var(--text-secondary)] line-clamp-2">
              {resposta.texto}
            </span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
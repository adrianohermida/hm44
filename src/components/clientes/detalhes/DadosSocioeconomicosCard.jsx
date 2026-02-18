import React, { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Pencil, User } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import DadosSocioeconomicosEditModal from './DadosSocioeconomicosEditModal';
import { formatarData, formatarMoeda, calcularIdade, isIdoso } from '../utils/clienteHelpers';

export default function DadosSocioeconomicosCard({ cliente, conjuge, onUpdate }) {
  const [editando, setEditando] = useState(false);

  const situacaoMap = {
    em_atividade: 'Em atividade',
    aposentado: 'Aposentado',
    desempregado: 'Desempregado'
  };

  const sexoMap = {
    masculino: 'Masculino',
    feminino: 'Feminino',
    outro: 'Prefiro não declarar'
  };

  const estadoCivilMap = {
    solteiro: 'Solteiro(a)',
    casado: 'Casado(a)',
    divorciado: 'Divorciado(a)',
    viuvo: 'Viúvo(a)',
    uniao_estavel: 'União estável'
  };

  const idade = calcularIdade(cliente.data_nascimento);
  const ehIdoso = isIdoso(cliente.data_nascimento, cliente.sexo);

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold">Dados Socioeconômicos</h3>
            {ehIdoso && (
              <Badge variant="secondary" className="bg-[var(--brand-info)] text-white">
                IDOSO{cliente.sexo === 'feminino' ? 'A' : ''}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="sm" onClick={() => setEditando(true)}>
            <Pencil className="w-4 h-4" />
          </Button>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3 text-sm">
          <div>
            <span className="text-[var(--text-secondary)]">Sexo:</span>
            <p className="font-medium">{sexoMap[cliente.sexo] || '-'}</p>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Data de nascimento:</span>
            <p className="font-medium">{formatarData(cliente.data_nascimento)} {idade ? `(${idade} anos)` : ''}</p>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Estado civil:</span>
            <p className="font-medium">{estadoCivilMap[cliente.estado_civil] || '-'}</p>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Dependentes:</span>
            <p className="font-medium">{cliente.numero_dependentes ?? '-'}</p>
          </div>
          {conjuge && (
            <div className="col-span-2">
              <span className="text-[var(--text-secondary)]">Cônjuge:</span>
              <Link to={createPageUrl('ClienteDetalhes') + '?id=' + conjuge.id} className="flex items-center gap-2 mt-1 text-[var(--brand-primary)] hover:underline">
                <User className="w-4 h-4" />
                <span className="font-medium">{conjuge.nome_completo}</span>
              </Link>
              {conjuge.regime_bens && (
                <span className="text-xs text-[var(--text-secondary)]">Regime: {conjuge.regime_bens}</span>
              )}
            </div>
          )}
          <div className="col-span-2">
            <span className="text-[var(--text-secondary)]">Profissão:</span>
            <p className="font-medium">{cliente.profissao || '-'}</p>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Situação:</span>
            <p className="font-medium">{situacaoMap[cliente.situacao_profissional] || '-'}</p>
          </div>
          <div>
            <span className="text-[var(--text-secondary)]">Renda individual:</span>
            <p className="font-medium">{formatarMoeda(cliente.renda_mensal_individual)}</p>
          </div>
          <div className="col-span-2">
            <span className="text-[var(--text-secondary)]">Renda familiar:</span>
            <p className="font-medium">{formatarMoeda(cliente.renda_mensal_familiar)}</p>
          </div>
        </CardContent>
      </Card>
      <DadosSocioeconomicosEditModal
        open={editando}
        onClose={() => setEditando(false)}
        cliente={cliente}
        onSave={onUpdate}
      />
    </>
  );
}
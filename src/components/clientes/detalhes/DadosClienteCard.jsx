import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import DadosBasicosPF from './DadosBasicosPF';
import DadosBasicosPJ from './DadosBasicosPJ';
import ContatosExpandidos from './ContatosExpandidos';
import EnderecosExpandidos from './EnderecosExpandidos';

export default function DadosClienteCard({ cliente }) {
  const [expandido, setExpandido] = useState(false);

  return (
    <Card className="border-[var(--border-primary)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-[var(--text-primary)]">
            {cliente.tipo_pessoa === 'fisica' ? 'Dados Pessoais' : 'Dados da Empresa'}
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => setExpandido(!expandido)}
          >
            {expandido ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            <span className="ml-1 text-xs">Ver {expandido ? 'menos' : 'mais'}</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {cliente.tipo_pessoa === 'fisica' ? (
          <DadosBasicosPF cliente={cliente} />
        ) : (
          <DadosBasicosPJ cliente={cliente} />
        )}
        
        {expandido && (
          <>
            <hr className="border-[var(--border-primary)]" />
            <ContatosExpandidos cliente={cliente} />
            <hr className="border-[var(--border-primary)]" />
            <EnderecosExpandidos cliente={cliente} />
          </>
        )}
      </CardContent>
    </Card>
  );
}
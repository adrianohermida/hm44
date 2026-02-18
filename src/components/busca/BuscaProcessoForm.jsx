import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import BuscaPorCNJ from './BuscaPorCNJ';
import BuscaPorNome from './BuscaPorNome';
import BuscaPorDocumento from './BuscaPorDocumento';
import BuscaPorOAB from './BuscaPorOAB';

export default function BuscaProcessoForm({ onResultados }) {
  return (
    <Card className="p-4 border-[var(--border-primary)]">
      <Tabs defaultValue="cnj" className="w-full">
        <TabsList className="w-full grid grid-cols-4">
          <TabsTrigger value="cnj">CNJ</TabsTrigger>
          <TabsTrigger value="nome">Nome</TabsTrigger>
          <TabsTrigger value="cpf">CPF/CNPJ</TabsTrigger>
          <TabsTrigger value="oab">OAB</TabsTrigger>
        </TabsList>
        <TabsContent value="cnj" className="mt-4">
          <BuscaPorCNJ onResultados={onResultados} />
        </TabsContent>
        <TabsContent value="nome" className="mt-4">
          <BuscaPorNome onResultados={onResultados} />
        </TabsContent>
        <TabsContent value="cpf" className="mt-4">
          <BuscaPorDocumento onResultados={onResultados} />
        </TabsContent>
        <TabsContent value="oab" className="mt-4">
          <BuscaPorOAB onResultados={onResultados} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}
import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import FonteTribunalCard from './FonteTribunalCard';

export default function FontesProcessoTabs({ fontes }) {
  if (!fontes || fontes.length === 0) return null;

  return (
    <Tabs defaultValue={fontes[0]?.id?.toString()}>
      <TabsList className="w-full">
        {fontes.map(fonte => (
          <TabsTrigger key={fonte.id} value={fonte.id.toString()} className="flex-1">
            {fonte.sigla} - {fonte.grau}º
          </TabsTrigger>
        ))}
      </TabsList>
      {fontes.map(fonte => (
        <TabsContent key={fonte.id} value={fonte.id.toString()}>
          <FonteTribunalCard fonte={fonte} />
        </TabsContent>
      ))}
    </Tabs>
  );
}
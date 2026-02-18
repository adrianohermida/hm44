import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import BuscaPorCNJ from '@/components/busca/BuscaPorCNJ';
import BuscaPorNome from '@/components/busca/BuscaPorNome';
import BuscaPorOAB from '@/components/busca/BuscaPorOAB';
import ResultadosProcessosList from './ResultadosProcessosList';

export default function BuscaTribunalTab({ onClose, onSuccess }) {
  const [resultados, setResultados] = useState([]);
  const [selecionados, setSelecionados] = useState(new Set());

  const handleResultados = (data) => {
    console.log('[BuscaTribunalTab] Resultados recebidos:', data);
    setResultados(data.processos || []);
    setSelecionados(new Set());
    if (data.processo_salvo || data.processos_salvos > 0) {
      handleComplete(data);
    }
  };

  const handleComplete = (data) => {
    console.log('[BuscaTribunalTab] Completando busca:', data);
    onSuccess?.(data);
    onClose?.();
  };

  const toggleSelecao = (cnj) => {
    setSelecionados(prev => {
      const next = new Set(prev);
      if (next.has(cnj)) {
        next.delete(cnj);
      } else {
        next.add(cnj);
      }
      return next;
    });
  };

  const toggleTodos = () => {
    setSelecionados(
      selecionados.size === resultados.length 
        ? new Set() 
        : new Set(resultados.map(p => p.numero_cnj))
    );
  };

  const processosSelecionados = resultados.filter(p => 
    selecionados.has(p.numero_cnj)
  );

  return (
    <div className="space-y-4 pt-4">
      <Tabs defaultValue="cnj">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="cnj">Por CNJ</TabsTrigger>
          <TabsTrigger value="nome">Por Nome</TabsTrigger>
          <TabsTrigger value="oab">Por OAB</TabsTrigger>
        </TabsList>
        
        <TabsContent value="cnj" className="mt-4">
          <BuscaPorCNJ onResultados={handleResultados} />
        </TabsContent>
        
        <TabsContent value="nome" className="mt-4">
          <BuscaPorNome onResultados={handleResultados} />
        </TabsContent>
        
        <TabsContent value="oab" className="mt-4">
          <BuscaPorOAB onResultados={handleResultados} />
        </TabsContent>
      </Tabs>

      {resultados.length > 0 && (
        <ResultadosProcessosList 
          processos={resultados}
          selecionados={selecionados}
          onToggleSelecao={toggleSelecao}
          onToggleTodos={toggleTodos}
          processosSelecionados={processosSelecionados}
          onComplete={handleComplete}
        />
      )}
    </div>
  );
}
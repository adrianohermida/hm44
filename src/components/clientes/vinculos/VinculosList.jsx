import React from 'react';
import VinculoCard from './VinculoCard';

export default function VinculosList({ vinculos, clienteAtualId, clientes, onRemove }) {
  if (!vinculos || vinculos.length === 0) {
    return (
      <div className="text-center py-8 text-[var(--text-secondary)]">
        Nenhum vínculo cadastrado
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {vinculos.map(vinculo => {
        // Buscar o cliente vinculado que NÃO é o cliente atual
        const idVinculado = vinculo.pessoa_fisica_id === clienteAtualId 
          ? vinculo.pessoa_juridica_id 
          : vinculo.pessoa_fisica_id;
        
        const clienteVinculado = clientes?.find(c => c.id === idVinculado);
        
        return (
          <VinculoCard
            key={vinculo.id}
            vinculo={vinculo}
            cliente={clienteVinculado}
            onRemove={onRemove}
          />
        );
      })}
    </div>
  );
}
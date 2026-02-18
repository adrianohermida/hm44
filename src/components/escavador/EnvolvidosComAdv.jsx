import React from 'react';
import EnvolvidoComAdvogados from './EnvolvidoComAdvogados';

export default function EnvolvidosComAdv({ envolvidos }) {
  if (!envolvidos || envolvidos.length === 0) return null;

  return (
    <div className="grid gap-2">
      {envolvidos.map((env, i) => (
        <EnvolvidoComAdvogados key={i} envolvido={env} />
      ))}
    </div>
  );
}
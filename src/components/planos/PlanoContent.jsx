import React from 'react';
import PlanoVazio from './PlanoVazio';
import PlanoDetalhes from './PlanoDetalhes';
import EditorPlanoWrapper from './EditorPlanoWrapper';

export default function PlanoContent({ 
  modo, 
  planoSelecionado, 
  onSalvar, 
  onCancelar 
}) {
  if (modo === 'novo' || modo === 'editar') {
    return (
      <EditorPlanoWrapper
        planoExistente={modo === 'editar' ? planoSelecionado : null}
        onSalvar={onSalvar}
        onCancelar={onCancelar}
      />
    );
  }

  if (!planoSelecionado) {
    return <PlanoVazio />;
  }

  return <PlanoDetalhes plano={planoSelecionado} />;
}
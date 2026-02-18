import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import ClienteSelectorAdmin from '@/components/editor-plano/admin/ClienteSelectorAdmin';
import ClienteFormAdmin from '@/components/editor-plano/admin/ClienteFormAdmin';
import PlanoAdminHeader from '@/components/editor-plano/admin/PlanoAdminHeader';

export default function EditorPlanoClienteSection({ 
  clienteId, 
  onClienteChange,
  modoNovo,
  onToggleModo,
  escritorioId,
  clienteSelecionado 
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Cliente</CardTitle>
      </CardHeader>
      <CardContent>
        {!modoNovo ? (
          <>
            <ClienteSelectorAdmin 
              value={clienteId} 
              onChange={onClienteChange}
              onNovoCliente={() => onToggleModo(true)}
            />
            {clienteSelecionado && <PlanoAdminHeader cliente={clienteSelecionado} />}
          </>
        ) : (
          <ClienteFormAdmin 
            escritorioId={escritorioId}
            onClienteCreated={(id) => {
              onClienteChange(id);
              onToggleModo(false);
            }}
          />
        )}
      </CardContent>
    </Card>
  );
}
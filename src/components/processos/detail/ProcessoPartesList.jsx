import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Plus } from 'lucide-react';
import ProcessoParteItem from './ProcessoParteItem';
import TooltipJuridico from '@/components/common/TooltipJuridico';

export default function ProcessoPartesList({ 
  partes, 
  onAdd, 
  onEdit, 
  onDelete, 
  onChangePolo, 
  modoCliente = false, 
  clienteId = null 
}) {
  if (!partes?.length) return null;

  const poloAtivo = partes.filter(p => p.tipo_parte === 'polo_ativo');
  const poloPassivo = partes.filter(p => p.tipo_parte === 'polo_passivo');

  const getLabelPolo = (tipo) => {
    if (modoCliente) {
      const isClientePolo = tipo === 'polo_ativo' 
        ? poloAtivo.some(p => p.cliente_id === clienteId)
        : poloPassivo.some(p => p.cliente_id === clienteId);
      
      if (isClientePolo) {
        return tipo === 'polo_ativo' ? 'Você (Autor)' : 'Você (Réu)';
      }
      return tipo === 'polo_ativo' ? 'Parte Contrária' : 'Parte Contrária';
    }
    return tipo === 'polo_ativo' ? 'Polo Ativo' : 'Polo Passivo';
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-4 h-4" aria-hidden="true" />
            {modoCliente ? 'Envolvidos no Processo' : <TooltipJuridico termo="parte">Partes do Processo</TooltipJuridico>}
          </CardTitle>
          {!modoCliente && (
            <Button size="sm" variant="outline" onClick={onAdd} aria-label="Adicionar parte">
              <Plus className="w-4 h-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {poloAtivo.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
              {getLabelPolo('polo_ativo')}
            </h4>
            <div className="space-y-2">
              {poloAtivo.map(parte => (
                <ProcessoParteItem 
                  key={parte.id} 
                  parte={parte} 
                  onEdit={!modoCliente ? onEdit : null}
                  onDelete={!modoCliente ? onDelete : null}
                  onChangePolo={!modoCliente ? onChangePolo : null}
                  destacar={modoCliente && parte.cliente_id === clienteId}
                />
              ))}
            </div>
          </div>
        )}
        {poloPassivo.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-[var(--text-secondary)] mb-2">
              {getLabelPolo('polo_passivo')}
            </h4>
            <div className="space-y-2">
              {poloPassivo.map(parte => (
                <ProcessoParteItem 
                  key={parte.id} 
                  parte={parte} 
                  onEdit={!modoCliente ? onEdit : null}
                  onDelete={!modoCliente ? onDelete : null}
                  onChangePolo={!modoCliente ? onChangePolo : null}
                  destacar={modoCliente && parte.cliente_id === clienteId}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function ProofFilter({ status, tipo, onStatusChange, onTipoChange }) {
  return (
    <div className="flex gap-4 mb-6">
      <Select value={status} onValueChange={onStatusChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="pendente">Pendentes</SelectItem>
          <SelectItem value="aprovado">Aprovados</SelectItem>
        </SelectContent>
      </Select>
      <Select value={tipo} onValueChange={onTipoChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="depoimento">Depoimentos</SelectItem>
          <SelectItem value="reconhecimento">Reconhecimentos</SelectItem>
          <SelectItem value="publicacao">Publicações</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
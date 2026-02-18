import React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function RevisaoFilters({ status, onChange }) {
  return (
    <div className="mb-4">
      <Select value={status} onValueChange={onChange}>
        <SelectTrigger className="w-full sm:w-48">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="revisao">Em Revisão</SelectItem>
          <SelectItem value="publicado">Aprovados</SelectItem>
          <SelectItem value="rascunho">Rejeitados</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
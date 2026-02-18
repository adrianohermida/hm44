import React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";
import CategoriaCard from "./CategoriaCard";

export default function CategoriasList({ categorias, isLoading, onEdit, onDelete, onNova }) {
  if (isLoading) {
    return <div className="text-center py-8">Carregando...</div>;
  }

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold">Categorias Cadastradas</h2>
        <Button onClick={onNova} size="sm">
          <Plus className="w-4 h-4 mr-2" />
          Nova Categoria
        </Button>
      </div>

      {categorias.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>Nenhuma categoria cadastrada</p>
          <Button onClick={onNova} className="mt-4">
            Criar primeira categoria
          </Button>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categorias.map(cat => (
            <CategoriaCard
              key={cat.id}
              categoria={cat}
              onEdit={() => onEdit(cat)}
              onDelete={() => onDelete(cat.id)}
            />
          ))}
        </div>
      )}
    </Card>
  );
}
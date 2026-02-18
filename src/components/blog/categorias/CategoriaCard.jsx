import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2, FileText } from "lucide-react";

export default function CategoriaCard({ categoria, onEdit, onDelete }) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-3xl">{categoria.emoji || "📁"}</span>
          <div>
            <h3 className="font-bold text-sm">{categoria.nome}</h3>
            <span className="text-xs text-gray-500">/{categoria.slug}</span>
          </div>
        </div>
        <div 
          className="w-6 h-6 rounded-full border-2" 
          style={{ backgroundColor: categoria.cor || '#10b981' }}
        />
      </div>

      {categoria.descricao && (
        <p className="text-xs text-gray-600 mb-3 line-clamp-2">
          {categoria.descricao}
        </p>
      )}

      <div className="flex items-center justify-between pt-3 border-t">
        <div className="flex items-center gap-1 text-xs text-gray-500">
          <FileText className="w-3 h-3" />
          <span>{categoria.total_artigos || 0} artigos</span>
        </div>
        <div className="flex gap-1">
          <Button size="sm" variant="ghost" onClick={onEdit}>
            <Pencil className="w-3 h-3" />
          </Button>
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
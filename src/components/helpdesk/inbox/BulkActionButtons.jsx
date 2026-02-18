import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Trash2, FolderOpen, X } from 'lucide-react';

export default function BulkActionButtons({ 
  onAbrir, 
  onResolver, 
  onFechar, 
  onExcluir, 
  onClear, 
  isLoading 
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        size="sm"
        variant="outline"
        onClick={onAbrir}
        disabled={isLoading}
        className="h-8 bg-white hover:bg-gray-50 border-gray-300"
      >
        <FolderOpen className="w-3.5 h-3.5 mr-1.5" />
        Abrir
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onResolver}
        disabled={isLoading}
        className="h-8 bg-white hover:bg-green-50 border-green-300 text-green-700 hover:text-green-800"
      >
        <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
        Resolver
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onFechar}
        disabled={isLoading}
        className="h-8 bg-white hover:bg-gray-50 border-gray-300"
      >
        <XCircle className="w-3.5 h-3.5 mr-1.5" />
        Fechar
      </Button>

      <Button
        size="sm"
        variant="outline"
        onClick={onExcluir}
        disabled={isLoading}
        className="h-8 bg-white hover:bg-red-50 border-red-300 text-red-700 hover:text-red-800"
      >
        <Trash2 className="w-3.5 h-3.5 mr-1.5" />
        Excluir
      </Button>

      <Button
        size="sm"
        variant="ghost"
        onClick={onClear}
        disabled={isLoading}
        className="h-8 hover:bg-gray-100"
      >
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, XCircle, Edit, Merge, Forward, CheckCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function HelpdeskHeaderActions({ 
  selectedCount, 
  onAtribuir, 
  onFechar, 
  onAtualizacaoMassa, 
  onMesclar,
  onEncaminhar,
  onResolver,
  onExcluir,
  isLoading 
}) {
  if (selectedCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border-b border-blue-200">
      <span className="text-sm font-semibold text-blue-900">
        {selectedCount} selecionado(s)
      </span>
      
      <div className="flex gap-1 ml-4">
        <Button
          size="sm"
          variant="outline"
          onClick={onAtribuir}
          disabled={isLoading}
          className="h-8"
        >
          <UserPlus className="w-3.5 h-3.5 mr-1.5" />
          Atribuir
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onFechar}
          disabled={isLoading}
          className="h-8"
        >
          <XCircle className="w-3.5 h-3.5 mr-1.5" />
          Fechar
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onAtualizacaoMassa}
          disabled={isLoading}
          className="h-8"
        >
          <Edit className="w-3.5 h-3.5 mr-1.5" />
          Atualização em massa
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onMesclar}
          disabled={selectedCount < 2 || isLoading}
          className="h-8"
        >
          <Merge className="w-3.5 h-3.5 mr-1.5" />
          Mesclar
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onEncaminhar}
          disabled={isLoading}
          className="h-8"
        >
          <Forward className="w-3.5 h-3.5 mr-1.5" />
          Encaminhar
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onResolver}
          disabled={isLoading}
          className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
        >
          <CheckCircle className="w-3.5 h-3.5 mr-1.5" />
          Resolver
        </Button>

        <Button
          size="sm"
          variant="outline"
          onClick={onExcluir}
          disabled={isLoading}
          className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-3.5 h-3.5 mr-1.5" />
          Excluir
        </Button>
      </div>
    </div>
  );
}
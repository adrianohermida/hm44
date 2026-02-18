import React from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Edit2, Trash2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const statusConfig = {
  rascunho: { label: '📝 Rascunho', color: 'bg-gray-100 text-gray-700' },
  revisao: { label: '👀 Revisão', color: 'bg-yellow-100 text-yellow-700' },
  agendado: { label: '⏰ Agendado', color: 'bg-blue-100 text-blue-700' },
  publicado: { label: '✅ Publicado', color: 'bg-green-100 text-green-700' },
  arquivado: { label: '📦 Arquivado', color: 'bg-gray-100 text-gray-500' }
};

export default function BlogTable({ artigos, onEdit, onDelete, onOtimizar }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Título</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Categoria</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Criado</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 text-sm font-semibold text-gray-700">Publicação</th>
              <th className="text-right p-4 text-sm font-semibold text-gray-700">Ações</th>
            </tr>
          </thead>
          <tbody>
            {artigos.map((artigo) => (
              <tr key={artigo.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="p-4">
                  <div>
                    <p className="font-medium text-gray-900 line-clamp-1">{artigo.titulo}</p>
                    {artigo.slug && (
                      <p className="text-xs text-gray-500 mt-1">/{artigo.slug}</p>
                    )}
                  </div>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-600">{artigo.categoria || '-'}</span>
                </td>
                <td className="p-4">
                  <span className="text-sm text-gray-600">
                    {format(new Date(artigo.created_date), 'dd/MM/yyyy', { locale: ptBR })}
                  </span>
                </td>
                <td className="p-4">
                  <Badge className={statusConfig[artigo.status]?.color}>
                    {statusConfig[artigo.status]?.label || artigo.status}
                  </Badge>
                </td>
                <td className="p-4">
                  {artigo.data_publicacao ? (
                    <span className="text-sm text-gray-600">
                      {format(new Date(artigo.data_publicacao), 'dd/MM/yyyy HH:mm', { locale: ptBR })}
                    </span>
                  ) : (
                    <span className="text-sm text-gray-400">-</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onOtimizar(artigo)}
                    >
                      <Sparkles className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onEdit(artigo)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onDelete(artigo.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
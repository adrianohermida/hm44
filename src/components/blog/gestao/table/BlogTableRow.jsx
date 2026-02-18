import React from 'react';
import ChecklistOtimizacao from '@/components/blog/gestao/ChecklistOtimizacao';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Eye, Sparkles } from 'lucide-react';
import BlogStatusBadge from '../BlogStatusBadge';
import SlugColumn from './SlugColumn';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const categorias = [
  { value: "direito_consumidor", label: "Direito do Consumidor" },
  { value: "superendividamento", label: "Superendividamento" },
  { value: "negociacao_dividas", label: "Negociação de Dívidas" },
  { value: "direito_bancario", label: "Direito Bancário" },
  { value: "educacao_financeira", label: "Educação Financeira" },
  { value: "casos_sucesso", label: "Casos de Sucesso" }
];

export default function BlogTableRow({ artigo, onEdit, onDelete, onOtimizar }) {
  const [otimizando, setOtimizando] = React.useState(false);
  const dataFormatada = artigo.created_date 
    ? format(new Date(artigo.created_date), 'dd/MM/yyyy', { locale: ptBR })
    : '-';
  
  const handleOtimizar = async () => {
    setOtimizando(true);
    try {
      await onOtimizar(artigo, () => setOtimizando(false));
    } catch (error) {
      setOtimizando(false);
    }
  };
  
  return (
    <tr className="border-b hover:bg-gray-50 transition-colors">
      <td className="p-4 font-medium max-w-[300px] truncate">
        {artigo.titulo}
      </td>
      <td className="p-4">
        <SlugColumn artigo={artigo} />
      </td>
      <td className="p-4 text-sm text-gray-600">
        {categorias.find(c => c.value === artigo.categoria)?.label || artigo.categoria}
      </td>
      <td className="p-4 text-sm text-gray-600">{dataFormatada}</td>
      <td className="p-4">
        <BlogStatusBadge status={artigo.status || 'rascunho'} />
      </td>
      <td className="p-4 text-sm">
        {artigo.data_publicacao ? (
          <div className="flex flex-col gap-1">
            <span className="font-medium text-gray-900">
              {format(new Date(artigo.data_publicacao), 'dd/MM/yyyy', { locale: ptBR })}
            </span>
            <span className="text-xs text-gray-500">
              {format(new Date(artigo.data_publicacao), 'HH:mm', { locale: ptBR })}
            </span>
            {new Date(artigo.data_publicacao) > new Date() && (
              <span className="text-xs text-amber-600 font-medium">📅 Agendado</span>
            )}
          </div>
        ) : (
          <span className="text-gray-400">-</span>
        )}
      </td>
      <td className="p-4">
        <ChecklistOtimizacao artigo={artigo} />
      </td>
      <td className="p-4 text-right space-x-1">
        <Button 
          size="sm" 
          variant="ghost" 
          onClick={handleOtimizar}
          disabled={otimizando}
          title="Otimizar com IA"
        >
          <Sparkles className={`w-4 h-4 text-purple-600 ${otimizando ? 'animate-spin' : ''}`} />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onEdit(artigo)} title="Editar">
          <Edit className="w-4 h-4" />
        </Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(artigo.id)} title="Deletar">
          <Trash2 className="w-4 h-4 text-red-500" />
        </Button>
      </td>
    </tr>
  );
}
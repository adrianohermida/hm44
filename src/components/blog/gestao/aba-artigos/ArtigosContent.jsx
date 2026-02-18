import React from 'react';
import BlogFilters from '@/components/blog/gestao/BlogFilters';
import BlogTable from '@/components/blog/gestao/BlogTable';
import ArtigosEmpty from './ArtigosEmpty';
import { Loader2 } from 'lucide-react';

export default React.memo(function ArtigosContent({ 
  artigos, 
  filters, 
  onFilterChange,
  onEdit,
  onDelete,
  onOtimizar,
  onCriar,
  isLoading
}) {
  const artigosFiltrados = React.useMemo(() => {
    if (!artigos) return [];
    return artigos.filter(art => {
      const matchSearch = !filters.search || 
        art.titulo?.toLowerCase().includes(filters.search.toLowerCase());
      const matchStatus = filters.status === "todos" || art.status === filters.status;
      const matchCategoria = filters.categoria === "todas" || art.categoria === filters.categoria;
      return matchSearch && matchStatus && matchCategoria;
    }).sort((a, b) => {
      const dateA = new Date(a.data_publicacao || a.updated_date);
      const dateB = new Date(b.data_publicacao || b.updated_date);
      const now = new Date();
      
      if (a.status === 'agendado' && dateA > now) {
        if (b.status === 'agendado' && dateB > now) return dateA - dateB;
        return -1;
      }
      if (b.status === 'agendado' && dateB > now) return 1;
      return dateB - dateA;
    });
  }, [artigos, filters]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <BlogFilters filters={filters} onChange={onFilterChange} />
      {artigosFiltrados.length === 0 ? (
        <ArtigosEmpty onCriar={onCriar} />
      ) : (
        <BlogTable 
          artigos={artigosFiltrados} 
          onEdit={onEdit}
          onDelete={onDelete}
          onOtimizar={onOtimizar}
        />
      )}
    </div>
  );
});
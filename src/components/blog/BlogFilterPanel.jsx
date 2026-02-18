import React, { useMemo } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Tag } from 'lucide-react';

export default function BlogFilterPanel({ artigos, filters, onChange }) {
  const autores = useMemo(() => {
    const uniqueAutores = [...new Set(artigos.map(a => a.autor).filter(Boolean))];
    return uniqueAutores.sort();
  }, [artigos]);

  const tags = useMemo(() => {
    const allTags = artigos.flatMap(a => a.keywords || []);
    const uniqueTags = [...new Set(allTags)];
    return uniqueTags.sort();
  }, [artigos]);

  return (
    <div className="flex flex-wrap gap-3 items-center">
      {autores.length > 0 && (
        <Select value={filters.autor || ''} onValueChange={(value) => onChange({ ...filters, autor: value })}>
          <SelectTrigger className="w-[200px]">
            <User className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por autor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Todos os autores</SelectItem>
            {autores.map(autor => (
              <SelectItem key={autor} value={autor}>{autor}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {tags.length > 0 && (
        <Select value={filters.tag || ''} onValueChange={(value) => onChange({ ...filters, tag: value })}>
          <SelectTrigger className="w-[200px]">
            <Tag className="w-4 h-4 mr-2" />
            <SelectValue placeholder="Filtrar por tag" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={null}>Todas as tags</SelectItem>
            {tags.slice(0, 20).map(tag => (
              <SelectItem key={tag} value={tag}>{tag}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
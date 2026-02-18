import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Plus, ArrowLeft, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { createPageUrl } from '@/utils';

export default function SEOKeywords() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [keyword, setKeyword] = useState('');
  const [volume, setVolume] = useState(0);

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    },
    staleTime: 5 * 60 * 1000
  });

  const { data: keywords = [] } = useQuery({
    queryKey: ['seo-keywords', escritorio?.id],
    queryFn: () => base44.entities.SEOKeyword.filter({ escritorio_id: escritorio.id }),
    enabled: !!escritorio,
    staleTime: 2 * 60 * 1000
  });

  const createMutation = useMutation({
    mutationFn: (data) => base44.entities.SEOKeyword.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries(['seo-keywords']);
      toast.success('Keyword adicionada');
      setKeyword('');
      setVolume(0);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.SEOKeyword.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['seo-keywords']);
      toast.success('Keyword removida');
    }
  });

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Breadcrumb items={[
        { label: 'Marketing', url: createPageUrl('Marketing') },
        { label: 'Gestão Blog', url: createPageUrl('GestaoBlog') },
        { label: 'Keywords SEO' }
      ]} />

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => navigate('/GestaoBlog')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-2xl font-bold">Gerenciar Keywords SEO</h1>
      </div>

      <Card className="p-4">
        <div className="flex gap-2">
          <Input
            placeholder="Palavra-chave..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Volume"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-32"
          />
          <Button 
            onClick={() => createMutation.mutate({ 
              keyword, 
              volume, 
              escritorio_id: escritorio.id 
            })}
            disabled={!keyword || !escritorio}
          >
            <Plus className="w-4 h-4 mr-2" />Adicionar
          </Button>
        </div>
      </Card>

      <div className="space-y-2">
        {keywords.map(kw => (
          <Card key={kw.id} className="p-4 flex justify-between items-center">
            <div>
              <p className="font-medium">{kw.keyword}</p>
              <div className="flex gap-2 mt-1">
                <Badge variant="outline">Volume: {kw.volume || 0}</Badge>
                {kw.funil && <Badge>{kw.funil}</Badge>}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => deleteMutation.mutate(kw.id)}
            >
              <Trash2 className="w-4 h-4 text-red-600" />
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
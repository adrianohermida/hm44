import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import SEOVideos from '@/components/seo/SEOVideos';
import Breadcrumb from '@/components/seo/Breadcrumb';
import VideoGallery from '@/components/video/VideoGallery';
import VideoFilters from '@/components/video/VideoFilters';

export default function Videos() {
  const [orderBy, setOrderBy] = useState('date');
  
  const { data: videos = [], isLoading, error } = useQuery({
    queryKey: ['youtube-shorts', orderBy],
    queryFn: async () => {
      try {
        const response = await base44.functions.invoke('getYouTubeVideos', {
          channelId: 'UCYGUn86HfmYcT9bQF9_4lOg',
          type: 'short',
          order: orderBy,
          maxResults: 50
        });
        
        console.log('✅ Resposta da API:', response.data);
        return response.data?.videos || [];
      } catch (err) {
        console.error('❌ Erro ao buscar vídeos:', err);
        throw err;
      }
    },
    staleTime: 5 * 60 * 1000,
    retry: 2
  });

  if (error) {
    console.error('Erro na query:', error);
  }

  return (
    <>
      <SEOVideos />
      <div className="min-h-screen bg-[var(--bg-primary)] py-12">
        <div className="max-w-7xl mx-auto px-6">
          <Breadcrumb items={[{ label: 'Vídeos Educativos' }]} />
          
          <header className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">
              Vídeos Educativos
            </h1>
            <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
              Conteúdo jurídico gratuito sobre superendividamento e defesa do devedor
            </p>
          </header>

          <VideoFilters currentFilter={orderBy} onFilterChange={setOrderBy} />
          
          {error && (
            <div className="text-center py-8 mb-8 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
              <p className="text-red-600 dark:text-red-400">
                Erro ao carregar vídeos: {error.message}
              </p>
            </div>
          )}
          
          <VideoGallery videos={videos} isLoading={isLoading} />
        </div>
      </div>
    </>
  );
}
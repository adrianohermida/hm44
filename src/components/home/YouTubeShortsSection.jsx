import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, TrendingUp, Youtube, Video, Hash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { createPageUrl } from '@/utils';
import { base44 } from '@/api/base44Client';
import ShortsCarousel from './youtube/ShortsCarousel';

export default function YouTubeShortsSection() {
  const queryClient = useQueryClient();

  const CHANNEL_ID = 'UCYGUn86HfmYcT9bQF9_4lOg';

  const { data: shorts = [], isLoading } = useQuery({
    queryKey: ['youtube-shorts'],
    queryFn: async () => {
      try {
        const response = await base44.functions.invoke('getYouTubeVideos', {
          channelId: CHANNEL_ID,
          maxResults: 50,
          type: 'short'
        });
        return response.data?.videos || [];
      } catch (error) {
        console.error('Erro ao buscar shorts:', error);
        return [];
      }
    },
    staleTime: 5 * 60 * 1000
  });

  const syncMutation = useMutation({
    mutationFn: () => queryClient.invalidateQueries({ queryKey: ['youtube-shorts'] }),
  });

  return (
    <section className="py-20 bg-[var(--bg-secondary)]" aria-labelledby="shorts-section-title">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary)] text-white px-5 py-2.5 rounded-full mb-5 shadow-lg">
            <Hash className="w-5 h-5" />
            <span className="font-bold text-sm">#Shorts Jurídicos</span>
          </div>
          <h2 id="shorts-section-title" className="text-4xl md:text-5xl font-bold text-[var(--text-primary)] mb-4">
            Aprenda com Vídeos Rápidos
          </h2>
          <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
            Dicas jurídicas essenciais em formato curto para você entender seus direitos
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="p-8 hover:shadow-xl transition-shadow bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <div className="w-12 h-12 bg-[var(--brand-primary-100)] rounded-xl flex items-center justify-center mb-4">
              <Play className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Shorts Educativos
            </h3>
            <p className="text-[var(--text-secondary)]">
              Vídeos de até 60 segundos explicando seus direitos sobre dívidas
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <div className="w-12 h-12 bg-[var(--brand-primary-100)] rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Casos Reais
            </h3>
            <p className="text-[var(--text-secondary)]">
              Exemplos práticos de sucesso na defesa do devedor
            </p>
          </Card>

          <Card className="p-8 hover:shadow-xl transition-shadow bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <div className="w-12 h-12 bg-[var(--brand-primary-100)] rounded-xl flex items-center justify-center mb-4">
              <Youtube className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">
              Atualizações Legais
            </h3>
            <p className="text-[var(--text-secondary)]">
              Mudanças na legislação que afetam sua situação financeira
            </p>
          </Card>
        </div>

        {!isLoading && shorts.length > 0 && (
          <div className="mb-10">
            <ShortsCarousel shorts={shorts} />
          </div>
        )}

        {isLoading && (
          <div className="flex gap-3 overflow-hidden mb-10">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex-shrink-0 w-[280px] aspect-[9/16] bg-gray-200 dark:bg-[var(--navy-700)] rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        <div className="flex gap-4 justify-center flex-wrap">
          <Button size="lg" className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white shadow-lg" asChild>
            <Link to={createPageUrl('Videos')}>
              <Video className="w-5 h-5 mr-2" />
              Ver Galeria de Vídeos
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)] shadow-lg" asChild>
            <a 
              href="https://www.youtube.com/@dr.adrianohermidamaia/shorts" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Inscrever-se no canal"
            >
              <Youtube className="w-5 h-5 mr-2" />
              Inscrever-se no Canal
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
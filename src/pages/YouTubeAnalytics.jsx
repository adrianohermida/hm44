import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { TrendingUp, Eye, ThumbsUp, MessageCircle, Hash, RefreshCw, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function YouTubeAnalytics() {
  const queryClient = useQueryClient();
  const [sortBy, setSortBy] = useState('view_count');

  const CHANNEL_ID = 'UCYGUn86HfmYcT9bQF9_4lOg';

  const { data: shortsData, isLoading } = useQuery({
    queryKey: ['youtube-shorts-analytics'],
    queryFn: async () => {
      const response = await base44.functions.invoke('getYouTubeVideos', {
        channelId: CHANNEL_ID,
        maxResults: 100,
        type: 'short'
      });
      return response.data?.videos || [];
    },
    staleTime: 2 * 60 * 1000
  });

  const shorts = [...(shortsData || [])].sort((a, b) => {
    if (sortBy === 'view_count') return b.views - a.views;
    if (sortBy === 'engagement_rate') {
      const engA = ((a.likes + a.comments) / a.views) * 100;
      const engB = ((b.likes + b.comments) / b.views) * 100;
      return engB - engA;
    }
    if (sortBy === 'published_at') return new Date(b.publishedAt) - new Date(a.publishedAt);
    return 0;
  });

  const syncMutation = useMutation({
    mutationFn: () => queryClient.invalidateQueries({ queryKey: ['youtube-shorts-analytics'] }),
    onSuccess: () => {
      // Dados recarregados
    }
  });

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="h-8 w-64 bg-gray-200 dark:bg-[var(--navy-700)] rounded animate-pulse mb-8" />
        <div className="grid md:grid-cols-4 gap-4">
          {[1,2,3,4].map(i => (
            <div key={i} className="h-24 bg-gray-200 dark:bg-[var(--navy-700)] rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const totalViews = shorts.reduce((sum, s) => sum + (s.views || 0), 0);
  const totalLikes = shorts.reduce((sum, s) => sum + (s.likes || 0), 0);
  const totalComments = shorts.reduce((sum, s) => sum + (s.comments || 0), 0);
  const avgEngagement = shorts.length > 0 
    ? (shorts.reduce((sum, s) => {
        const eng = ((s.likes + s.comments) / s.views) * 100;
        return sum + (eng || 0);
      }, 0) / shorts.length).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-8 h-8 text-[var(--brand-primary)]" />
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">YouTube Shorts Analytics</h1>
          </div>
          <Button
            onClick={() => syncMutation.mutate()}
            disabled={syncMutation.isPending}
            className="bg-[var(--brand-primary)]"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${syncMutation.isPending ? 'animate-spin' : ''}`} />
            Sincronizar
          </Button>
        </div>

        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-2">
              <Hash className="w-5 h-5 text-blue-500" />
              <span className="text-sm text-[var(--text-secondary)]">Total de Shorts</span>
            </div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">{shorts.length}</p>
          </Card>

          <Card className="p-6 bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-2">
              <Eye className="w-5 h-5 text-purple-500" />
              <span className="text-sm text-[var(--text-secondary)]">Visualizações</span>
            </div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {totalViews.toLocaleString()}
            </p>
          </Card>

          <Card className="p-6 bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-2">
              <ThumbsUp className="w-5 h-5 text-green-500" />
              <span className="text-sm text-[var(--text-secondary)]">Total de Likes</span>
            </div>
            <p className="text-3xl font-bold text-[var(--text-primary)]">
              {totalLikes.toLocaleString()}
            </p>
          </Card>

          <Card className="p-6 bg-[var(--bg-elevated)] border-[var(--border-primary)]">
            <div className="flex items-center gap-3 mb-2">
              <TrendingUp className="w-5 h-5 text-[var(--brand-primary)]" />
              <span className="text-sm text-[var(--text-secondary)]">Engajamento Médio</span>
            </div>
            <p className="text-3xl font-bold text-[var(--brand-primary)]">{avgEngagement}%</p>
          </Card>
        </div>

        <Card className="p-6 bg-[var(--bg-elevated)] border-[var(--border-primary)] mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-[var(--text-primary)]">Performance dos Shorts</h2>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'view_count' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('view_count')}
              >
                <Eye className="w-4 h-4 mr-1" />
                Views
              </Button>
              <Button
                variant={sortBy === 'engagement_rate' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('engagement_rate')}
              >
                <TrendingUp className="w-4 h-4 mr-1" />
                Engajamento
              </Button>
              <Button
                variant={sortBy === 'published_at' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('published_at')}
              >
                Mais Recentes
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            {shorts.map((short, index) => {
              const engagementRate = ((short.likes + short.comments) / short.views * 100).toFixed(2);
              return (
                <a
                  key={short.id}
                  href={short.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-4 p-4 bg-[var(--bg-secondary)] rounded-lg hover:bg-[var(--bg-tertiary)] transition-colors"
                >
                  <div className="text-2xl font-bold text-[var(--text-tertiary)] w-8">
                    #{index + 1}
                  </div>
                  <img
                    src={short.thumbnail}
                    alt={short.title}
                    className="w-24 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold text-[var(--text-primary)] line-clamp-1">
                      {short.title}
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {new Date(short.publishedAt).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="flex gap-6 text-sm">
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <Eye className="w-4 h-4" />
                        <span>{short.views.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <ThumbsUp className="w-4 h-4" />
                        <span>{short.likes.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center gap-1 text-[var(--text-secondary)]">
                        <MessageCircle className="w-4 h-4" />
                        <span>{short.comments.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="text-center min-w-[60px]">
                      <div className="text-[var(--brand-primary)] font-bold">
                        {engagementRate}%
                      </div>
                      <div className="text-xs text-[var(--text-tertiary)]">
                        engajamento
                      </div>
                    </div>
                  </div>
                </a>
              );
            })}
          </div>
        </Card>
      </div>
    </div>
  );
}
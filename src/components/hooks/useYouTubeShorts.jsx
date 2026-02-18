import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';

export function useYouTubeShorts(filter = 'recentes') {
  return useQuery({
    queryKey: ['youtube-shorts', filter],
    queryFn: async () => {
      const sortField = filter === 'vistos' 
        ? '-view_count' 
        : filter === 'curtidos' 
        ? '-like_count' 
        : '-published_at';
      
      const shorts = await base44.entities.YouTubeShort.filter(
        { ativo: true },
        sortField,
        20
      );
      return shorts;
    },
    staleTime: 1000 * 60 * 30,
    cacheTime: 1000 * 60 * 60,
  });
}
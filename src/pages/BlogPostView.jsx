import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { ArrowLeft, Clock, Eye, Calendar, Share2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Button } from '@/components/ui/button';
import CommentSection from '@/components/blog/CommentSection';
import SEOHead from '@/components/blog/SEOHead';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BlogPostView() {
  const { slug } = useParams();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blogPost', slug],
    queryFn: async () => {
      const posts = await base44.entities.BlogPost.filter({ slug, status: 'publicado' });
      if (posts.length > 0) {
        await base44.entities.BlogPost.update(posts[0].id, { 
          visualizacoes: (posts[0].visualizacoes || 0) + 1 
        });
        return posts[0];
      }
      return null;
    },
  });

  if (isLoading) return <div className="p-8">Carregando...</div>;
  if (!post) return <div className="p-8">Artigo não encontrado</div>;

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.titulo,
        text: post.meta_description,
        url: window.location.href,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <SEOHead post={post} isArticle />
      
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Link to={createPageUrl('Blog')}>
          <Button variant="ghost" size="sm" className="mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o blog
          </Button>
        </Link>

        {post.imagem_destaque && (
          <img 
            src={post.imagem_destaque} 
            alt={post.titulo}
            className="w-full h-[400px] object-cover rounded-xl mb-6"
          />
        )}

        <div className="mb-6">
          <span className="inline-block px-3 py-1 bg-[var(--brand-primary-100)] text-[var(--brand-primary)] rounded-full text-sm font-semibold mb-4">
            {post.categoria}
          </span>
          <h1 className="text-4xl font-bold text-[var(--text-primary)] mb-4">{post.titulo}</h1>
          
          <div className="flex items-center gap-4 text-sm text-[var(--text-secondary)]">
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              {format(new Date(post.data_publicacao), "d 'de' MMMM, yyyy", { locale: ptBR })}
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {post.tempo_leitura} min de leitura
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              {post.visualizacoes || 0} visualizações
            </div>
            <Button variant="ghost" size="sm" onClick={handleShare} className="ml-auto">
              <Share2 className="w-4 h-4 mr-2" />
              Compartilhar
            </Button>
          </div>
        </div>

        <div 
          className="prose prose-lg max-w-none mb-12"
          dangerouslySetInnerHTML={{ __html: post.conteudo }}
        />

        <CommentSection postId={post.id} />
      </div>
    </div>
  );
}
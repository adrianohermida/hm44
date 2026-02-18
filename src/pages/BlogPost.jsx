import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { createPageUrl } from "@/utils";
import BlogPostHero from "@/components/blog/BlogPostHero";
import BlogPostContent from "@/components/blog/BlogPostContent";
import BlogPostRelated from "@/components/blog/public/BlogPostRelated";
import BlogPostComments from "@/components/blog/public/BlogPostComments";
import SchemaArticle from "@/components/seo/SchemaArticle";
import NewsletterWidget from "@/components/blog/newsletter/NewsletterWidget";

export default function BlogPost() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const htmlElement = document.documentElement;
    const theme = htmlElement.getAttribute('data-theme');
    const styles = getComputedStyle(htmlElement);
    
    console.log('🎨 [BlogPost] Theme Debug:', {
      currentTheme: theme || 'light',
      dataThemeAttr: htmlElement.getAttribute('data-theme'),
      bgPrimary: styles.getPropertyValue('--bg-primary'),
      bgSecondary: styles.getPropertyValue('--bg-secondary'),
      textPrimary: styles.getPropertyValue('--text-primary'),
      textSecondary: styles.getPropertyValue('--text-secondary'),
      brandPrimary: styles.getPropertyValue('--brand-primary'),
      bodyBg: styles.backgroundColor,
      bodyColor: styles.color
    });
  }, []);
  
  const queryParams = new URLSearchParams(location.search);
  const slug = queryParams.get('slug');
  const artigoId = queryParams.get('id');

  const { data: artigo, isLoading } = useQuery({
    queryKey: ['blog-post', slug, artigoId],
    queryFn: async () => {
      let results = [];
      
      if (slug) {
        results = await base44.entities.Blog.filter({ slug, status: 'publicado' });
      } else if (artigoId) {
        results = await base44.entities.Blog.filter({ id: artigoId });
      }

      if (!results?.length || !results[0]?.titulo) return null;
      
      const post = results[0];
      
      try {
        const user = await base44.auth.me();
        const isPublished = post.status === 'publicado' && 
          (!post.data_publicacao || new Date(post.data_publicacao) <= new Date());
        
        if (!isPublished && user?.role !== 'admin') return null;
      } catch {
        const isPublished = post.status === 'publicado' && 
          (!post.data_publicacao || new Date(post.data_publicacao) <= new Date());
        if (!isPublished) return null;
      }
      
      return post;
    },
    enabled: !!(slug || artigoId),
    staleTime: 5 * 60 * 1000
  });

  useEffect(() => {
    if (artigo?.id && artigo?.status === 'publicado') {
      base44.entities.Blog.update(artigo.id, {
        visualizacoes: (artigo.visualizacoes || 0) + 1
      }).catch(console.error);
    }
  }, [artigo?.id]);

  useEffect(() => {
    if (!isLoading && !artigo && (slug || artigoId)) {
      navigate(createPageUrl('NotFound'), { replace: true });
    }
  }, [artigo, isLoading, navigate, slug, artigoId]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-gray-600">Carregando...</div>
      </div>
    );
  }

  if (!artigo?.titulo) {
    return null;
  }

  const baseUrl = 'https://hermidamaia.adv.br';
  const urlCanonica = artigo.url_canonica || 
    (artigo.slug ? `${baseUrl}/blog/${artigo.slug}` : `${baseUrl}/BlogPost?id=${artigo.id}`);

  return (
    <HelmetProvider>
      <Helmet>
        <title>{artigo.og_title || artigo.titulo} | Blog</title>
        <meta name="description" content={artigo.meta_description || artigo.resumo || ''} />
        {artigo.keywords?.length > 0 && (
          <meta name="keywords" content={artigo.keywords.join(', ')} />
        )}
        <link rel="canonical" href={urlCanonica} />
        
        <meta property="og:type" content="article" />
        <meta property="og:title" content={artigo.og_title || artigo.titulo} />
        <meta property="og:description" content={artigo.og_description || artigo.meta_description || artigo.resumo || ''} />
        {artigo.imagem_capa && <meta property="og:image" content={artigo.imagem_capa} />}
        <meta property="og:url" content={urlCanonica} />
        
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={artigo.twitter_title || artigo.titulo} />
        <meta name="twitter:description" content={artigo.meta_description || artigo.resumo || ''} />
        {artigo.imagem_capa && <meta name="twitter:image" content={artigo.imagem_capa} />}
        
        {artigo.data_publicacao && <meta property="article:published_time" content={artigo.data_publicacao} />}
        {artigo.updated_date && <meta property="article:modified_time" content={artigo.updated_date} />}
        {artigo.autor && <meta property="article:author" content={artigo.autor} />}
        {artigo.categoria && <meta property="article:section" content={artigo.categoria} />}
        {artigo.keywords?.map(tag => (
          <meta key={tag} property="article:tag" content={tag} />
        ))}
      </Helmet>

      <SchemaArticle artigo={artigo} />

      <>
        <div className="min-h-screen bg-[var(--bg-primary)]">
          <BlogPostHero post={artigo} />
          <BlogPostContent post={artigo} />
          <div className="max-w-4xl mx-auto px-4 pb-16 space-y-12">
            <BlogPostRelated currentPost={artigo} />
            <BlogPostComments artigoId={artigo.id} escritorioId={artigo.escritorio_id} />
          </div>
        </div>
        <NewsletterWidget escritorioId={artigo.escritorio_id} tags={artigo.keywords || []} />
      </>
        </HelmetProvider>
        );
}
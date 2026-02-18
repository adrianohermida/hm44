import React, { useEffect } from 'react';
import BlogPostMarkdown from './BlogPostMarkdown';
import BlogPostCTA from './BlogPostCTA';
import NewsletterSignup from './newsletter/NewsletterSignup';
import LazyImage from './performance/LazyImage';

export default function BlogPostContent({ post }) {
  useEffect(() => {
    const styles = getComputedStyle(document.documentElement);
    console.log('📝 [BlogPostContent] Theme Variables:', {
      bgPrimary: styles.getPropertyValue('--bg-primary').trim(),
      bgSecondary: styles.getPropertyValue('--bg-secondary').trim(),
      bgTertiary: styles.getPropertyValue('--bg-tertiary').trim(),
      textPrimary: styles.getPropertyValue('--text-primary').trim(),
      textSecondary: styles.getPropertyValue('--text-secondary').trim(),
      isDarkMode: document.documentElement.getAttribute('data-theme') === 'dark'
    });
  }, []);

  if (!post || !post.titulo) return null;

  return (
    <section className="py-12 bg-[var(--bg-primary)]">
      <div className="max-w-4xl mx-auto px-4">
        <article className="prose prose-lg max-w-none prose-headings:text-gray-900 dark:prose-headings:text-[var(--brand-primary)] prose-p:text-gray-900 dark:prose-p:text-white prose-li:text-gray-900 dark:prose-li:text-white prose-strong:text-gray-900 dark:prose-strong:text-white prose-a:text-[var(--brand-primary)] hover:prose-a:text-[var(--brand-primary-400)]">
          {post.imagem_capa && (
            <LazyImage 
              src={post.imagem_capa} 
              alt={post.imagem_alt || post.titulo || 'Imagem do artigo'} 
              className="w-full aspect-video object-cover rounded-xl mb-8"
            />
          )}
          
          <BlogPostMarkdown content={post.conteudo || ''} />

          {post.keywords?.length > 0 && (
            <div className="mt-8 pt-8 border-t border-[var(--border-primary)]">
              <div className="flex flex-wrap gap-2">
                {post.keywords.map(tag => (
                  <span key={tag} className="px-3 py-1 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] text-sm rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </article>

        <div className="mt-12">
          <BlogPostCTA />
        </div>
      </div>
    </section>
  );
}
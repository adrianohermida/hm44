import React from 'react';
import { Newspaper } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import BlogCard from '@/components/ui/BlogCard';
import { BLOG_POSTS } from '@/components/constants/blogPosts';

export default function BlogSectionNavy() {
  return (
    <section className="py-20 bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] px-4 py-2 rounded-full mb-4">
            <Newspaper className="w-4 h-4" />
            <span className="font-semibold text-sm">Insights Jurídicos</span>
          </div>
          <h2 className="text-4xl font-bold text-[var(--text-primary)] mb-4">Blog e Artigos</h2>
          <p className="text-[var(--text-secondary)] max-w-2xl mx-auto">
            Conteúdo exclusivo sobre superendividamento, revisão bancária e direitos do consumidor
          </p>
        </div>
        <div className="grid md:grid-cols-3 gap-6 mb-10">
          {BLOG_POSTS.map((post, i) => (
            <BlogCard key={i} {...post} />
          ))}
        </div>
        <div className="text-center">
          <Link to={createPageUrl("Blog")}>
            <Button className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white px-6 py-3">
              Ver Todos os Artigos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
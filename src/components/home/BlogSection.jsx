import React from 'react';
import { Calendar, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function BlogSection() {
  const posts = [
    { title: 'Entenda a Lei do Superendividamento', date: '15 Dez 2024', img: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400' },
    { title: 'Direitos do Consumidor Superendividado', date: '10 Dez 2024', img: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=400' },
    { title: 'Como Renegociar Suas Dívidas', date: '5 Dez 2024', img: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400' }
  ];

  return (
    <section className="py-20 bg-[var(--brand-bg-secondary)]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center text-[var(--brand-text-primary)] mb-4">Artigos e Notícias</h2>
        <p className="text-center text-[var(--brand-text-secondary)] mb-12">Fique por dentro das últimas novidades jurídicas</p>
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          {posts.map((post, i) => (
            <article key={i} className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow border border-gray-200">
              <img src={post.img} alt={post.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center gap-2 text-sm text-[var(--brand-text-secondary)] mb-3">
                  <Calendar className="w-4 h-4" />
                  <span>{post.date}</span>
                </div>
                <h3 className="font-bold text-[var(--brand-text-primary)] mb-3 text-lg">{post.title}</h3>
                <Button variant="ghost" className="text-[var(--brand-primary)] font-semibold flex items-center gap-2 hover:gap-3 transition-all p-0 h-auto">
                  Ler mais <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </article>
          ))}
        </div>
        <div className="text-center">
          <Link to={createPageUrl("News")}>
            <Button variant="outline" className="border-2 border-[var(--brand-primary)] text-[var(--brand-primary)] hover:bg-[var(--brand-primary-50)]">
              Ver Todos os Artigos
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
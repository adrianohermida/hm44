import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Calendar, User, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export default function BlogPostHero({ post }) {
  if (!post || !post.titulo) return null;

  return (
    <section className="pt-32 pb-16 bg-gradient-to-br from-[var(--navy-950)] via-[var(--navy-900)] to-[var(--navy-800)] overflow-hidden">
      <div className="max-w-4xl mx-auto px-4">
        <Link to={createPageUrl("Blog")} className="inline-flex items-center gap-2 text-gray-300 hover:text-white mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar ao Blog</span>
        </Link>
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white">{post.titulo}</h1>
        <div className="flex flex-wrap items-center gap-4 text-gray-300">
          {post.autor && (
            <div className="flex items-center gap-2">
              <User className="w-4 h-4" />
              <span>{post.autor}{post.autor_cargo ? ` • ${post.autor_cargo}` : ''}</span>
            </div>
          )}
          {(post.data_publicacao || post.created_date) && (() => {
            try {
              const dateStr = post.data_publicacao || post.created_date;
              const date = new Date(dateStr);
              if (isNaN(date.getTime())) return null;
              return (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{format(date, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}</span>
                </div>
              );
            } catch {
              return null;
            }
          })()}
        </div>
      </div>
    </section>
  );
}
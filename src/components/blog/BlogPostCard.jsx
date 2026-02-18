import React from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Clock, Eye, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function BlogPostCard({ post }) {
  return (
    <Link 
      to={post.slug ? `${createPageUrl("BlogPost")}?slug=${post.slug}` : `${createPageUrl("BlogPost")}?id=${post.id}`}
      className="group bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all"
    >
      <div className="relative h-48 overflow-hidden">
        <img
          src={post.imagem_destaque || 'https://via.placeholder.com/600x400/10b981/ffffff?text=Artigo'}
          alt={post.titulo}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="bg-[var(--brand-primary)] text-white px-3 py-1 rounded-full text-xs font-semibold">
            {post.categoria}
          </span>
        </div>
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2 group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
          {post.titulo}
        </h3>

        <p className="text-[var(--text-secondary)] text-sm mb-4 line-clamp-3">
          {post.resumo}
        </p>

        <div className="flex items-center justify-between text-xs text-[var(--text-tertiary)] mb-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{post.tempo_leitura} min</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="w-4 h-4" />
              <span>{post.visualizacoes}</span>
            </div>
          </div>
          <span>{format(new Date(post.data_publicacao), 'dd/MM/yyyy')}</span>
        </div>

        <div className="flex items-center text-[var(--brand-primary)] font-semibold text-sm">
          Ler artigo completo
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
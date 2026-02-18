import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";

export default function BlogPostRelated({ currentPost }) {
  if (!currentPost?.id) return null;

  const { data: relacionados = [] } = useQuery({
    queryKey: ['blog-relacionados', currentPost.id],
    queryFn: async () => {
      const all = await base44.entities.Blog.filter({
        status: 'publicado',
        escritorio_id: currentPost.escritorio_id
      }, '-data_publicacao', 50);
      
      return all
        .filter(art => art?.id && art?.titulo && art.id !== currentPost.id)
        .filter(art => {
          const tagsComuns = art.keywords?.filter(t => currentPost.keywords?.includes(t)) || [];
          return tagsComuns.length > 0 || art.categoria === currentPost.categoria;
        })
        .slice(0, 3);
    },
    staleTime: 10 * 60 * 1000
  });

  if (relacionados.length === 0) return null;

  return (
    <div>
      <h3 className="text-2xl font-bold mb-8 text-[var(--text-primary)]">Artigos Relacionados</h3>
      <div className="grid md:grid-cols-3 gap-6">
        {relacionados.map((artigo) => (
          <Link key={artigo.id} to={`${createPageUrl("BlogPost")}?id=${artigo.id}`}>
            <Card className="hover:shadow-lg transition-shadow h-full bg-[var(--bg-elevated)] border-[var(--border-primary)]">
              <CardContent className="p-4">
                <h4 className="font-bold mb-2 line-clamp-2 text-[var(--text-primary)]">{artigo.titulo}</h4>
                <p className="text-sm text-[var(--text-secondary)] line-clamp-3 mb-3">{artigo.resumo}</p>
                <div className="flex items-center text-[var(--brand-primary)] text-sm font-medium">
                  Ler mais <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
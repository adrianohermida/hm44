import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import MetaTags from "@/components/seo/MetaTags";
import { Tag, Loader2 } from "lucide-react";
import BlogHero from "@/components/blog/BlogHero";
import BlogFilters from "@/components/blog/BlogFilters";
import BlogDestaque from "@/components/blog/BlogDestaque";
import BlogGrid from "@/components/blog/BlogGrid";
import BlogPagination from "@/components/blog/public/BlogPagination";
import BlogFilterPanel from "@/components/blog/BlogFilterPanel";
import BlogAdvancedFilters from "@/components/blog/BlogAdvancedFilters";

const ITEMS_PER_PAGE = 12;

export default function Blog() {
  const [busca, setBusca] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("todos");
  const [advancedFilters, setAdvancedFilters] = useState({ autor: '', tag: '' });
  const [currentPage, setCurrentPage] = useState(1);

  const { data: escritorios = [] } = useQuery({
    queryKey: ['escritorio'],
    queryFn: () => base44.entities.Escritorio.list(),
    staleTime: 5 * 60 * 1000
  });

  const { data: artigos = [], isLoading, error } = useQuery({
    queryKey: ['blog-artigos', escritorios[0]?.id],
    queryFn: async () => {
      const now = new Date().toISOString();
      const allPublished = await base44.entities.Blog.filter({ 
        status: 'publicado',
        escritorio_id: escritorios[0].id 
      }, '-data_publicacao');
      
      // Filtrar apenas artigos válidos com título e data no passado
      return allPublished.filter(art => 
        art && art.titulo && (!art.data_publicacao || new Date(art.data_publicacao) <= new Date())
      );
    },
    enabled: !!escritorios[0]?.id,
    retry: 2
  });

  const artigosFiltrados = artigos
    .filter(a => categoriaFiltro === "todos" || a.categoria === categoriaFiltro)
    .filter(a => {
      if (advancedFilters.autor && a.autor !== advancedFilters.autor) return false;
      if (advancedFilters.tag && !a.keywords?.includes(advancedFilters.tag)) return false;
      if (!busca) return true;
      const buscaLower = busca.toLowerCase();
      return (
        a.titulo?.toLowerCase().includes(buscaLower) || 
        a.resumo?.toLowerCase().includes(buscaLower) ||
        a.conteudo?.toLowerCase().includes(buscaLower) ||
        a.keywords?.some(k => k.toLowerCase().includes(buscaLower)) ||
        a.categoria?.toLowerCase().includes(buscaLower) ||
        a.autor?.toLowerCase().includes(buscaLower)
      );
    });

  const totalPages = Math.ceil(artigosFiltrados.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  
  const artigoDestaque = currentPage === 1 && !busca && categoriaFiltro === 'todos' && !advancedFilters.autor && !advancedFilters.tag 
    ? artigosFiltrados[0] 
    : null;
  const artigosPaginados = currentPage === 1 && artigoDestaque
    ? artigosFiltrados.slice(1, endIndex) 
    : artigosFiltrados.slice(startIndex, endIndex);

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <MetaTags 
        title="Blog - Artigos sobre Direito do Consumidor e Superendividamento"
        description="Artigos especializados sobre superendividamento, negociação de dívidas, direito bancário e proteção do consumidor. Conteúdo atualizado por especialistas."
        keywords="blog jurídico, direito do consumidor, superendividamento, negociação de dívidas, direito bancário, educação financeira, defesa do consumidor"
      />

      <BlogHero busca={busca} setBusca={setBusca} />
      <BlogFilters categoriaFiltro={categoriaFiltro} setCategoriaFiltro={setCategoriaFiltro} />

      <section className="py-8 sm:py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {!isLoading && artigos.length > 0 && (
            <div className="mb-6 space-y-4">
              <BlogFilterPanel 
                artigos={artigos}
                filters={advancedFilters}
                onChange={setAdvancedFilters}
              />
              <BlogAdvancedFilters
                filters={advancedFilters}
                onChange={setAdvancedFilters}
                onClear={() => setAdvancedFilters({ autor: '', tag: '' })}
              />
            </div>
          )}
          {isLoading ? (
            <div className="space-y-8">
              <div className="bg-[var(--bg-elevated)] rounded-2xl shadow-lg overflow-hidden animate-pulse border border-[var(--border-primary)]">
                <div className="grid md:grid-cols-2">
                  <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[var(--navy-800)] dark:to-[var(--navy-700)]" />
                  <div className="p-8 space-y-4">
                    <div className="h-4 bg-gray-200 dark:bg-[var(--navy-700)] rounded w-20" />
                    <div className="h-8 bg-gray-200 dark:bg-[var(--navy-700)] rounded w-3/4" />
                    <div className="h-4 bg-gray-200 dark:bg-[var(--navy-700)] rounded w-full" />
                    <div className="h-4 bg-gray-200 dark:bg-[var(--navy-700)] rounded w-2/3" />
                  </div>
                </div>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                  <div key={i} className="bg-[var(--bg-elevated)] rounded-xl shadow-md overflow-hidden animate-pulse border border-[var(--border-primary)]">
                    <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 dark:from-[var(--navy-800)] dark:to-[var(--navy-700)]" />
                    <div className="p-6 space-y-3">
                      <div className="h-4 bg-gray-200 dark:bg-[var(--navy-700)] rounded w-1/4" />
                      <div className="h-6 bg-gray-200 dark:bg-[var(--navy-700)] rounded w-3/4" />
                      <div className="h-4 bg-gray-200 dark:bg-[var(--navy-700)] rounded w-full" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16 sm:py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
                <Tag className="w-8 h-8 text-red-600 dark:text-red-400" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Erro ao carregar artigos</h3>
              <p className="text-[var(--text-secondary)] mb-6">Tente novamente mais tarde</p>
              <button 
                onClick={() => window.location.reload()} 
                className="px-6 py-2 bg-[var(--brand-primary)] text-white rounded-full hover:opacity-90 transition-opacity"
              >
                Recarregar página
              </button>
            </div>
          ) : artigosFiltrados.length === 0 ? (
            <div className="text-center py-16 sm:py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-[var(--navy-800)] mb-4">
                <Tag className="w-8 h-8 text-gray-400 dark:text-gray-500" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-bold text-[var(--text-primary)] mb-2">Nenhum artigo encontrado</h3>
              <p className="text-[var(--text-secondary)] mb-6">
                {busca ? `Nenhum resultado para "${busca}"` : "Tente buscar por outros termos ou categorias"}
              </p>
              {(busca || categoriaFiltro !== "todos" || advancedFilters.autor || advancedFilters.tag) && (
                <button 
                  onClick={() => {
                    setBusca("");
                    setCategoriaFiltro("todos");
                    setAdvancedFilters({ autor: '', tag: '' });
                    setCurrentPage(1);
                  }}
                  className="px-6 py-2 bg-[var(--brand-primary)] text-white rounded-full hover:opacity-90 transition-opacity"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-8">
              {artigoDestaque && <BlogDestaque artigo={artigoDestaque} />}
              
              <div className="flex items-center justify-between pt-6 border-t border-[var(--border-primary)]">
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)]">
                  {artigoDestaque ? 'Mais Artigos' : 'Todos os Artigos'}
                </h2>
                <span className="text-sm text-[var(--text-tertiary)]">
                  Mostrando {startIndex + 1}-{Math.min(endIndex, artigosFiltrados.length)} de {artigosFiltrados.length}
                </span>
              </div>
              
              <BlogGrid artigos={artigosPaginados} />
              
              {totalPages > 1 && (
                <BlogPagination 
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
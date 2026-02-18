import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import Breadcrumb from "@/components/seo/Breadcrumb";
import ErrorBoundary from "@/components/common/ErrorBoundary";
import GestaoHeader from "@/components/blog/gestao/GestaoHeader";
import ArtigosStats from "@/components/blog/gestao/aba-artigos/ArtigosStats";
import ArtigosContent from "@/components/blog/gestao/aba-artigos/ArtigosContent";
import { createPageUrl } from "@/utils";
import { Loader2 } from "lucide-react";

export default function GestaoBlog() {
  const navigate = useNavigate();
  const [filters, setFilters] = useState({ search: "", status: "todos", categoria: "todas" });
  const queryClient = useQueryClient();

  const { data: user, error: errorUser } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio, error: errorEscritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      if (!list?.length) throw new Error('Escritório não encontrado');
      return list[0];
    },
    enabled: !!user
  });

  const { data: artigos = [], isLoading: loadingArtigos, error: errorArtigos, refetch } = useQuery({
    queryKey: ['blog-admin', escritorio?.id],
    queryFn: async () => {
      if (!escritorio?.id) return [];
      return base44.entities.Blog.filter({ escritorio_id: escritorio.id }, '-updated_date');
    },
    enabled: !!escritorio && user?.role === 'admin'
  });



  const deletarMutation = useMutation({
    mutationFn: (id) => base44.entities.Blog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['blog-admin']);
      toast.success("Artigo deletado");
    }
  });

  const handleOtimizar = async (artigo) => {
    try {
      const { data } = await base44.functions.invoke('otimizarArtigo', { id: artigo.id });
      toast.success(`Otimizado! Score: ${data.score_anterior} → ${data.score_novo}`);
      queryClient.invalidateQueries(['blog-admin']);
      navigate(`/EditorBlog?id=${artigo.id}`);
    } catch (error) {
      toast.error('Erro ao otimizar');
    }
  };

  if (errorUser || errorEscritorio) {
    return <div className="p-6"><ErrorBoundary error={errorUser || errorEscritorio} onRetry={() => window.location.reload()} /></div>;
  }
  
  if (errorArtigos) {
    return <div className="p-6"><ErrorBoundary error={errorArtigos} onRetry={refetch} /></div>;
  }

  if (!user || !escritorio) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }
  
  if (user.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Acesso restrito a administradores</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
        <Breadcrumb items={[
          { label: 'Marketing', url: createPageUrl('Marketing') },
          { label: 'Gestão Blog' }
        ]} />
        
        <GestaoHeader 
          onNovo={() => navigate('/EditorBlog')}
          onArtigoImportado={(artigo) => navigate(`/EditorBlog?id=${artigo.id}`)}
        />
        
        <ArtigosStats artigos={artigos} />
        
        <ArtigosContent
          artigos={artigos}
          filters={filters}
          onFilterChange={setFilters}
          onEdit={(art) => navigate(`/EditorBlog?id=${art.id}`)}
          onDelete={(id) => deletarMutation.mutate(id)}
          onOtimizar={handleOtimizar}
          onCriar={() => navigate('/EditorBlog')}
          isLoading={loadingArtigos}
        />
      </div>
    </div>
  );
}
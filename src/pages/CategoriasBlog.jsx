import React, { useState } from "react";
import { base44 } from "@/api/base44Client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { createPageUrl } from "@/utils";
import Breadcrumb from "@/components/seo/Breadcrumb";
import PageHeader from "@/components/layout/PageHeader";
import CategoriasList from "@/components/blog/categorias/CategoriasList";
import CategoriaFormModal from "@/components/blog/categorias/CategoriaFormModal";
import CategoriasStats from "@/components/blog/categorias/CategoriasStats";

export default function CategoriasBlog() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(null);
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    },
    enabled: !!user
  });

  const { data: categorias = [], isLoading } = useQuery({
    queryKey: ['categorias-blog', escritorio?.id],
    queryFn: () => base44.entities.CategoriaBlog.filter(
      { escritorio_id: escritorio.id }, 
      'ordem'
    ),
    enabled: !!escritorio
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.CategoriaBlog.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(['categorias-blog']);
      toast.success("Categoria excluída");
    }
  });

  const handleEdit = (cat) => {
    setEditando(cat);
    setModalOpen(true);
  };

  const handleNova = () => {
    setEditando(null);
    setModalOpen(true);
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  }

  const breadcrumbs = [
    { label: 'Marketing', url: createPageUrl('Marketing') },
    { label: 'Categorias Blog' }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <Breadcrumb items={breadcrumbs} />
      <PageHeader
        title="Categorias do Blog"
        description="Gerencie as categorias de artigos do blog"
        breadcrumbs={breadcrumbs}
      />

      <CategoriasStats categorias={categorias} />
      
      <CategoriasList
        categorias={categorias}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={(id) => deleteMutation.mutate(id)}
        onNova={handleNova}
      />

      {modalOpen && (
        <CategoriaFormModal
          categoria={editando}
          escritorioId={escritorio?.id}
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditando(null);
          }}
        />
      )}
    </div>
  );
}
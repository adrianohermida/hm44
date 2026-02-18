import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { base44 } from "@/api/base44Client";
import { useQuery } from "@tanstack/react-query";
import { Plus, FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import ModuleHeader from "@/components/cliente/ModuleHeader";
import DocumentoCardCliente from "@/components/cliente/DocumentoCardCliente";
import DocumentosEmptyState from "@/components/cliente/DocumentosEmptyState";
import DocumentoUploadForm from "@/components/cliente/DocumentoUploadForm";
import PersistentCTABanner from "@/components/cliente/PersistentCTABanner";
import ResumeLoader from "@/components/common/ResumeLoader";

export default function MeusDocumentos() {
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const { data: user, isLoading: loadingUser } = useQuery({
    queryKey: ['user'],
    queryFn: () => base44.auth.me()
  });

  const { data: escritorio } = useQuery({
    queryKey: ['escritorio'],
    queryFn: async () => {
      const list = await base44.entities.Escritorio.list();
      return list[0];
    }
  });

  const { data: documentos = [], isLoading: loadingDocumentos, refetch: refetchDocumentos } = useQuery({
    queryKey: ['meus-documentos', user?.email, escritorio?.id],
    queryFn: async () => {
      if (!user || !escritorio?.id) return [];
      const all = await base44.entities.Documento.filter({ escritorio_id: escritorio.id });
      return all
        .filter(d => d.created_by === user.email)
        .sort((a, b) => new Date(b.created_date) - new Date(a.created_date));
    },
    enabled: !!user && !!escritorio?.id
  });

  if (loadingUser) return <ResumeLoader />;

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)]">
      <PersistentCTABanner />
      
      <ModuleHeader
        title="Meus Documentos"
        breadcrumbItems={[
          { label: 'Painel', url: createPageUrl('MeuPainel') },
          { label: 'Documentos' }
        ]}
        icon={FileText}
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto p-4 md:p-6 pb-32 md:pb-6">
        {!showForm ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Card */}
            <Card className="bg-[var(--bg-elevated)]">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-[var(--brand-primary)]" />
                  Novo Documento
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="w-full bg-[var(--brand-primary)]"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Enviar Documento
                </Button>
              </CardContent>
            </Card>

            {/* Documentos Card */}
            <Card className="bg-[var(--bg-elevated)]">
              <CardHeader>
                <CardTitle>Documentos Enviados ({documentos.length})</CardTitle>
              </CardHeader>
              <CardContent>
                {loadingDocumentos ? (
                  <Skeleton className="h-32 w-full" />
                ) : documentos.length === 0 ? (
                  <DocumentosEmptyState />
                ) : (
                  <div className="space-y-2 max-h-[300px] overflow-y-auto">
                    {documentos.map((doc) => (
                      <DocumentoCardCliente key={doc.id} documento={doc} />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        ) : (
          <Card className="bg-[var(--bg-elevated)]">
            <CardHeader>
              <CardTitle>Enviar Documento</CardTitle>
            </CardHeader>
            <CardContent>
              <DocumentoUploadForm
                user={user}
                escritorioId={escritorio?.id}
                onSuccess={() => {
                  setShowForm(false);
                  refetchDocumentos();
                }}
              />
              <Button 
                variant="outline"
                onClick={() => setShowForm(false)}
                className="mt-4 w-full"
              >
                Cancelar
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
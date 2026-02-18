import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { useLocation } from "react-router-dom";
import MetaTags from "@/components/seo/MetaTags";
import { Shield, FileText, Lock, Scale } from "lucide-react";

const ICONS = {
  termos_uso: FileText,
  politica_privacidade: Lock,
  lgpd: Shield,
  cookies: FileText,
  cfm_normas: Scale
};

export default function TermosLegais() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tipo = params.get('tipo') || 'termos_uso';

  const { data: termo, isLoading } = useQuery({
    queryKey: ['termo-legal', tipo],
    queryFn: async () => {
      const termos = await base44.entities.TermoLegal.filter({ tipo, ativo: true }, '-created_date', 1);
      return termos[0];
    }
  });

  const Icon = ICONS[tipo] || FileText;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[var(--brand-primary)]" />
      </div>
    );
  }

  if (!termo) {
    return (
      <div className="min-h-screen bg-[var(--bg-primary)] flex items-center justify-center">
        <div className="text-center">
          <Icon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">Termo não encontrado</h2>
          <p className="text-[var(--text-secondary)]">Este documento ainda não foi publicado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <MetaTags
        title={termo.titulo}
        description={`${termo.titulo} - Escritório Dr. Adriano Hermida Maia`}
      />

      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-[var(--brand-primary-100)] rounded-lg">
              <Icon className="w-6 h-6 text-[var(--brand-primary)]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[var(--text-primary)]">{termo.titulo}</h1>
              <p className="text-[var(--text-secondary)] text-sm mt-1">
                Versão {termo.versao} • Vigência desde {new Date(termo.data_vigencia).toLocaleDateString('pt-BR')}
              </p>
            </div>
          </div>
        </div>

        <div 
          className="prose prose-lg max-w-none text-[var(--text-primary)]"
          dangerouslySetInnerHTML={{ __html: termo.conteudo_html }}
        />

        <div className="mt-12 pt-8 border-t border-[var(--border-primary)] text-sm text-[var(--text-tertiary)]">
          <p>Última atualização: {new Date(termo.updated_date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
          <p className="mt-2">Hash de integridade: <code className="text-xs bg-gray-100 px-2 py-1 rounded">{termo.hash_sha256?.substring(0, 16)}...</code></p>
        </div>
      </div>
    </div>
  );
}
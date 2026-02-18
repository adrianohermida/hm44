import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import PublicoStats from "@/components/gestao/publico/PublicoStats";
import PageCard from "@/components/gestao/publico/PageCard";

const TODAS_PAGINAS = [
  { name: "Home", path: "/" },
  { name: "About", path: "/About" },
  { name: "Contact", path: "/Contact" },
  { name: "Blog", path: "/Blog" },
  { name: "BlogPost", path: "/BlogPost" },
  { name: "Dashboard", path: "/Dashboard" },
  { name: "Clientes", path: "/Clientes" },
  { name: "Processos", path: "/Processos" }
];

export default function GestaoPublico() {
  const queryClient = useQueryClient();

  const { data: user } = useQuery({
    queryKey: ["auth-user"],
    queryFn: () => base44.auth.me()
  });

  const { data: configs = [], isLoading } = useQuery({
    queryKey: ['configs-publicidade'],
    queryFn: () => base44.entities.ConfiguracaoPublicidade.list("-updated_date"),
    enabled: user?.role === 'admin'
  });

  const toggleMutation = useMutation({
    mutationFn: async ({ pageName, ativo }) => {
      const existente = configs.find(c => c.page_name === pageName);
      const page = TODAS_PAGINAS.find(p => p.name === pageName);
      const autoDesativar = new Date();
      autoDesativar.setHours(autoDesativar.getHours() + 2);

      if (existente) {
        return base44.entities.ConfiguracaoPublicidade.update(existente.id, {
          permite_acesso_publico: ativo,
          ativado_em: ativo ? new Date().toISOString() : null,
          ativado_por: ativo ? user.email : null,
          desativar_automaticamente_em: ativo ? autoDesativar.toISOString() : null
        });
      }
      return base44.entities.ConfiguracaoPublicidade.create({
        page_name: pageName,
        page_path: page?.path || `/${pageName}`,
        permite_acesso_publico: ativo,
        motivo_publicacao: "teste_pagespeed",
        ativado_em: ativo ? new Date().toISOString() : null,
        ativado_por: ativo ? user.email : null,
        desativar_automaticamente_em: ativo ? autoDesativar.toISOString() : null
      });
    },
    onSuccess: (_, { ativo }) => {
      queryClient.invalidateQueries(['configs-publicidade']);
      toast.success(ativo ? '🔓 Pública por 2h' : '🔒 Protegida');
    }
  });

  const toggleLoginMutation = useMutation({
    mutationFn: async ({ pageName, esconder }) => {
      const existente = configs.find(c => c.page_name === pageName);
      if (!existente) return;
      
      return base44.entities.ConfiguracaoPublicidade.update(existente.id, {
        esconder_botao_login: esconder
      });
    },
    onSuccess: (_, { esconder }) => {
      queryClient.invalidateQueries(['configs-publicidade']);
      toast.success(esconder ? '👁️ Botão Login Oculto' : '👁️ Botão Login Visível');
    }
  });

  if (user?.role !== 'admin') return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Gestão de Páginas Públicas</h1>
        <p className="text-gray-600">Ativar acesso público temporário</p>
      </div>
      <PublicoStats configs={configs} />
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {TODAS_PAGINAS.map(page => (
          <PageCard 
            key={page.name}
            page={page}
            config={configs.find(c => c.page_name === page.name)}
            onToggle={(name, ativo) => toggleMutation.mutate({ pageName: name, ativo })}
            onToggleLogin={(name, esconder) => toggleLoginMutation.mutate({ pageName: name, esconder })}
          />
        ))}
      </div>
    </div>
  );
}
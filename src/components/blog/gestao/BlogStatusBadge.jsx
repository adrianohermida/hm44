import React from "react";
import { Badge } from "@/components/ui/badge";

const statusConfig = {
  rascunho: { label: "Rascunho", class: "bg-gray-100 text-gray-800" },
  revisao: { label: "Em Revisão", class: "bg-yellow-100 text-yellow-800" },
  agendado: { label: "Agendado", class: "bg-blue-100 text-blue-800" },
  publicado: { label: "Publicado", class: "bg-green-100 text-green-800" },
  arquivado: { label: "Arquivado", class: "bg-red-100 text-red-800" }
};

export default function BlogStatusBadge({ status }) {
  const config = statusConfig[status] || statusConfig.rascunho;
  return <Badge className={config.class}>{config.label}</Badge>;
}
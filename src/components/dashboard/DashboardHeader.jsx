import React from "react";
import { Button } from "@/components/ui/button";
import { Plus, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function DashboardHeader({ onCreateResume, userRole }) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)]">
          Meu Painel
        </h1>
        <p className="text-sm md:text-base text-[var(--text-secondary)] mt-1">
          Gerencie suas consultas e documentos jurídicos
        </p>
      </div>
      <div className="flex gap-2 w-full sm:w-auto">
        {userRole !== 'admin' && (
          <Button asChild variant="outline" size="sm" className="flex-1 sm:flex-none">
            <Link to={createPageUrl("MinhasConsultas")}>
              <Calendar className="w-4 h-4 mr-2" aria-hidden="true" />
              <span className="hidden sm:inline">Minhas Consultas</span>
              <span className="sm:hidden">Consultas</span>
            </Link>
          </Button>
        )}
        <Button
          onClick={onCreateResume}
          size="sm"
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] flex-1 sm:flex-none"
        >
          <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
          <span className="hidden sm:inline">Novo Documento</span>
          <span className="sm:hidden">Novo</span>
        </Button>
      </div>
    </div>
  );
}
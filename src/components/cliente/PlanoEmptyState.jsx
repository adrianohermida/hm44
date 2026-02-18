import React from "react";
import { FileSpreadsheet } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createPageUrl } from "@/utils";

export default function PlanoEmptyState() {
  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
          <FileSpreadsheet className="w-10 h-10 text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Nenhum plano ativo
        </h3>
        <p className="text-[var(--text-secondary)] text-center max-w-md mb-6">
          Use nossa calculadora na página inicial para iniciar sua simulação de repactuação de dívidas.
        </p>
        <Button asChild>
          <a href={createPageUrl('Home') + '#calculator'}>
            Ir para Calculadora
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
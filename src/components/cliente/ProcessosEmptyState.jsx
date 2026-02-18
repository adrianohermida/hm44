import React from "react";
import { Scale, HelpCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ProcessosEmptyState() {
  return (
    <Card className="bg-[var(--bg-elevated)] border-[var(--border-primary)]">
      <CardContent className="flex flex-col items-center justify-center py-16 px-6">
        <div className="w-20 h-20 rounded-full bg-[var(--bg-tertiary)] flex items-center justify-center mb-6">
          <Scale className="w-10 h-10 text-[var(--text-secondary)]" />
        </div>
        <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
          Nenhum processo encontrado
        </h3>
        <p className="text-[var(--text-secondary)] text-center max-w-md mb-6">
          Se você já possui uma ação conosco, ela aparecerá aqui assim que for distribuída.
        </p>
        <Link to={createPageUrl('MeusTickets')}>
          <Button variant="outline" className="gap-2">
            <HelpCircle className="w-4 h-4" />
            Abrir Suporte
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}
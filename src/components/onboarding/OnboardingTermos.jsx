import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Shield, ChevronRight } from "lucide-react";

export default function OnboardingTermos({ termos, onAccept }) {
  const [aceites, setAceites] = useState({});

  const handleToggle = (id) => {
    setAceites(p => ({ ...p, [id]: !p[id] }));
  };

  const obrigatoriosAceitos = termos
    .filter(t => t.obrigatorio)
    .every(t => aceites[t.id]);

  return (
    <div className="space-y-4">
      {termos.map(termo => (
        <Card key={termo.id} className="border-2">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="w-5 h-5 text-[var(--brand-primary)]" />
                  {termo.titulo}
                  {termo.obrigatorio && <span className="text-red-600 text-sm">*</span>}
                </CardTitle>
                {termo.resumo && <p className="text-sm text-[var(--text-secondary)] mt-1">{termo.resumo}</p>}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-32 w-full rounded border p-3 mb-3">
              <div className="text-sm text-[var(--text-secondary)] whitespace-pre-wrap">
                {termo.conteudo}
              </div>
            </ScrollArea>
            <div className="flex items-center gap-2">
              <Checkbox checked={aceites[termo.id]} onCheckedChange={() => handleToggle(termo.id)} id={termo.id} />
              <label htmlFor={termo.id} className="text-sm cursor-pointer">
                Li e aceito {termo.obrigatorio && <span className="text-red-600">*</span>}
              </label>
            </div>
          </CardContent>
        </Card>
      ))}
      <Button 
        onClick={() => onAccept(aceites)} 
        disabled={!obrigatoriosAceitos}
        className="w-full bg-[var(--brand-primary)]"
      >
        Continuar
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </div>
  );
}
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Mail, Download } from "lucide-react";

export default function DiagnosticoCTA({ onSubmit, loading }) {
  const [dados, setDados] = useState({ nome: "", email: "", telefone: "" });
  const [aceites, setAceites] = useState({
    contato: false,
    newsletter: false,
    termos: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ ...dados, aceites });
  };

  const isValid = dados.nome && dados.email && dados.telefone && aceites.termos;

  return (
    <Card className="border-2 border-[var(--brand-primary)]">
      <CardHeader className="bg-gradient-to-r from-[var(--brand-primary-50)] to-blue-50">
        <CardTitle className="flex items-center gap-2">
          <Mail className="w-5 h-5 text-[var(--brand-primary)]" />
          Receba o Diagnóstico Completo por E-mail
        </CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label>Nome Completo *</Label>
            <Input value={dados.nome} onChange={(e) => setDados(p => ({ ...p, nome: e.target.value }))} required />
          </div>
          <div>
            <Label>E-mail *</Label>
            <Input type="email" value={dados.email} onChange={(e) => setDados(p => ({ ...p, email: e.target.value }))} required />
          </div>
          <div>
            <Label>Telefone *</Label>
            <Input value={dados.telefone} onChange={(e) => setDados(p => ({ ...p, telefone: e.target.value }))} required />
          </div>
          
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-start gap-2">
              <Checkbox checked={aceites.termos} onCheckedChange={(c) => setAceites(p => ({ ...p, termos: c }))} id="termos" />
              <label htmlFor="termos" className="text-sm text-[var(--text-secondary)] cursor-pointer">
                Aceito os <strong>Termos de Uso</strong> e <strong>Política de Privacidade</strong> *
              </label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox checked={aceites.contato} onCheckedChange={(c) => setAceites(p => ({ ...p, contato: c }))} id="contato" />
              <label htmlFor="contato" className="text-sm text-[var(--text-secondary)] cursor-pointer">
                Autorizo contato institucional e comercial
              </label>
            </div>
            <div className="flex items-start gap-2">
              <Checkbox checked={aceites.newsletter} onCheckedChange={(c) => setAceites(p => ({ ...p, newsletter: c }))} id="newsletter" />
              <label htmlFor="newsletter" className="text-sm text-[var(--text-secondary)] cursor-pointer">
                Desejo receber newsletter e materiais educacionais
              </label>
            </div>
          </div>

          <Button type="submit" disabled={!isValid || loading} className="w-full bg-[var(--brand-primary)]">
            <Download className="w-4 h-4 mr-2" />
            {loading ? "Enviando..." : "Receber Diagnóstico Completo"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
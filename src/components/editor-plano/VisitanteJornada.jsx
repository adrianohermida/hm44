import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Lock, TrendingUp, FileText, Shield } from "lucide-react";

export default function VisitanteJornada() {
  const beneficios = [
    { icon: Lock, text: "Salve seus dados com segurança" },
    { icon: TrendingUp, text: "Acompanhe a evolução do seu plano" },
    { icon: FileText, text: "Acesse relatórios personalizados" },
    { icon: Shield, text: "Proteção total dos seus dados (LGPD)" }
  ];

  return (
    <Card className="border-2 border-[var(--brand-primary)] bg-gradient-to-r from-[var(--brand-primary-50)] to-blue-50">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-[var(--brand-primary)] rounded-xl">
            <CheckCircle className="w-6 h-6 text-white" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-[var(--text-primary)] mb-2">
              Crie uma conta gratuita para:
            </h3>
            <ul className="space-y-2">
              {beneficios.map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                  <item.icon className="w-4 h-4 text-[var(--brand-primary)]" />
                  {item.text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
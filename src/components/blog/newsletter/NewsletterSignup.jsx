import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mail, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function NewsletterSignup({ escritorioId, tags = [] }) {
  const [email, setEmail] = useState("");
  const [nome, setNome] = useState("");
  const [success, setSuccess] = useState(false);

  const subscribeMutation = useMutation({
    mutationFn: async (data) => {
      const existing = await base44.entities.NewsletterSubscriber.filter({
        email: data.email,
        escritorio_id: escritorioId
      });

      if (existing.length > 0) {
        throw new Error("Email já cadastrado");
      }

      return base44.entities.NewsletterSubscriber.create(data);
    },
    onSuccess: () => {
      setSuccess(true);
      setEmail("");
      setNome("");
      toast.success("Inscrição realizada!");
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  if (success) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center gap-3 text-green-800">
          <CheckCircle2 className="w-6 h-6" />
          <div>
            <p className="font-bold">Inscrição confirmada!</p>
            <p className="text-sm">Você receberá nossos próximos artigos</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-gradient-to-r from-[var(--brand-primary-50)] to-[var(--brand-primary-100)]">
      <div className="flex items-center gap-3 mb-4">
        <Mail className="w-6 h-6 text-[var(--brand-primary)]" />
        <h3 className="font-bold text-lg">Receba novos artigos</h3>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Cadastre-se e receba conteúdo exclusivo sobre direito do consumidor
      </p>
      <div className="space-y-3">
        <Input
          placeholder="Seu nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <Input
          type="email"
          placeholder="Seu melhor email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button
          onClick={() => subscribeMutation.mutate({
            email,
            nome,
            escritorio_id: escritorioId,
            interesses: tags,
            data_inscricao: new Date().toISOString()
          })}
          disabled={!email || !nome || subscribeMutation.isPending}
          className="w-full bg-[var(--brand-primary)]"
        >
          Inscrever-me
        </Button>
      </div>
    </Card>
  );
}
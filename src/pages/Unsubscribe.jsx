import React, { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MailX, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

export default function Unsubscribe() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    setEmail(urlParams.get('email') || "");
  }, []);

  const unsubscribeMutation = useMutation({
    mutationFn: async () => {
      const subscribers = await base44.entities.NewsletterSubscriber.filter({ email });
      if (subscribers.length > 0) {
        await base44.entities.NewsletterSubscriber.update(subscribers[0].id, { ativo: false });
      }
    },
    onSuccess: () => {
      setSuccess(true);
      toast.success("Inscrição cancelada");
    }
  });

  return (
    <div className="min-h-screen bg-[var(--bg-secondary)] flex items-center justify-center p-4">
      <Card className="p-8 max-w-md w-full text-center">
        {success ? (
          <>
            <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h2 className="text-2xl font-bold mb-2">Inscrição Cancelada</h2>
            <p className="text-gray-600">
              Você não receberá mais emails da nossa newsletter
            </p>
          </>
        ) : (
          <>
            <MailX className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h2 className="text-2xl font-bold mb-2">Cancelar Newsletter</h2>
            <p className="text-gray-600 mb-6">
              Tem certeza que deseja cancelar sua inscrição?
            </p>
            <p className="text-sm text-gray-500 mb-6">Email: {email}</p>
            <Button
              onClick={() => unsubscribeMutation.mutate()}
              disabled={!email || unsubscribeMutation.isPending}
              className="w-full bg-red-600 hover:bg-red-700"
            >
              Confirmar Cancelamento
            </Button>
          </>
        )}
      </Card>
    </div>
  );
}
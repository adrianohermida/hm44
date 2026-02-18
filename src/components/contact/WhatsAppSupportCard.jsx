import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

export default function WhatsAppSupportCard() {
  return (
    <Card className="bg-[var(--bg-elevated)] border border-[var(--border-primary)]">
      <CardContent className="p-6">
        <h3 className="font-semibold text-[var(--text-primary)] mb-2">Atendimento Rápido</h3>
        <p className="text-[var(--text-secondary)] text-sm mb-4">
          Precisa de ajuda imediata? Fale conosco pelo WhatsApp para atendimento em tempo real.
        </p>
        <Button 
          className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)]"
          onClick={() => window.open('https://wa.me/5551999999999', '_blank')}
        >
          <MessageCircle className="w-4 h-4 mr-2" />
          WhatsApp
        </Button>
      </CardContent>
    </Card>
  );
}
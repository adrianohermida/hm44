import React from "react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { MessageCircle, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PersistentCTABanner() {
  const navigate = useNavigate();

  const handleOpenChat = () => {
    const event = new CustomEvent('openChatSupport', {
      detail: { openChat: true }
    });
    window.dispatchEvent(event);
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 md:bottom-auto md:top-16 bg-gradient-to-r from-[var(--brand-primary)]/95 to-[var(--brand-primary)]/85 backdrop-blur-sm border-t md:border-b border-[var(--brand-primary)] z-40">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-3 md:py-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-medium text-white text-center sm:text-left flex-1">
            Precisa de orientação legal? Fale com nosso advogado online ou inicie um atendimento!
          </p>
          
          <div className="flex gap-2 w-full sm:w-auto">
            <Button
              onClick={() => navigate(createPageUrl('AgendarConsulta'))}
              className="flex-1 sm:flex-none bg-white text-[var(--brand-primary)] hover:bg-gray-100 font-semibold h-9 text-xs md:text-sm"
            >
              <Calendar className="w-4 h-4 mr-1" />
              Agendar
            </Button>
            
            <Button
              onClick={handleOpenChat}
              variant="outline"
              className="flex-1 sm:flex-none border-white text-white hover:bg-white/10 font-semibold h-9 text-xs md:text-sm"
            >
              <MessageCircle className="w-4 h-4 mr-1" />
              Balcão Virtual
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
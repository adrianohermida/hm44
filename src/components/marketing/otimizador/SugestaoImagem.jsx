import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Image, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function SugestaoImagem({ sugestao, onGerar }) {
  const [gerando, setGerando] = useState(false);
  const [urlGerada, setUrlGerada] = useState(null);

  const handleGerar = async () => {
    setGerando(true);
    try {
      const url = await onGerar(sugestao.prompt);
      setUrlGerada(url);
      toast.success('Imagem gerada!');
    } catch (error) {
      toast.error('Erro ao gerar imagem');
    } finally {
      setGerando(false);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg border">
      <div className="flex items-start gap-3">
        <Image className="w-5 h-5 text-purple-600 mt-1" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-purple-100 text-purple-800">
              Imagem - Tópico {sugestao.topico_indice + 1}
            </Badge>
          </div>
          <p className="text-xs text-gray-700 mb-2">{sugestao.descricao}</p>
          <p className="text-xs text-gray-500 mb-3">{sugestao.justificativa}</p>
          
          {urlGerada ? (
            <img 
              src={urlGerada} 
              alt={sugestao.descricao}
              className="w-full rounded border mb-2"
            />
          ) : (
            <Button
              size="sm"
              onClick={handleGerar}
              disabled={gerando}
              className="w-full"
            >
              {gerando ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" aria-hidden="true" />
                  Gerando...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4 mr-2" aria-hidden="true" />
                  Gerar Imagem
                </>
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
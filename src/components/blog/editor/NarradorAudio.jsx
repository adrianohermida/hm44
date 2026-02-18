import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Volume2, Play, Pause, Download } from "lucide-react";
import { toast } from "sonner";

export default function NarradorAudio({ artigo, onAudioGerado }) {
  const [gerando, setGerando] = useState(false);
  const [audioUrl, setAudioUrl] = useState(artigo?.audio_narrador_url || '');
  const [tocando, setTocando] = useState(false);

  const gerarAudio = async () => {
    setGerando(true);
    try {
      // Preparar texto para narração
      const conteudoLimpo = artigo.topicos
        .map(t => {
          if (t.tipo === 'h2') return `\n\n${t.texto}\n\n`;
          if (t.tipo === 'h3') return `\n${t.texto}\n`;
          if (t.tipo === 'paragrafo') return t.texto;
          if (t.tipo === 'lista' && t.itens) return t.itens.join('. ');
          return '';
        })
        .join(' ')
        .replace(/\*\*/g, '')
        .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1')
        .substring(0, 4000);

      const textoNarracao = `${artigo.titulo}. ${conteudoLimpo}`;

      // Nota: API de Text-to-Speech não está disponível nativamente
      // Implementação alternativa: usar serviço externo ou placeholder
      toast.info('Recurso de áudio em desenvolvimento. Use ferramentas externas como Google TTS ou Amazon Polly.');
      
      // Placeholder para quando API estiver disponível
      // const resultado = await base44.integrations.Core.TextToSpeech({
      //   text: textoNarracao,
      //   voice: 'pt-BR-Standard-A',
      //   speed: 1.0
      // });
      // setAudioUrl(resultado.audio_url);
      // onAudioGerado(resultado.audio_url);
      
    } catch (error) {
      console.error('Erro:', error);
      toast.error('Erro ao gerar áudio');
    } finally {
      setGerando(false);
    }
  };

  const togglePlay = () => {
    const audio = document.getElementById('narrador-audio');
    if (tocando) {
      audio?.pause();
      setTocando(false);
    } else {
      audio?.play();
      setTocando(true);
    }
  };

  return (
    <Card className="p-4 bg-gradient-to-br from-green-50 to-teal-50 border-2 border-green-200">
      <div className="flex items-center gap-2 mb-3">
        <Volume2 className="w-5 h-5 text-green-700" />
        <h3 className="font-bold text-green-900">Narrador de Áudio</h3>
        <Badge variant="outline" className="text-xs ml-auto">Acessibilidade</Badge>
      </div>

      <p className="text-xs text-gray-600 mb-3">
        Gere versão em áudio do artigo para visitantes com deficiência visual ou preferência por áudio.
      </p>

      <Button
        onClick={gerarAudio}
        disabled={gerando || !artigo.titulo}
        className="w-full mb-2"
        variant="outline"
      >
        <Volume2 className={`w-3 h-3 mr-2 ${gerando ? 'animate-pulse' : ''}`} />
        {gerando ? 'Gerando áudio...' : 'Gerar Narração'}
      </Button>

      {audioUrl && (
        <div className="space-y-2">
          <audio id="narrador-audio" src={audioUrl} className="w-full" />
          <div className="flex gap-2">
            <Button size="sm" onClick={togglePlay} className="flex-1">
              {tocando ? <Pause className="w-3 h-3 mr-1" /> : <Play className="w-3 h-3 mr-1" />}
              {tocando ? 'Pausar' : 'Ouvir'}
            </Button>
            <Button size="sm" variant="outline" onClick={() => window.open(audioUrl)}>
              <Download className="w-3 h-3" />
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
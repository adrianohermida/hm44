import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Search, Loader2, ExternalLink, Plus } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";

export default function BuscaJurisprudenciaContextual({ onJurisprudenciaInserida }) {
  const [buscando, setBuscando] = useState(false);
  const [resultado, setResultado] = useState(null);

  const buscarJurisprudencias = async () => {
    const selection = window.getSelection();
    const trecho = selection.toString().trim();

    if (!trecho) {
      toast.error('Selecione um trecho de texto primeiro');
      return;
    }

    if (trecho.length < 20) {
      toast.error('Selecione um trecho maior (mín. 20 caracteres)');
      return;
    }

    setBuscando(true);
    try {
      const user = await base44.auth.me();
      const escritorios = await base44.entities.Escritorio.list();
      
      const { data } = await base44.functions.invoke('buscarJurisprudenciaContextual', {
        trecho_selecionado: trecho,
        escritorio_id: escritorios[0]?.id
      });

      setResultado(data);
      toast.success(`${data.jurisprudencias.length} jurisprudências encontradas`);
    } catch (error) {
      toast.error(error.message || 'Erro ao buscar jurisprudências');
    } finally {
      setBuscando(false);
    }
  };

  const inserirReferencia = (jurisp) => {
    const textoReferencia = `**${jurisp.tribunal} - ${jurisp.numero_processo}**\n${jurisp.ementa_resumida}\n[Ver jurisprudência completa](${jurisp.link})`;
    onJurisprudenciaInserida(textoReferencia, jurisp.link);
    toast.success('Jurisprudência inserida');
  };

  return (
    <Card className="p-4 border-blue-200 bg-blue-50">
      <div className="flex items-center justify-between mb-3">
        <div>
          <h4 className="font-bold text-sm">Buscar Jurisprudências</h4>
          <p className="text-xs text-gray-600">Selecione um trecho e clique para buscar</p>
        </div>
        <Button
          size="sm"
          onClick={buscarJurisprudencias}
          disabled={buscando}
        >
          {buscando ? (
            <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Buscando...</>
          ) : (
            <><Search className="w-4 h-4 mr-2" />Buscar</>
          )}
        </Button>
      </div>

      {resultado && (
        <div className="space-y-2 mt-3">
          <p className="text-xs font-semibold text-blue-700">
            Tema: {resultado.tema}
          </p>
          {resultado.jurisprudencias.length === 0 ? (
            <p className="text-xs text-gray-500">Nenhuma jurisprudência encontrada.</p>
          ) : (
            resultado.jurisprudencias.map((jurisp, i) => (
              <div key={i} className="bg-white p-2 rounded border text-xs">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="font-semibold">{jurisp.tribunal} - {jurisp.numero_processo}</p>
                    <p className="text-gray-600 mt-1">{jurisp.ementa_resumida}</p>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" onClick={() => window.open(jurisp.link, '_blank')}>
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => inserirReferencia(jurisp)}>
                      <Plus className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}
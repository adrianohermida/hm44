import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Gift, Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function SugestaoLeadMagnet({ sugestao, leadMagnetsExistentes }) {
  const navigate = useNavigate();
  
  const magnetRelacionado = leadMagnetsExistentes.find(lm => 
    lm.titulo?.toLowerCase().includes(sugestao.tema?.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-3 rounded-lg border-2 border-orange-200">
      <div className="flex items-start gap-3">
        <Gift className="w-5 h-5 text-orange-600 mt-1" aria-hidden="true" />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-orange-100 text-orange-800">Lead Magnet</Badge>
            <Badge variant="outline">
              Inserir após tópico {sugestao.onde_inserir + 1}
            </Badge>
          </div>
          
          <p className="text-sm font-medium text-gray-900 mb-2">
            {sugestao.tema}
          </p>
          <p className="text-xs text-gray-600 mb-3">
            {sugestao.justificativa}
          </p>

          {magnetRelacionado ? (
            <div className="bg-white p-2 rounded border mb-2">
              <p className="text-xs font-bold text-gray-900 mb-1">
                ✅ Lead Magnet Existente:
              </p>
              <p className="text-xs text-gray-700">{magnetRelacionado.titulo}</p>
              <Button
                size="sm"
                variant="outline"
                className="w-full mt-2"
                onClick={() => navigate(createPageUrl('LeadMagnets'))}
              >
                Ver no Módulo
              </Button>
            </div>
          ) : (
            <Button
              size="sm"
              className="w-full bg-orange-600 hover:bg-orange-700"
              onClick={() => navigate(createPageUrl('LeadMagnets'))}
            >
              <Plus className="w-4 h-4 mr-2" aria-hidden="true" />
              Criar Lead Magnet
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
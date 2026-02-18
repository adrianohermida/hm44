import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function ConcorrenteSelector({ concorrentes, selecionados, onChange }) {
  if (!concorrentes || concorrentes.length === 0) return null;

  const toggleConcorrente = (ranking) => {
    if (selecionados.includes(ranking)) {
      onChange(selecionados.filter(r => r !== ranking));
    } else {
      onChange([...selecionados, ranking]);
    }
  };

  return (
    <div className="bg-white p-3 rounded-lg border">
      <p className="text-xs font-bold text-gray-700 mb-2">
        Selecione concorrentes para comparar:
      </p>
      <div className="space-y-2">
        {concorrentes.map((conc) => (
          <div key={conc.ranking} className="flex items-center gap-2">
            <Checkbox
              id={`conc-${conc.ranking}`}
              checked={selecionados.includes(conc.ranking)}
              onCheckedChange={() => toggleConcorrente(conc.ranking)}
            />
            <Label 
              htmlFor={`conc-${conc.ranking}`}
              className="text-xs cursor-pointer flex-1 line-clamp-1"
            >
              #{conc.ranking} - {conc.titulo}
            </Label>
          </div>
        ))}
      </div>
    </div>
  );
}
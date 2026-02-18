import React from "react";
import { Badge } from "@/components/ui/badge";
import ScoreQualidade from "./ScoreQualidade";
import MetricasQualidade from "./MetricasQualidade";
import ProblemasLista from "./ProblemasLista";

export default function DetectorResultado({ resultado }) {
  if (!resultado) return null;

  return (
    <div className="space-y-4">
      <ScoreQualidade score={resultado.score_qualidade} problemas={resultado.problemas} />
      {resultado.metricas && <MetricasQualidade metricas={resultado.metricas} />}
      {resultado.problemas && resultado.problemas.length > 0 && (
        <ProblemasLista problemas={resultado.problemas} />
      )}
    </div>
  );
}
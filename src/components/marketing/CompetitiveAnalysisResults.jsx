import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RefreshCw, TrendingUp, FileText, Target } from 'lucide-react';

export default function CompetitiveAnalysisResults({ results, onReset }) {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <TrendingUp className="w-4 h-4" />
            Palavras-Chave Principais
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {results.keywords?.map((kw, idx) => (
              <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {kw}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <FileText className="w-4 h-4" />
            Tópicos de Sucesso
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.topicos?.map((top, idx) => (
              <li key={idx} className="text-sm text-gray-700">• {top}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Target className="w-4 h-4 text-green-600" />
            Oportunidades (Lacunas de Conteúdo)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {results.lacunas?.map((lac, idx) => (
              <li key={idx} className="text-sm text-gray-700 font-medium">• {lac}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Button onClick={onReset} variant="outline" className="w-full">
        <RefreshCw className="w-4 h-4 mr-2" />
        Nova Análise
      </Button>
    </div>
  );
}
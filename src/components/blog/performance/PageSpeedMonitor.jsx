import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Loader2, Gauge, TrendingUp, TrendingDown } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function PageSpeedMonitor({ url }) {
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);

  const analisar = async () => {
    setLoading(true);
    try {
      const { data } = await base44.functions.invoke('checkPageSpeed', { url });
      setScore(data);
      toast.success('Análise concluída!');
    } catch (error) {
      toast.error(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (value) => {
    if (value >= 90) return 'text-green-600';
    if (value >= 50) return 'text-amber-600';
    return 'text-red-600';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Gauge className="w-4 h-4" />
          PageSpeed Insights
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button onClick={analisar} disabled={loading} size="sm" className="w-full">
          {loading ? <Loader2 className="w-3 h-3 mr-2 animate-spin" /> : <Gauge className="w-3 h-3 mr-2" />}
          Analisar Performance
        </Button>

        {score && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">Performance</span>
              <Badge className={getScoreColor(score.performance)}>
                {score.performance}
              </Badge>
            </div>
            {score.suggestions?.map((sug, i) => (
              <p key={i} className="text-xs text-gray-600">• {sug}</p>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
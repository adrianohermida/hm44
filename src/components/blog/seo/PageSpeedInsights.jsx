import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Loader2, Gauge } from "lucide-react";
import { toast } from "sonner";

export default function PageSpeedInsights() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const analisar = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      const apiKey = "SUA_GOOGLE_API_KEY";
      const response = await fetch(
        `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&key=${apiKey}`
      );
      const data = await response.json();
      
      setResult({
        mobile: Math.round(data.lighthouseResult.categories.performance.score * 100),
        desktop: Math.round(data.lighthouseResult.categories.performance.score * 100)
      });
      
      toast.success("Análise concluída");
    } catch (error) {
      toast.error("Erro ao analisar");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
        <Gauge className="w-5 h-5" />
        PageSpeed Insights
      </h3>
      
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="URL da página"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={analisar} disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Analisar"}
        </Button>
      </div>

      {result && (
        <div className="grid md:grid-cols-2 gap-4">
          <div className="text-center p-4 border rounded">
            <p className="text-sm text-gray-600 mb-2">Mobile</p>
            <p className={`text-4xl font-bold ${
              result.mobile >= 90 ? 'text-green-600' : 
              result.mobile >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.mobile}
            </p>
          </div>
          <div className="text-center p-4 border rounded">
            <p className="text-sm text-gray-600 mb-2">Desktop</p>
            <p className={`text-4xl font-bold ${
              result.desktop >= 90 ? 'text-green-600' : 
              result.desktop >= 50 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {result.desktop}
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
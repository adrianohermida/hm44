import React from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCode, Download } from "lucide-react";
import PageSpeedInsights from "@/components/blog/seo/PageSpeedInsights";

export default function SEOManager() {
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  const handleDownloadSitemap = async () => {
    const { data } = await base44.functions.invoke('gerarSitemap', {});
    const blob = new Blob([data], { type: 'application/xml' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
  };

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">Gerenciador SEO</h1>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FileCode className="w-5 h-5" />
            Sitemap.xml
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Gere o sitemap atualizado com todos os artigos publicados
          </p>
          <Button onClick={handleDownloadSitemap}>
            <Download className="w-4 h-4 mr-2" />
            Baixar Sitemap
          </Button>
        </Card>

        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Robots.txt</h3>
          <p className="text-sm text-gray-600 mb-4">
            Configure regras de indexação para motores de busca
          </p>
          <pre className="bg-gray-50 p-3 rounded text-xs">
            {`User-agent: *
Allow: /
Disallow: /admin/
Sitemap: https://seu-dominio.com/sitemap.xml`}
          </pre>
        </Card>
      </div>

      <PageSpeedInsights />
    </div>
  );
}
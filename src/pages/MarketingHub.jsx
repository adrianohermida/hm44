import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sparkles, Search, TrendingUp, Image, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import RedatorIA2 from "@/components/marketing/RedatorIA2";
import PesquisaPalavrasChave from "@/components/marketing/PesquisaPalavrasChave";
import GeradorImagensIA from "@/components/marketing/GeradorImagensIA";
import AnaliseCompetitiva from "@/components/marketing/AnaliseCompetitiva";
import TemplatesConteudo from "@/components/marketing/TemplatesConteudo";
import SocialMediaGenerator from "@/components/marketing/SocialMediaGenerator";
import AdCopyGenerator from "@/components/marketing/AdCopyGenerator";
import ContentGeneratorModal from "@/components/marketing/ContentGeneratorModal";
import CompetitiveAnalysisModal from "@/components/marketing/CompetitiveAnalysisModal";

export default function MarketingHub() {
  const [showGenerator, setShowGenerator] = useState(false);
  const [showCompetitive, setShowCompetitive] = useState(false);
  
  const { data: user } = useQuery({
    queryKey: ['auth-user'],
    queryFn: () => base44.auth.me()
  });

  if (user?.role !== 'admin') {
    return <div className="p-8 text-center text-red-600">Acesso restrito</div>;
  }

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Hub de Marketing & Conteúdo</h1>
          <p className="text-gray-600 mt-2">Ferramentas profissionais de SEO e geração de conteúdo</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCompetitive(true)} variant="outline" className="gap-2">
            <Target className="w-4 h-4" />
            Análise Competitiva
          </Button>
          <Button onClick={() => setShowGenerator(true)} className="gap-2">
            <Sparkles className="w-4 h-4" />
            Criar Conteúdo IA
          </Button>
        </div>
      </div>

      <Tabs defaultValue="redator" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="redator">
            <Sparkles className="w-4 h-4 mr-2" />
            Redator IA 2.0
          </TabsTrigger>
          <TabsTrigger value="keywords">
            <Search className="w-4 h-4 mr-2" />
            Palavras-Chave
          </TabsTrigger>
          <TabsTrigger value="analytics">
            <TrendingUp className="w-4 h-4 mr-2" />
            Analytics SEO
          </TabsTrigger>
          <TabsTrigger value="images">
            <Image className="w-4 h-4 mr-2" />
            Gerador Imagens
          </TabsTrigger>
        </TabsList>

        <TabsContent value="redator">
          <RedatorIA2 />
        </TabsContent>

        <TabsContent value="keywords">
          <div className="grid md:grid-cols-2 gap-6">
            <PesquisaPalavrasChave />
            <AnaliseCompetitiva />
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid gap-6">
            <TemplatesConteudo />
            <SocialMediaGenerator />
            <AdCopyGenerator />
          </div>
        </TabsContent>

        <TabsContent value="images">
          <div className="max-w-3xl mx-auto">
            <GeradorImagensIA />
          </div>
        </TabsContent>
      </Tabs>

      <ContentGeneratorModal 
        open={showGenerator}
        onClose={() => setShowGenerator(false)}
      />

      <CompetitiveAnalysisModal
        open={showCompetitive}
        onClose={() => setShowCompetitive(false)}
      />
    </div>
  );
}
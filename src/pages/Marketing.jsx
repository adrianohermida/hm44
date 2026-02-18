import React from 'react';
import { createPageUrl } from '@/utils';
import PageHeader from '@/components/layout/PageHeader';
import CardGrid from '@/components/layout/CardGrid';
import ModuleCard from '@/components/layout/ModuleCard';
import { Target, TrendingUp, FileText, Mail, MessageSquare, Globe, Shield, Sparkles, Tag } from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="p-4 md:p-6">
      <CardGrid>
        <ModuleCard
          icon={Target}
          title="Roadmap"
          description="Planejamento e estratégias de marketing."
          url={createPageUrl('RoadmapMarketing')}
        />
        <ModuleCard
          icon={Sparkles}
          title="Hub Marketing"
          description="Central de ferramentas de marketing."
          url={createPageUrl('MarketingHub')}
        />
        <ModuleCard
          icon={TrendingUp}
          title="Otimizador SEO"
          description="Otimize seu conteúdo para mecanismos de busca."
          url={createPageUrl('OtimizadorSEO')}
        />
        <ModuleCard
          icon={FileText}
          title="Gestão Blog"
          description="Crie e gerencie artigos do blog."
          url={createPageUrl('GestaoBlog')}
        />
        <ModuleCard
          icon={Tag}
          title="Categorias Blog"
          description="Gerencie categorias de artigos."
          url={createPageUrl('CategoriasBlog')}
        />
        <ModuleCard
          icon={Target}
          title="Configurações Blog"
          description="Gerencie personas e tons de voz."
          url={createPageUrl('ConfiguracoesBlog')}
        />
        <ModuleCard
          icon={Mail}
          title="Newsletter"
          description="Gerencie assinantes e envios de newsletter."
          url={createPageUrl('NewsletterManager')}
        />
        <ModuleCard
          icon={MessageSquare}
          title="Comentários"
          description="Modere comentários do blog."
          url={createPageUrl('ModerarComentarios')}
        />
        <ModuleCard
          icon={TrendingUp}
          title="SEO Manager"
          description="Gerencie palavras-chave e estratégias SEO."
          url={createPageUrl('SEOManager')}
        />
        <ModuleCard
          icon={TrendingUp}
          title="YouTube Analytics"
          description="Análise de desempenho dos vídeos."
          url={createPageUrl('YouTubeAnalytics')}
        />
        <ModuleCard
          icon={TrendingUp}
          title="Backlink & SEO"
          description="Gerencie backlinks e autoridade do domínio."
          url={createPageUrl('BacklinkManager')}
        />
        <ModuleCard
          icon={FileText}
          title="Repositório de Fontes"
          description="Gerencie fontes jurídicas confiáveis."
          url={createPageUrl('RepositorioFontes')}
        />
        <ModuleCard
          icon={Globe}
          title="Páginas Públicas"
          description="Configure acesso público e performance."
          url={createPageUrl('GestaoPublico')}
        />
        <ModuleCard
          icon={Shield}
          title="Termos Legais"
          description="Gerencie termos de uso e políticas."
          url={createPageUrl('GestaoTermosLegais')}
        />
        <ModuleCard
          icon={Target}
          title="Gatilhos"
          description="Configure gatilhos mentais de conversão."
          url={createPageUrl('GatilhosMarketing')}
        />
        <ModuleCard
          icon={Sparkles}
          title="Lead Magnets"
          description="Gerencie materiais de captura de leads."
          url={createPageUrl('LeadMagnets')}
        />
        <ModuleCard
          icon={Mail}
          title="Campanhas"
          description="Crie e gerencie campanhas de email."
          url={createPageUrl('Campanhas')}
        />
      </CardGrid>
    </div>
  );
}
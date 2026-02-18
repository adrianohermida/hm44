import React from "react";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import SEOScoreHeader from "./seo/SEOScoreHeader";
import WordCountMetric from "./seo/WordCountMetric";
import HeadingStructureMetric from "./seo/HeadingStructureMetric";
import KeywordDensityMetric from "./seo/KeywordDensityMetric";
import SEOChecklistCompact from "./seo/SEOChecklistCompact";

export default function SEOPanel({ formData, onChange }) {
  const analisarConteudo = () => {
    const texto = (formData.topicos || [])
      .map(t => t.tipo === 'lista' ? t.itens?.join(' ') : t.texto)
      .join(' ')
      .toLowerCase();
    
    const palavras = texto.split(/\s+/).filter(p => p.length > 3);
    const totalPalavras = palavras.length;
    const h2Count = (formData.topicos || []).filter(t => t.tipo === 'h2').length;
    const h3Count = (formData.topicos || []).filter(t => t.tipo === 'h3').length;
    
    const keywordDensity = {};
    (formData.keywords || []).forEach(kw => {
      const count = (texto.match(new RegExp(kw.toLowerCase(), 'g')) || []).length;
      keywordDensity[kw] = totalPalavras > 0 ? ((count / totalPalavras) * 100).toFixed(2) : 0;
    });
    
    return { totalPalavras, h2Count, h3Count, keywordDensity };
  };

  const { totalPalavras, h2Count, h3Count, keywordDensity } = analisarConteudo();

  const calcularScore = () => {
    let score = 0;
    if (formData.titulo?.length >= 50 && formData.titulo?.length <= 70) score += 20;
    else if (formData.titulo?.length > 0) score += 10;
    if (formData.meta_description?.length >= 150 && formData.meta_description?.length <= 160) score += 20;
    else if (formData.meta_description?.length >= 130) score += 15;
    if (totalPalavras >= 1000) score += 20;
    else if (totalPalavras >= 600) score += 15;
    if (h2Count >= 3 && h3Count >= 2) score += 20;
    else if (h2Count >= 2) score += 12;
    if ((formData.keywords || []).length >= 5) score += 10;
    else if ((formData.keywords || []).length >= 3) score += 6;
    if (formData.imagem_capa) score += 10;
    return score;
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <SEOScoreHeader score={calcularScore()} />

        <div>
          <Label>Meta Description</Label>
          <Textarea
            value={formData.meta_description || ''}
            onChange={(e) => onChange(prev => ({ ...prev, meta_description: e.target.value }))}
            placeholder="Descrição para buscadores (150-160 caracteres)"
            rows={3}
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.meta_description?.length || 0}/160 caracteres
          </p>
        </div>

        <div>
          <Label>URL Imagem de Capa</Label>
          <Input
            value={formData.imagem_capa || ''}
            onChange={(e) => onChange(prev => ({ ...prev, imagem_capa: e.target.value }))}
            placeholder="https://..."
          />
          {formData.imagem_capa && (
            <img src={formData.imagem_capa} alt="Capa" className="mt-2 w-full rounded border" />
          )}
        </div>

        <div>
          <Label>Status</Label>
          <Select value={formData.status} onValueChange={(v) => onChange(prev => ({ ...prev, status: v }))}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="rascunho">Rascunho</SelectItem>
              <SelectItem value="revisao">Em Revisão</SelectItem>
              <SelectItem value="agendado">Agendado</SelectItem>
              <SelectItem value="publicado">Publicado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between">
          <Label>Visível no site</Label>
          <Switch checked={formData.publicado} onCheckedChange={(checked) => onChange(prev => ({ ...prev, publicado: checked }))} />
        </div>

        <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg border border-blue-200 space-y-3">
          <p className="text-sm font-bold text-blue-900">📊 Análise em Tempo Real</p>
          <WordCountMetric totalPalavras={totalPalavras} />
          <HeadingStructureMetric h2Count={h2Count} h3Count={h3Count} />
          <KeywordDensityMetric keywords={formData.keywords} keywordDensity={keywordDensity} />
          <SEOChecklistCompact titulo={formData.titulo} metaDescription={formData.meta_description} totalPalavras={totalPalavras} imagemCapa={formData.imagem_capa} />
        </div>
      </div>
    </Card>
  );
}
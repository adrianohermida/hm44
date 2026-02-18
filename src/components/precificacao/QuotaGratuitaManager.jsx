import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Zap, Plus, Save, Trash2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';

// Custos de quota do YouTube Data API v3
const YOUTUBE_QUOTA_COSTS = {
  'activities.list': 1,
  'captions.list': 50,
  'captions.insert': 400,
  'captions.update': 450,
  'captions.delete': 50,
  'channels.list': 1,
  'channels.update': 50,
  'channelSections.list': 1,
  'comments.list': 1,
  'comments.insert': 50,
  'comments.update': 50,
  'commentThreads.list': 1,
  'playlistItems.list': 1,
  'playlistItems.insert': 50,
  'playlists.list': 1,
  'search.list': 100,
  'subscriptions.list': 1,
  'videos.list': 1,
  'videos.insert': 1600,
  'videos.update': 50,
  'videos.rate': 50,
};

export default function QuotaGratuitaManager({ preco, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [config, setConfig] = useState({
    quota_gratuita_diaria: preco?.quota_gratuita_diaria || 10000,
    custo_quota: preco?.custo_quota || 1,
    quota_excedente_custo: preco?.quota_excedente_custo || 0
  });

  const isYouTube = preco?.categoria?.toLowerCase().includes('youtube') || 
                     preco?.titulo?.toLowerCase().includes('youtube');

  const handleSave = () => {
    onUpdate({
      ...preco,
      ...config,
      modelo_cobranca: config.quota_gratuita_diaria > 0 ? 'quota_gratuita' : 'por_uso'
    });
    setEditing(false);
    toast.success('Configuração de quota salva');
  };

  const autoDetectYouTubeCost = () => {
    if (!isYouTube) return;
    
    const path = preco?.path?.toLowerCase() || '';
    const matchedKey = Object.keys(YOUTUBE_QUOTA_COSTS).find(key => 
      path.includes(key.toLowerCase().replace('.', '/'))
    );
    
    if (matchedKey) {
      setConfig(prev => ({ ...prev, custo_quota: YOUTUBE_QUOTA_COSTS[matchedKey] }));
      toast.success(`Custo detectado: ${YOUTUBE_QUOTA_COSTS[matchedKey]} unidades`);
    }
  };

  const percentUsed = preco?.consumo_quota_hoje 
    ? ((preco.consumo_quota_hoje / config.quota_gratuita_diaria) * 100).toFixed(1)
    : 0;

  return (
    <Card className="border-[var(--brand-primary-200)]">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[var(--brand-primary)]" />
            <CardTitle className="text-base">Configuração de Quota Gratuita</CardTitle>
          </div>
          {!editing ? (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Configurar
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => setEditing(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave}>
                <Save className="w-4 h-4 mr-1" />
                Salvar
              </Button>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {editing ? (
          <>
            <div>
              <Label>Quota Gratuita Diária (unidades)</Label>
              <Input
                type="number"
                value={config.quota_gratuita_diaria}
                onChange={(e) => setConfig({ ...config, quota_gratuita_diaria: parseInt(e.target.value) })}
                placeholder="Ex: 10000 (YouTube padrão)"
              />
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                YouTube Data API: 10.000 unidades/dia (reset meia-noite PT)
              </p>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <Label>Custo por Chamada (unidades de quota)</Label>
                {isYouTube && (
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={autoDetectYouTubeCost}
                    className="text-xs"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Auto-detectar
                  </Button>
                )}
              </div>
              <Input
                type="number"
                value={config.custo_quota}
                onChange={(e) => setConfig({ ...config, custo_quota: parseInt(e.target.value) })}
                placeholder="Ex: 1 para videos.list, 100 para search.list"
              />
              {isYouTube && (
                <div className="text-xs text-[var(--text-tertiary)] mt-2 space-y-1">
                  <p className="font-medium">Custos comuns YouTube:</p>
                  <div className="grid grid-cols-2 gap-1">
                    <span>• videos.list: 1</span>
                    <span>• search.list: 100</span>
                    <span>• videos.insert: 1600</span>
                    <span>• captions.insert: 400</span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label>Custo por Unidade Excedente (R$)</Label>
              <Input
                type="number"
                step="0.01"
                value={config.quota_excedente_custo}
                onChange={(e) => setConfig({ ...config, quota_excedente_custo: parseFloat(e.target.value) })}
                placeholder="Ex: 0.10 (cobrar se ultrapassar limite)"
              />
              <p className="text-xs text-[var(--text-tertiary)] mt-1">
                Valor a cobrar do cliente por cada unidade além da quota gratuita
              </p>
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded">
              <span className="text-sm text-[var(--text-secondary)]">Quota Diária</span>
              <Badge variant="outline" className="font-mono">
                {config.quota_gratuita_diaria.toLocaleString()} unidades
              </Badge>
            </div>

            <div className="flex items-center justify-between p-3 bg-[var(--bg-secondary)] rounded">
              <span className="text-sm text-[var(--text-secondary)]">Custo por Chamada</span>
              <Badge variant="outline" className="font-mono">
                {config.custo_quota} {config.custo_quota === 1 ? 'unidade' : 'unidades'}
              </Badge>
            </div>

            {preco?.consumo_quota_hoje !== undefined && (
              <div className="p-3 bg-[var(--bg-secondary)] rounded space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--text-secondary)]">Consumo Hoje</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={percentUsed > 80 ? 'destructive' : 'default'}>
                      {preco.consumo_quota_hoje.toLocaleString()} / {config.quota_gratuita_diaria.toLocaleString()}
                    </Badge>
                    {percentUsed > 80 ? (
                      <AlertCircle className="w-4 h-4 text-red-500" />
                    ) : (
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                    )}
                  </div>
                </div>
                <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all ${
                      percentUsed > 80 ? 'bg-red-500' : 'bg-[var(--brand-primary)]'
                    }`}
                    style={{ width: `${Math.min(percentUsed, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-[var(--text-tertiary)]">
                  {percentUsed}% utilizado • Reset à meia-noite PT
                </p>
              </div>
            )}

            {config.quota_excedente_custo > 0 && (
              <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded">
                <span className="text-sm text-amber-800">Excedente</span>
                <Badge className="bg-amber-600">
                  R$ {config.quota_excedente_custo.toFixed(2)}/unidade
                </Badge>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
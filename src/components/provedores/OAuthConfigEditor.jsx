import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, X } from 'lucide-react';
import { toast } from 'sonner';

const OAUTH_PRESETS = {
  youtube: {
    nome: 'YouTube (Google OAuth 2.0)',
    config: {
      auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
      token_url: 'https://oauth2.googleapis.com/token',
      revoke_url: 'https://oauth2.googleapis.com/revoke',
      response_type: 'token',
      include_granted_scopes: true,
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/youtube.force-ssl',
        'https://www.googleapis.com/auth/youtube.upload',
        'https://www.googleapis.com/auth/youtube.channel-memberships.creator'
      ]
    }
  },
  analytics: {
    nome: 'YouTube Analytics',
    config: {
      auth_url: 'https://accounts.google.com/o/oauth2/v2/auth',
      token_url: 'https://oauth2.googleapis.com/token',
      revoke_url: 'https://oauth2.googleapis.com/revoke',
      response_type: 'token',
      include_granted_scopes: true,
      scopes: [
        'https://www.googleapis.com/auth/youtube.readonly',
        'https://www.googleapis.com/auth/yt-analytics.readonly',
        'https://www.googleapis.com/auth/yt-analytics-monetary.readonly'
      ]
    }
  }
};

const SCOPES_YOUTUBE = [
  { value: 'https://www.googleapis.com/auth/youtube', label: 'YouTube - Gerenciar conta' },
  { value: 'https://www.googleapis.com/auth/youtube.readonly', label: 'YouTube - Leitura' },
  { value: 'https://www.googleapis.com/auth/youtube.force-ssl', label: 'YouTube - Editar vídeos/comentários' },
  { value: 'https://www.googleapis.com/auth/youtube.upload', label: 'YouTube - Upload' },
  { value: 'https://www.googleapis.com/auth/youtube.channel-memberships.creator', label: 'YouTube - Membros do canal' },
  { value: 'https://www.googleapis.com/auth/youtubepartner', label: 'YouTube Partner' },
  { value: 'https://www.googleapis.com/auth/yt-analytics.readonly', label: 'Analytics - Leitura' },
  { value: 'https://www.googleapis.com/auth/yt-analytics-monetary.readonly', label: 'Analytics - Monetização' }
];

export default function OAuthConfigEditor({ value = {}, onChange, providerName = '' }) {
  const config = value || {};
  
  const applyPreset = (preset) => {
    onChange({ ...config, ...OAUTH_PRESETS[preset].config });
    toast.success(`✅ Preset "${OAUTH_PRESETS[preset].nome}" aplicado`);
  };

  const updateField = (field, val) => {
    onChange({ ...config, [field]: val });
  };

  const addScope = (scope) => {
    const scopes = config.scopes || [];
    if (!scopes.includes(scope)) {
      updateField('scopes', [...scopes, scope]);
    }
  };

  const removeScope = (scope) => {
    const scopes = config.scopes || [];
    updateField('scopes', scopes.filter(s => s !== scope));
  };

  const addCustomScope = () => {
    const scope = prompt('Digite o scope OAuth 2.0:');
    if (scope && scope.trim()) {
      addScope(scope.trim());
    }
  };

  const shouldShowPresets = providerName?.toLowerCase().includes('youtube');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">Configuração OAuth 2.0</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {shouldShowPresets && (
          <div className="space-y-2">
            <Label className="text-xs text-[var(--text-tertiary)]">Presets Rápidos</Label>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => applyPreset('youtube')}>
                🎥 YouTube Data
              </Button>
              <Button size="sm" variant="outline" onClick={() => applyPreset('analytics')}>
                📊 Analytics
              </Button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Client ID</Label>
            <Input 
              value={config.client_id || ''} 
              onChange={e => updateField('client_id', e.target.value)}
              placeholder="Client ID OAuth"
            />
          </div>
          <div>
            <Label className="text-xs">Client Secret</Label>
            <Input 
              type="password"
              value={config.client_secret || ''} 
              onChange={e => updateField('client_secret', e.target.value)}
              placeholder="Client Secret"
            />
          </div>
        </div>

        <div>
          <Label className="text-xs">Auth URL</Label>
          <Input 
            value={config.auth_url || ''} 
            onChange={e => updateField('auth_url', e.target.value)}
            placeholder="https://accounts.google.com/o/oauth2/v2/auth"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Token URL</Label>
            <Input 
              value={config.token_url || ''} 
              onChange={e => updateField('token_url', e.target.value)}
              placeholder="https://oauth2.googleapis.com/token"
            />
          </div>
          <div>
            <Label className="text-xs">Revoke URL</Label>
            <Input 
              value={config.revoke_url || ''} 
              onChange={e => updateField('revoke_url', e.target.value)}
              placeholder="https://oauth2.googleapis.com/revoke"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs">Response Type</Label>
            <Input 
              value={config.response_type || 'token'} 
              onChange={e => updateField('response_type', e.target.value)}
              placeholder="token"
            />
          </div>
          <div className="flex items-center gap-2 pt-6">
            <input 
              type="checkbox"
              id="include_scopes"
              checked={config.include_granted_scopes || false}
              onChange={e => updateField('include_granted_scopes', e.target.checked)}
              className="h-4 w-4"
            />
            <Label htmlFor="include_scopes" className="text-xs">
              Include Granted Scopes
            </Label>
          </div>
        </div>

        <div>
          <Label className="text-xs">Redirect URI</Label>
          <Input 
            value={config.redirect_uri || ''} 
            onChange={e => updateField('redirect_uri', e.target.value)}
            placeholder="http://localhost:3000/oauth/callback"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="text-xs">Scopes OAuth</Label>
            <Button size="sm" variant="outline" onClick={addCustomScope}>
              <Plus className="w-3 h-3 mr-1" />Custom
            </Button>
          </div>
          
          {shouldShowPresets && (
            <div className="space-y-1 mb-2">
              {SCOPES_YOUTUBE.map(s => (
                <div key={s.value} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={`scope-${s.value}`}
                    checked={(config.scopes || []).includes(s.value)}
                    onChange={e => e.target.checked ? addScope(s.value) : removeScope(s.value)}
                    className="h-3 w-3"
                  />
                  <Label htmlFor={`scope-${s.value}`} className="text-xs text-[var(--text-secondary)]">
                    {s.label}
                  </Label>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex flex-wrap gap-1 mt-2">
            {(config.scopes || []).map(scope => (
              <Badge key={scope} variant="secondary" className="text-[10px] gap-1">
                {scope.split('/').pop()}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => removeScope(scope)}
                />
              </Badge>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
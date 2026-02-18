import React from 'react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Lock, Unlock, Eye, EyeOff } from 'lucide-react';

export default function PageCard({ page, config, onToggle, onToggleLogin }) {
  const isPublic = config?.permite_acesso_publico || false;
  const esconderLogin = config?.esconder_botao_login || false;
  
  return (
    <div className="bg-white rounded-xl shadow p-4 border space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold">{page.name}</h3>
          <p className="text-xs text-gray-500">{page.path}</p>
        </div>
        {isPublic ? (
          <Unlock className="w-5 h-5 text-green-600" />
        ) : (
          <Lock className="w-5 h-5 text-gray-400" />
        )}
      </div>

      <Button
        size="sm"
        variant={isPublic ? "destructive" : "default"}
        className="w-full"
        onClick={() => onToggle(page.name, !isPublic)}
      >
        {isPublic ? 'Proteger' : 'Tornar Pública (2h)'}
      </Button>

      {isPublic && (
        <div className="pt-3 border-t">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              {esconderLogin ? (
                <EyeOff className="w-4 h-4 text-orange-600" />
              ) : (
                <Eye className="w-4 h-4 text-gray-500" />
              )}
              <span className="text-sm font-medium">Esconder Login</span>
            </div>
            <Switch
              checked={esconderLogin}
              onCheckedChange={(checked) => onToggleLogin(page.name, checked)}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {esconderLogin ? 'Botão oculto para visitantes' : 'Botão visível para todos'}
          </p>
        </div>
      )}
    </div>
  );
}
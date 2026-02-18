import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { CustomAvatar } from '@/components/ui/CustomAvatar';
import { Upload, Camera } from 'lucide-react';
import { toast } from 'sonner';

export default function AvatarUpload({ user, onChange, disabled }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange('foto_url', file_url);
      toast.success('Foto atualizada');
    } catch (error) {
      toast.error('Erro ao enviar foto');
    }
    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <Camera className="w-5 h-5" />
          Foto de Perfil
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          <CustomAvatar
            src={user.foto_url || user.avatar_url || user.profile_photo || user.avatar}
            alt={user.full_name}
            fallback={user.full_name?.charAt(0) || 'U'}
            className="h-32 w-32"
            fallbackClassName="bg-[var(--brand-primary-100)] text-[var(--brand-primary-700)] font-semibold text-4xl"
          />
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={disabled || uploading}
              className="hidden"
              id="avatar-upload"
            />
            <label htmlFor="avatar-upload">
              <Button 
                as="span" 
                variant="outline" 
                disabled={disabled || uploading}
                className="cursor-pointer hover:bg-[var(--brand-primary-50)]"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Enviando...' : 'Alterar Foto'}
              </Button>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
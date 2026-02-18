import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { base44 } from '@/api/base44Client';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

export default function LogoUpload({ logoUrl, onChange, disabled }) {
  const [uploading, setUploading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      onChange('logo_url', file_url);
      toast.success('Logo enviado com sucesso');
    } catch (error) {
      toast.error('Erro ao enviar logo');
    }
    setUploading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-[var(--brand-primary)]">
          <ImageIcon className="w-5 h-5" />
          Logo do Escritório
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4">
          {logoUrl && (
            <img 
              src={logoUrl} 
              alt="Logo" 
              className="w-24 h-24 object-contain border rounded-lg p-2"
            />
          )}
          <div>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              disabled={disabled || uploading}
              className="hidden"
              id="logo-upload"
            />
            <label htmlFor="logo-upload">
              <Button 
                as="span" 
                variant="outline" 
                disabled={disabled || uploading}
                className="cursor-pointer hover:bg-[var(--brand-primary-50)]"
              >
                <Upload className="w-4 h-4 mr-2" />
                {uploading ? 'Enviando...' : 'Upload Logo'}
              </Button>
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState } from 'react';
import { toast } from 'sonner';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const MAX_TOTAL_SIZE = 25 * 1024 * 1024; // 25MB

export function useFileUpload(anexos, onAnexosChange) {
  const [isUploading, setIsUploading] = useState(false);

  const toBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
    });
  };

  const processFiles = async (files) => {
    setIsUploading(true);
    const fileArray = Array.from(files);

    try {
      const currentTotalSize = anexos.reduce((sum, a) => sum + a.size, 0);
      const newTotalSize = fileArray.reduce((sum, f) => sum + f.size, currentTotalSize);

      if (newTotalSize > MAX_TOTAL_SIZE) {
        toast.error('Tamanho total dos anexos excede 25MB');
        return;
      }

      for (const file of fileArray) {
        if (file.size > MAX_FILE_SIZE) {
          toast.error(`${file.name} excede 10MB`);
          continue;
        }

        const content = await toBase64(file);
        onAnexosChange([...anexos, {
          filename: file.name,
          type: file.type,
          size: file.size,
          content
        }]);
      }

      toast.success(`${fileArray.length} arquivo(s) anexado(s)`);
    } catch (error) {
      toast.error('Erro ao processar arquivos');
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return { processFiles, isUploading };
}
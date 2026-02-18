import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Upload, Loader2, FileText, CheckCircle2, X } from 'lucide-react';
import { toast } from 'sonner';
import Papa from 'papaparse';

export default function ImportarTemplatesCSV({ escritorioId, onClose }) {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const queryClient = useQueryClient();

  const importMutation = useMutation({
    mutationFn: async () => {
      const templates = preview.map(row => ({
        escritorio_id: escritorioId,
        nome: row.nome,
        corpo: row.corpo,
        assunto: row.assunto || '',
        categoria: row.categoria || 'outro',
        atalho: row.atalho || '',
        ativo: true
      }));

      await base44.entities.TemplateResposta.bulkCreate(templates);
      return templates.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries(['templates']);
      toast.success(`${count} templates importados`);
      onClose?.();
    },
    onError: () => toast.error('Erro ao importar templates')
  });

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;

    setFile(selectedFile);

    Papa.parse(selectedFile, {
      header: true,
      complete: (results) => {
        const valid = results.data.filter(row => row.nome && row.corpo);
        setPreview(valid);
        if (valid.length === 0) {
          toast.error('CSV deve ter colunas: nome, corpo, assunto, categoria, atalho');
        }
      },
      error: () => toast.error('Erro ao ler arquivo')
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Importar Templates</h3>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="border-2 border-dashed rounded-lg p-6 text-center">
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          id="csv-upload"
        />
        <label htmlFor="csv-upload" className="cursor-pointer">
          <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
          <p className="text-sm text-gray-600">
            {file ? file.name : 'Selecione arquivo CSV'}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Colunas: nome, corpo, assunto, categoria, atalho
          </p>
        </label>
      </div>

      {preview.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">{preview.length} templates</span>
            <Button
              onClick={() => importMutation.mutate()}
              disabled={importMutation.isPending}
            >
              {importMutation.isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle2 className="w-4 h-4 mr-2" />
              )}
              Importar
            </Button>
          </div>

          <div className="max-h-[300px] overflow-y-auto space-y-2">
            {preview.slice(0, 5).map((row, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-gray-50 rounded text-xs">
                <FileText className="w-4 h-4 text-gray-400 flex-shrink-0" />
                <div>
                  <p className="font-medium">{row.nome}</p>
                  <p className="text-gray-600 truncate">{row.corpo.substring(0, 60)}...</p>
                </div>
              </div>
            ))}
            {preview.length > 5 && (
              <p className="text-xs text-gray-500 text-center">
                +{preview.length - 5} templates
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
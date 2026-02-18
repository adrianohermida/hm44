import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database } from 'lucide-react';
import StreamCSVUploader from './StreamCSVUploader';
import StreamCSVProgress from './StreamCSVProgress';
import StreamCSVResult from './StreamCSVResult';
import useCSVImport from './hooks/useCSVImport';
import useCSVErrors from './hooks/useCSVErrors';

export default function StreamCSVImporter({ entityName, schemaType, title, description }) {
  const [file, setFile] = useState(null);
  const { importing, progress, stats, result, errors, startImport, cancelImport } = useCSVImport(entityName, schemaType);
  const { downloadErrors } = useCSVErrors(entityName);

  const { data: existingCount = 0 } = useQuery({
    queryKey: [entityName.toLowerCase(), 'count'],
    queryFn: async () => {
      const records = await base44.entities[entityName].list();
      return records.length;
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline" className="gap-2">
            <Database className="w-3 h-3" />
            {existingCount} já importados
          </Badge>
        </CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <StreamCSVUploader
          file={file}
          onFileSelect={setFile}
          onFileRemove={() => setFile(null)}
          disabled={importing}
        />

        <div className="flex gap-2">
          <Button onClick={() => startImport(file)} disabled={!file || importing} className="flex-1">
            {importing ? 'Importando...' : 'Importar CSV'}
          </Button>
          {importing && (
            <Button onClick={cancelImport} variant="outline" className="min-w-[100px]">
              Cancelar
            </Button>
          )}
        </div>

        <StreamCSVProgress progress={progress} stats={stats} importing={importing} existingCount={existingCount} />
        <StreamCSVResult result={result} errors={errors} onDownloadErrors={() => downloadErrors(errors)} />
      </CardContent>
    </Card>
  );
}
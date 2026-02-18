import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { MessageSquare, Award, FileText } from 'lucide-react';

export default function ProofStats({ depoimentos, reconhecimentos, publicacoes }) {
  return (
    <div className="grid md:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            <div>
              <p className="text-2xl font-bold">{depoimentos}</p>
              <p className="text-sm text-[var(--text-secondary)]">Depoimentos</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Award className="w-8 h-8 text-purple-500" />
            <div>
              <p className="text-2xl font-bold">{reconhecimentos}</p>
              <p className="text-sm text-[var(--text-secondary)]">Reconhecimentos</p>
            </div>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <FileText className="w-8 h-8 text-green-500" />
            <div>
              <p className="text-2xl font-bold">{publicacoes}</p>
              <p className="text-sm text-[var(--text-secondary)]">Publicações</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
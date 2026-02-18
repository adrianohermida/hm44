import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Target } from 'lucide-react';
import CompetitiveAnalysisForm from './CompetitiveAnalysisForm';
import CompetitiveAnalysisResults from './CompetitiveAnalysisResults';
import { useCompetitiveAnalysis } from './hooks/useCompetitiveAnalysis';

export default function CompetitiveAnalysisModal({ open, onClose }) {
  const [results, setResults] = useState(null);
  const { analyzeMutation } = useCompetitiveAnalysis();

  const handleAnalyze = async (url) => {
    const data = await analyzeMutation.mutateAsync(url);
    setResults(data);
  };

  const handleReset = () => {
    setResults(null);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[var(--brand-primary)]" />
            Análise Competitiva
          </DialogTitle>
        </DialogHeader>

        {!results ? (
          <CompetitiveAnalysisForm 
            onAnalyze={handleAnalyze}
            loading={analyzeMutation.isPending}
          />
        ) : (
          <CompetitiveAnalysisResults
            results={results}
            onReset={handleReset}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RefreshCw, CheckCircle2, AlertCircle, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

export default function VerifyFileButton({ violation, onVerified }) {
  const [isVerifying, setIsVerifying] = React.useState(false);
  const [verificationResult, setVerificationResult] = React.useState(null);

  const handleVerify = async () => {
    setIsVerifying(true);
    try {
      const response = await base44.functions.invoke('auditarCodigo', {
        action: 'verify',
        filePath: violation.file_path,
        expectedLines: violation.expected_lines
      });

      setVerificationResult(response.data);
      
      if (response.data.wasFixed) {
        toast.success(response.data.message);
        onVerified?.(violation.id, response.data);
      } else {
        toast.info(response.data.message);
      }
    } catch (error) {
      toast.error('Erro ao verificar arquivo');
    } finally {
      setIsVerifying(false);
    }
  };

  const getStatusIcon = () => {
    if (!verificationResult) return <Clock className="w-3 h-3" />;
    if (verificationResult.wasFixed) return <CheckCircle2 className="w-3 h-3" />;
    return <AlertCircle className="w-3 h-3" />;
  };

  const getStatusColor = () => {
    if (!verificationResult) return 'bg-gray-500';
    if (verificationResult.wasFixed) return 'bg-green-600';
    return 'bg-orange-600';
  };

  return (
    <div className="space-y-2">
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleVerify}
        disabled={isVerifying}
        className="gap-2 w-full"
      >
        <RefreshCw className={`w-3 h-3 ${isVerifying ? 'animate-spin' : ''}`} />
        {isVerifying ? 'Verificando...' : 'Verificar Status'}
      </Button>

      {verificationResult && (
        <div className={`p-3 rounded-lg border-2 ${
          verificationResult.wasFixed 
            ? 'bg-green-50 border-green-300' 
            : 'bg-orange-50 border-orange-300'
        }`}>
          <div className="flex items-start justify-between mb-2">
            <Badge className={`${getStatusColor()} gap-1`}>
              {getStatusIcon()}
              {verificationResult.status === 'resolved' ? 'RESOLVIDO' : 'PENDENTE'}
            </Badge>
            <span className="text-xs text-[var(--text-tertiary)]">
              {new Date(verificationResult.timestamp).toLocaleTimeString('pt-BR')}
            </span>
          </div>
          
          <p className="text-sm font-semibold mb-2">
            {verificationResult.message}
          </p>

          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-white rounded">
              <p className="text-[var(--text-tertiary)]">Atual</p>
              <p className="font-mono font-bold">{verificationResult.currentLines}L</p>
            </div>
            <div className="p-2 bg-white rounded">
              <p className="text-[var(--text-tertiary)]">Meta</p>
              <p className="font-mono font-bold">≤{verificationResult.expectedLines}L</p>
            </div>
          </div>

          {verificationResult.improvement > 0 && (
            <div className="mt-2 p-2 bg-green-100 rounded text-center">
              <p className="text-xs font-semibold text-green-700">
                📉 Redução: -{verificationResult.improvement} linhas
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
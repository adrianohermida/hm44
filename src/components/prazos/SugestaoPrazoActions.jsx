import React from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle, X, Loader2 } from 'lucide-react';

export default function SugestaoPrazoActions({ onAceitar, onRejeitar, loading }) {
  return (
    <div className="flex gap-2">
      <Button 
        size="sm" 
        onClick={onAceitar}
        disabled={loading}
        className="flex-1"
      >
        {loading ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <>
            <CheckCircle className="w-4 h-4 mr-1" />
            Aceitar
          </>
        )}
      </Button>
      <Button variant="outline" size="sm" onClick={onRejeitar}>
        <X className="w-4 h-4" />
      </Button>
    </div>
  );
}
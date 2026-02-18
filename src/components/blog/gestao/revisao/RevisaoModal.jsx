import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CheckCircle, XCircle, MessageSquare, Loader2 } from "lucide-react";

export default function RevisaoModal({ artigo, onClose, onRevisar, isLoading }) {
  const [feedback, setFeedback] = useState("");

  return (
    <Dialog open={!!artigo} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Revisar: {artigo.titulo}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-1">Resumo:</p>
            <p className="text-sm text-gray-600">{artigo.resumo || 'Sem resumo'}</p>
          </div>

          <div>
            <Label htmlFor="feedback">Feedback (opcional)</Label>
            <Textarea
              id="feedback"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Adicione comentários, sugestões ou razões..."
              rows={4}
              className="mt-1"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <Button
              onClick={() => onRevisar('aprovar', feedback)}
              disabled={isLoading}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <CheckCircle className="w-4 h-4 mr-2" />
              )}
              Aprovar
            </Button>
            <Button
              onClick={() => onRevisar('solicitar', feedback)}
              disabled={isLoading || !feedback}
              variant="outline"
              className="flex-1"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Solicitar Alterações
            </Button>
            <Button
              onClick={() => onRevisar('rejeitar', feedback)}
              disabled={isLoading}
              variant="destructive"
              className="flex-1"
            >
              <XCircle className="w-4 h-4 mr-2" />
              Rejeitar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
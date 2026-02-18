import React from 'react';
import { Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AIProcessingIndicator({ isProcessing, toolName, status }) {
  return (
    <AnimatePresence>
      {isProcessing && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className="sticky top-0 z-50 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-3 shadow-lg"
        >
          <div className="flex items-center justify-center gap-3">
            {status === 'processing' && (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="font-medium">IA gerando: {toolName}</span>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                </div>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">{toolName} concluído com sucesso!</span>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
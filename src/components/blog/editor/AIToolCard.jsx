import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AIToolCard({ 
  title, 
  description, 
  icon: Icon = Sparkles,
  children, 
  isLoading = false,
  isSuccess = false,
  isError = false,
  errorMessage = '',
  action,
  actionLabel = 'Gerar',
  actionIcon: ActionIcon = Sparkles,
  disabled = false
}) {
  return (
    <Card className="p-4 relative overflow-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-10 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-2" />
            <p className="text-sm font-medium text-gray-700">Gerando com IA...</p>
            <div className="flex gap-1 justify-center mt-2">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        </div>
      )}

      {/* Success Overlay */}
      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-green-500/10 border-2 border-green-500 z-10 flex items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-white rounded-full p-3 shadow-lg"
          >
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </motion.div>
        </motion.div>
      )}

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="w-5 h-5 text-blue-600" />
          <h4 className="font-semibold text-gray-900">{title}</h4>
        </div>
        {action && (
          <Button
            size="sm"
            onClick={action}
            disabled={disabled || isLoading}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <ActionIcon className="w-4 h-4 mr-2" />
            )}
            {isLoading ? 'Gerando...' : actionLabel}
          </Button>
        )}
      </div>

      {description && (
        <p className="text-sm text-gray-600 mb-4">{description}</p>
      )}

      {isError && errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-800">{errorMessage}</p>
        </div>
      )}

      {children}
    </Card>
  );
}
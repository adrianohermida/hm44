import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertCircle, Bug, Trash2, X, Zap, Copy, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function ErrorLogger({ userRole }) {
  const [errors, setErrors] = useState([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (userRole !== 'admin') return;

    // Intercepta erros gerais
    const errorHandler = (event) => {
      addError({
        id: Date.now(),
        type: 'runtime',
        message: event.message || 'Unknown error',
        stack: event.error?.stack,
        timestamp: new Date().toISOString(),
        source: event.filename,
        line: event.lineno,
        column: event.colno
      });
    };

    // Intercepta fetch errors (API/endpoints)
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = Date.now();
      const url = typeof args[0] === 'string' ? args[0] : args[0]?.url;
      const method = args[1]?.method || 'GET';
      
      try {
        const response = await originalFetch(...args);
        const duration = Date.now() - startTime;

        // Log erros HTTP (4xx, 5xx)
        if (!response.ok) {
          const clonedResponse = response.clone();
          let errorBody = null;
          
          try {
            errorBody = await clonedResponse.json();
          } catch {
            try {
              errorBody = await clonedResponse.text();
            } catch {}
          }

          addError({
            id: Date.now(),
            type: 'http',
            message: `HTTP ${response.status}: ${method} ${url.split('/').slice(-3).join('/')}`,
            endpoint: url,
            status: response.status,
            statusText: response.statusText,
            method,
            duration: `${duration}ms`,
            errorBody,
            timestamp: new Date().toISOString()
          });
        }

        return response;
      } catch (networkError) {
        const duration = Date.now() - startTime;
        
        addError({
          id: Date.now(),
          type: 'network',
          message: `Network Failure: ${method} ${url}`,
          endpoint: url,
          method,
          error: networkError.message,
          duration: `${duration}ms`,
          timestamp: new Date().toISOString()
        });
        
        throw networkError;
      }
    };

    window.addEventListener('error', errorHandler);
    
    return () => {
      window.removeEventListener('error', errorHandler);
      window.fetch = originalFetch;
    };
  }, [userRole]);

  const addError = (newError) => {
    setErrors((prev) => {
      const isDuplicate = prev.some(
        (err) => err.message === newError.message && 
        (Date.now() - new Date(err.timestamp).getTime() < 1000)
      );
      if (isDuplicate) return prev;
      return [newError, ...prev].slice(0, 100);
    });
  };

  const clearErrors = () => {
    setErrors([]);
    toast.success('Erros limpos');
  };

  const exportErrors = () => {
    const exportData = {
      timestamp: new Date().toISOString(),
      total: errors.length,
      errors: errors.map(err => ({
        timestamp: err.timestamp,
        type: err.type,
        message: err.message,
        endpoint: err.endpoint,
        status: err.status,
        method: err.method,
        duration: err.duration,
        errorBody: err.errorBody,
        stack: err.stack
      }))
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `errors-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Erros exportados');
  };

  if (userRole !== 'admin') return null;

  return (
    <div className="fixed bottom-24 right-4 z-[9999]">
      <Button
        variant="destructive"
        size="sm"
        onClick={() => setIsVisible(!isVisible)}
        className="shadow-lg gap-2"
      >
        <Bug className="w-4 h-4" />
        Erros: {errors.length}
      </Button>

      {isVisible && (
        <Card className="absolute bottom-full right-0 mb-2 w-[600px] max-h-[600px] shadow-2xl">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Debug Logger
              </CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={exportErrors}>
                  <Download className="w-3 h-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={clearErrors}>
                  <Trash2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <ScrollArea className="h-[500px] px-4">
              {errors.length === 0 ? (
                <div className="text-center py-12 text-slate-500">
                  <Bug className="w-12 h-12 mx-auto mb-2 opacity-20" />
                  <p>Nenhum erro registrado</p>
                </div>
              ) : (
                errors.map((err) => (
                  <div key={err.id} className={`mb-3 p-3 border rounded text-xs ${
                    err.type === 'http' ? 'bg-orange-50 border-orange-200' :
                    err.type === 'network' ? 'bg-yellow-50 border-yellow-200' :
                    'bg-red-50 border-red-200'
                  }`}>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        {err.type === 'http' && <Zap className="w-3 h-3 text-orange-600" />}
                        {err.type === 'network' && <AlertCircle className="w-3 h-3 text-yellow-600" />}
                        {err.type === 'runtime' && <Bug className="w-3 h-3 text-red-600" />}
                        <Badge variant="outline" className="text-xs">{err.type}</Badge>
                        {err.status && (
                          <Badge variant="destructive" className="text-xs">HTTP {err.status}</Badge>
                        )}
                        {err.method && (
                          <Badge className="text-xs bg-slate-600">{err.method}</Badge>
                        )}
                        {err.duration && (
                          <Badge variant="outline" className="text-xs">{err.duration}</Badge>
                        )}
                      </div>
                      <span className="text-xs text-slate-500 whitespace-nowrap">
                        {new Date(err.timestamp).toLocaleTimeString()}
                      </span>
                    </div>
                    
                    <div className="font-mono font-bold text-slate-900 mb-1 break-all">{err.message}</div>
                    
                    {err.endpoint && (
                      <div className="text-blue-700 mb-1 break-all text-xs">{err.endpoint}</div>
                    )}
                    
                    {err.source && (
                      <div className="text-slate-700 mb-1 text-xs">
                        {err.source}:{err.line}:{err.column}
                      </div>
                    )}
                    
                    {err.errorBody && (
                      <details className="mt-2">
                        <summary className="text-xs text-orange-700 cursor-pointer font-semibold">
                          Response Body
                        </summary>
                        <pre className="text-xs text-orange-800 overflow-x-auto whitespace-pre-wrap bg-white p-2 rounded border mt-1">
                          {typeof err.errorBody === 'object' ? JSON.stringify(err.errorBody, null, 2) : err.errorBody}
                        </pre>
                      </details>
                    )}
                    
                    {err.stack && (
                      <details className="mt-2">
                        <summary className="text-xs text-red-700 cursor-pointer font-semibold">
                          Stack Trace
                        </summary>
                        <pre className="text-xs text-red-800 overflow-x-auto whitespace-pre-wrap bg-white p-2 rounded border mt-1">
                          {err.stack}
                        </pre>
                      </details>
                    )}
                  </div>
                ))
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export const reportCustomError = (message, category, stack = null, context = null) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('customErrorEvent', {
      detail: { message, category, stack, context }
    }));
  }
};
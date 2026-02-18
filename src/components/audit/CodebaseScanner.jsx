import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FileCode, Folder, Zap, Database } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CodebaseScanner({ pages, components, functions, entities, searchTerm }) {
  const filteredPages = pages?.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];
  
  const filteredComponents = components?.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.path.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredFunctions = functions?.filter(f =>
    f.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const filteredEntities = entities?.filter(e =>
    e.name.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const getViolationLevel = (lines) => {
    if (lines > 300) return { color: 'bg-red-600', label: 'CRÍTICO' };
    if (lines > 200) return { color: 'bg-orange-600', label: 'ALTO' };
    if (lines > 100) return { color: 'bg-yellow-600', label: 'MÉDIO' };
    return { color: 'bg-green-600', label: 'OK' };
  };

  return (
    <Tabs defaultValue="pages" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="pages">Pages ({filteredPages.length})</TabsTrigger>
        <TabsTrigger value="components">Components ({filteredComponents.length})</TabsTrigger>
        <TabsTrigger value="functions">Functions ({filteredFunctions.length})</TabsTrigger>
        <TabsTrigger value="entities">Entities ({filteredEntities.length})</TabsTrigger>
      </TabsList>

      <TabsContent value="pages" className="mt-4">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {filteredPages.map((page, i) => {
              const violation = getViolationLevel(page.lines);
              return (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{page.name}</p>
                    <Badge className={violation.color}>{violation.label}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                    <div>Linhas: <span className="font-mono">{page.lines}</span></div>
                    <div>Size: <span className="font-mono">{(page.size / 1024).toFixed(1)}KB</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="components" className="mt-4">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {filteredComponents.map((comp, i) => {
              const violation = getViolationLevel(comp.lines);
              return (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">{comp.name}</p>
                      <p className="text-xs text-[var(--text-tertiary)] truncate">{comp.path}</p>
                    </div>
                    <Badge className={violation.color}>{violation.label}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                    <div>Linhas: <span className="font-mono">{comp.lines}</span></div>
                    <div>Size: <span className="font-mono">{(comp.size / 1024).toFixed(1)}KB</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="functions" className="mt-4">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {filteredFunctions.map((func, i) => {
              const violation = getViolationLevel(func.lines);
              return (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{func.name}</p>
                    <Badge className={violation.color}>{violation.label}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                    <div>Linhas: <span className="font-mono">{func.lines}</span></div>
                    <div>Size: <span className="font-mono">{(func.size / 1024).toFixed(1)}KB</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>

      <TabsContent value="entities" className="mt-4">
        <ScrollArea className="h-[500px]">
          <div className="space-y-2">
            {filteredEntities.map((entity, i) => {
              return (
                <div key={i} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-semibold text-sm">{entity.name}</p>
                    <Badge className="bg-blue-600">SCHEMA</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-xs text-[var(--text-secondary)]">
                    <div>Linhas: <span className="font-mono">{entity.lines}</span></div>
                    <div>Size: <span className="font-mono">{(entity.size / 1024).toFixed(1)}KB</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      </TabsContent>
    </Tabs>
  );
}
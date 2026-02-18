import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuditStats({ data }) {
  if (!data) return null;

  const pagesAbove300 = data.pages?.filter(p => p.lines > 300).length || 0;
  const pagesAbove200 = data.pages?.filter(p => p.lines > 200 && p.lines <= 300).length || 0;
  const componentsAbove200 = data.components?.filter(c => c.lines > 200).length || 0;
  const componentsAbove100 = data.components?.filter(c => c.lines > 100 && c.lines <= 200).length || 0;

  const totalViolations = pagesAbove300 + pagesAbove200 + componentsAbove200 + componentsAbove100;
  const totalFiles = (data.pages?.length || 0) + (data.components?.length || 0);
  const complianceRate = totalFiles > 0 ? ((totalFiles - totalViolations) / totalFiles * 100).toFixed(1) : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-blue-600">Pages</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-blue-700">{data.stats?.totalPages || 0}</p>
          <p className="text-xs text-blue-600 mt-1">~{Math.round(data.stats?.avgLinesPerPage || 0)} linhas</p>
        </CardContent>
      </Card>

      <Card className="border-purple-200 bg-purple-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-purple-600">Components</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-purple-700">{data.stats?.totalComponents || 0}</p>
          <p className="text-xs text-purple-600 mt-1">~{Math.round(data.stats?.avgLinesPerComponent || 0)} linhas</p>
        </CardContent>
      </Card>

      <Card className="border-green-200 bg-green-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-green-600">Functions</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-700">{data.stats?.totalFunctions || 0}</p>
          <p className="text-xs text-green-600 mt-1">~{Math.round(data.stats?.avgLinesPerFunction || 0)} linhas</p>
        </CardContent>
      </Card>

      <Card className="border-orange-200 bg-orange-50">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm text-orange-600">Entities</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-orange-700">{data.stats?.totalEntities || 0}</p>
          <p className="text-xs text-orange-600 mt-1">Schemas</p>
        </CardContent>
      </Card>

      <Card className={`border-2 ${totalViolations > 0 ? 'border-red-300 bg-red-50' : 'border-green-300 bg-green-50'}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`text-sm ${totalViolations > 0 ? 'text-red-600' : 'text-green-600'}`}>
            Violações
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-3xl font-bold ${totalViolations > 0 ? 'text-red-700' : 'text-green-700'}`}>
            {totalViolations}
          </p>
          <p className={`text-xs mt-1 ${totalViolations > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {pagesAbove300 + componentsAbove200} críticas
          </p>
        </CardContent>
      </Card>

      <Card className={`border-2 ${complianceRate >= 95 ? 'border-green-300 bg-green-50' : 'border-yellow-300 bg-yellow-50'}`}>
        <CardHeader className="pb-3">
          <CardTitle className={`text-sm ${complianceRate >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
            Conformidade
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-3xl font-bold ${complianceRate >= 95 ? 'text-green-700' : 'text-yellow-700'}`}>
            {complianceRate}%
          </p>
          <p className={`text-xs mt-1 ${complianceRate >= 95 ? 'text-green-600' : 'text-yellow-600'}`}>
            Meta: ≥ 95%
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
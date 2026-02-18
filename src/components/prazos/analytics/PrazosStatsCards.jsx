import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Clock, CheckCircle, AlertTriangle } from 'lucide-react';

export default function PrazosStatsCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Total
          </CardTitle>
        </CardHeader>
        <CardContent><p className="text-2xl font-bold">{stats.total}</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            Pendentes
          </CardTitle>
        </CardHeader>
        <CardContent><p className="text-2xl font-bold text-amber-600">{stats.pendentes}</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            Cumpridos
          </CardTitle>
        </CardHeader>
        <CardContent><p className="text-2xl font-bold text-green-600">{stats.cumpridos}</p></CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600" />
            Urgentes
          </CardTitle>
        </CardHeader>
        <CardContent><p className="text-2xl font-bold text-red-600">{stats.urgentes}</p></CardContent>
      </Card>
    </div>
  );
}
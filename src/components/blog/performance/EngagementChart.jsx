import React from 'react';
import { Card } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function EngagementChart({ dados }) {
  if (!dados?.length) {
    return (
      <Card className="p-6">
        <h3 className="font-bold text-lg mb-4">Métricas de Engajamento</h3>
        <p className="text-gray-500 text-center py-8">Sem dados de engajamento</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h3 className="font-bold text-lg mb-4">Métricas de Engajamento</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={dados}>
          <XAxis dataKey="artigo" angle={-45} textAnchor="end" height={100} />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="compartilhamentos" fill="var(--brand-primary)" name="Compartilhamentos" />
          <Bar dataKey="comentarios" fill="#6366f1" name="Comentários" />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}
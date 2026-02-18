import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function ReceitasChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
        <XAxis 
          dataKey="categoria" 
          stroke="var(--text-secondary)"
          style={{ fontSize: '12px' }}
        />
        <YAxis 
          stroke="var(--text-secondary)"
          style={{ fontSize: '12px' }}
          tickFormatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
        />
        <Tooltip 
          contentStyle={{
            backgroundColor: 'var(--bg-elevated)',
            border: '1px solid var(--border-primary)',
            borderRadius: '8px',
            color: 'var(--text-primary)'
          }}
          formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`}
        />
        <Legend 
          wrapperStyle={{ color: 'var(--text-primary)' }}
        />
        <Bar 
          dataKey="valor" 
          fill="var(--brand-primary)" 
          radius={[8, 8, 0, 0]}
          name="Receita"
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
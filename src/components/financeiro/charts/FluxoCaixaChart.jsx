import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function FluxoCaixaChart({ data }) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-primary)" />
        <XAxis 
          dataKey="mes" 
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
        <Line 
          type="monotone" 
          dataKey="entradas" 
          stroke="var(--brand-success)" 
          strokeWidth={2}
          name="Entradas"
        />
        <Line 
          type="monotone" 
          dataKey="saidas" 
          stroke="var(--brand-error)" 
          strokeWidth={2}
          name="Saídas"
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
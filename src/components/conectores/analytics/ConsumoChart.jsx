import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function ConsumoChart({ data, darkMode }) {
  return (
    <div className="h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="data" 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={11}
          />
          <YAxis 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={11}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#1e293b' : '#fff',
              border: '1px solid ' + (darkMode ? '#475569' : '#e2e8f0')
            }}
          />
          <Legend />
          <Line type="monotone" dataKey="requisicoes" stroke="#3b82f6" name="Requisições" />
          <Line type="monotone" dataKey="sucesso" stroke="#10b981" name="Sucesso" />
          <Line type="monotone" dataKey="erros" stroke="#ef4444" name="Erros" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
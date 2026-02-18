import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function RequestsPerDayChart({ data, darkMode }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="dia" 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <YAxis 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#1e293b' : '#fff',
              border: '1px solid ' + (darkMode ? '#475569' : '#e2e8f0')
            }}
          />
          <Bar dataKey="sucesso" fill="#10b981" />
          <Bar dataKey="falhas" fill="#ef4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
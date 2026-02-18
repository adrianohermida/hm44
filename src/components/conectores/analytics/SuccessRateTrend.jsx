import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function SuccessRateTrend({ data, darkMode }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <XAxis 
            dataKey="hora" 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <YAxis 
            domain={[0, 100]}
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <Tooltip />
          <Line type="monotone" dataKey="taxa_sucesso" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
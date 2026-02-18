import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function LatencyDistribution({ data, darkMode }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis 
            dataKey="range" 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <YAxis 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <Tooltip />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
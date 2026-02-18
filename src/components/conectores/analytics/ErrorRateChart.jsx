import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function ErrorRateChart({ data, darkMode }) {
  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <XAxis 
            dataKey="hora" 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <YAxis 
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <Tooltip />
          <Area type="monotone" dataKey="taxa_erro" stroke="#ef4444" fill="#ef4444" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
import React from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import moment from 'moment';

export default function HealthHistoryChart({ history, darkMode }) {
  const data = history.slice(0, 24).reverse().map(h => ({
    hora: moment(h.created_date).format('HH:mm'),
    latencia: h.latencia_media_ms || 0,
    sucesso: h.taxa_sucesso || 0
  }));

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
            stroke={darkMode ? '#64748b' : '#94a3b8'}
            fontSize={10}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: darkMode ? '#1e293b' : '#fff',
              border: '1px solid ' + (darkMode ? '#475569' : '#e2e8f0')
            }}
          />
          <Line type="monotone" dataKey="latencia" stroke="#3b82f6" strokeWidth={2} />
          <Line type="monotone" dataKey="sucesso" stroke="#10b981" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
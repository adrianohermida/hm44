import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';
import EndpointCard from '../EndpointCard';

export default function VirtualizedEndpointsList({ endpoints, onEdit, onView }) {
  const itemHeight = 120;
  const containerHeight = Math.min(endpoints.length * itemHeight, 600);

  const Row = ({ index, style }) => {
    const endpoint = endpoints[index];
    return (
      <div style={style} className="px-1">
        <EndpointCard 
          endpoint={endpoint}
          onEdit={onEdit}
          onViewDetails={onView}
        />
      </div>
    );
  };

  if (endpoints.length === 0) return null;

  return (
    <FixedSizeList
      height={containerHeight}
      itemCount={endpoints.length}
      itemSize={itemHeight}
      width="100%"
      className="scrollbar-thin"
    >
      {Row}
    </FixedSizeList>
  );
}
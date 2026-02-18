import React, { useMemo } from 'react';
import { FixedSizeList } from 'react-window';

export default function OptimizedList({ 
  items, 
  renderItem, 
  itemHeight = 100,
  maxHeight = 600 
}) {
  const containerHeight = useMemo(
    () => Math.min(items.length * itemHeight, maxHeight),
    [items.length, itemHeight, maxHeight]
  );

  const Row = ({ index, style }) => (
    <div style={style}>{renderItem(items[index], index)}</div>
  );

  if (items.length === 0) return null;

  return (
    <FixedSizeList
      height={containerHeight}
      itemCount={items.length}
      itemSize={itemHeight}
      width="100%"
      className="scrollbar-thin"
    >
      {Row}
    </FixedSizeList>
  );
}
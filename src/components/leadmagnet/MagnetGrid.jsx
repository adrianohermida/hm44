import React from 'react';
import MagnetCard from './MagnetCard';

export default function MagnetGrid({ magnets, onDownload, onEdit }) {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {magnets.map(magnet => (
        <MagnetCard key={magnet.id} magnet={magnet} onDownload={onDownload} onEdit={onEdit} />
      ))}
    </div>
  );
}
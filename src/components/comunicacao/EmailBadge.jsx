import React from 'react';
import { Mail } from 'lucide-react';

export default function EmailBadge() {
  return (
    <div className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs">
      <Mail className="w-3 h-3" />
      <span>Email</span>
    </div>
  );
}
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

export default function ColumnMapper({ headers, mapping, onMappingChange, entityFields }) {
  return (
    <div className="space-y-2">
      {headers.map((header, i) => (
        <div key={i} className="flex items-center gap-3">
          <Badge variant="outline" className="w-32 truncate">{header}</Badge>
          <Select 
            value={mapping[header] || 'ignorar'} 
            onValueChange={(v) => onMappingChange(header, v)}
          >
            <SelectTrigger className="flex-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ignorar">Ignorar</SelectItem>
              {entityFields.map(f => (
                <SelectItem key={f} value={f}>{f}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}
    </div>
  );
}
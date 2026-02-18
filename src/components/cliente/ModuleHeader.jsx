import React from 'react';
import { ChevronRight } from 'lucide-react';
import Breadcrumb from '@/components/seo/Breadcrumb';
import { Badge } from '@/components/ui/badge';

export default function ModuleHeader({
  title,
  breadcrumbItems,
  statusBadge,
  icon: Icon,
  action
}) {
  const hasAction = !!action || !!statusBadge;

  return (
    <div className="bg-[var(--bg-primary)] border-b border-[var(--border-primary)] p-4 md:p-6">
      <div className="max-w-6xl mx-auto space-y-4">
        {breadcrumbItems && <Breadcrumb items={breadcrumbItems} />}
        
        <div className="flex items-center justify-between gap-4">
          <div className={`flex items-center gap-3 ${hasAction ? 'flex-1' : ''}`}>
            {Icon && <Icon className="w-6 h-6 text-[var(--brand-primary)] flex-shrink-0" />}
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--text-primary)] truncate">
              {title}
            </h1>
          </div>
          
          {hasAction && (
            <div className="flex items-center gap-3 flex-shrink-0">
              {statusBadge && (
                <Badge className="bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] border-[var(--brand-primary)]/20 whitespace-nowrap">
                  {statusBadge}
                </Badge>
              )}
              {action}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
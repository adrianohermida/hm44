import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, MapPin } from "lucide-react";

export default function ProfessionalDetails({ user }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6 space-y-4">
        {user.job_title && (
          <div className="flex items-center gap-3">
            <Briefcase className="w-5 h-5 text-[var(--brand-primary)]" />
            <div>
              <p className="font-semibold text-[var(--brand-text-primary)]">{user.job_title}</p>
              <p className="text-sm text-[var(--brand-text-secondary)]">{user.company || 'Company'}</p>
            </div>
          </div>
        )}
        
        {user.location && (
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-[var(--brand-primary)]" />
            <p className="text-[var(--brand-text-secondary)]">{user.location}</p>
          </div>
        )}

        {user.skills?.length > 0 && (
          <div>
            <p className="text-sm font-medium text-[var(--brand-text-secondary)] mb-2">Skills</p>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill, i) => (
                <Badge key={i} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
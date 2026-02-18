import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Target, Eye, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

export default function ResumeCard({ resume }) {
  return (
    <Card className="group hover:shadow-lg transition-all border-[var(--border-primary)] hover:border-[var(--brand-primary)]">
      <CardHeader className="p-4">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base font-semibold text-[var(--text-primary)] truncate flex-1">
            {resume.title}
          </CardTitle>
          <div className="flex items-center gap-1 bg-[var(--bg-secondary)] px-2 py-1 rounded-lg flex-shrink-0">
            <Target className="w-3 h-3 text-[var(--text-secondary)]" />
            <span className="text-xs font-medium text-[var(--text-primary)]">
              {resume.ats_score || 0}%
            </span>
          </div>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">
          {resume.template} template
        </p>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <div className="bg-[var(--bg-secondary)] rounded-lg p-6 mb-3 flex items-center justify-center">
          <FileText className="w-12 h-12 text-[var(--text-tertiary)]" />
        </div>
        
        <div className="text-xs text-[var(--text-secondary)] mb-3">
          {format(new Date(resume.updated_date), "dd/MM/yyyy")}
        </div>
        
        <div className="flex gap-2">
          <Link to={createPageUrl(`Editor?id=${resume.id}`)} className="flex-1">
            <Button size="sm" variant="outline" className="w-full">
              <Eye className="w-3 h-3 mr-1" />
              Editar
            </Button>
          </Link>
          <Button size="sm" variant="outline">
            <Download className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
import React from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Save, Target, FileDown } from "lucide-react";

export default function EditorHeader({ 
  resume, 
  isSaving, 
  isExporting, 
  onSave, 
  onExport, 
  onCheckScore 
}) {
  return (
    <div className="bg-white/80 backdrop-blur-sm border-b border-green-200/30 p-6">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-[var(--brand-text-primary)]">{resume.title}</h1>
          <div className="flex items-center gap-4 mt-2">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
              {resume.template} template
            </Badge>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-[var(--brand-info)]" />
              <span className="text-sm font-medium text-[var(--brand-text-secondary)]">
                ATS Score: {resume.ats_score || 0}%
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={onCheckScore} className="border-blue-200 hover:bg-blue-50">
            <Target className="w-4 h-4 mr-2" /> Check ATS Score
          </Button>
          <Button variant="outline" onClick={onExport} disabled={isExporting} className="border-purple-200 hover:bg-purple-50">
            {isExporting ? "Exporting..." : <><FileDown className="w-4 h-4 mr-2" />Export PDF</>}
          </Button>
          <Button onClick={onSave} disabled={isSaving} className="bg-gradient-to-r from-green-500 to-emerald-600">
            {isSaving ? "Saving..." : <><Save className="w-4 h-4 mr-2" />Save Resume</>}
          </Button>
        </div>
      </div>
    </div>
  );
}
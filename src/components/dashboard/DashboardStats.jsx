import React from "react";
import StatCard from "./StatCard";
import TeamEventsLoader from "@/components/calendar/TeamEventsLoader";
import { FileText, Target, Sparkles } from "lucide-react";

export default function DashboardStats({ resumes }) {
  const totalResumes = resumes.length;
  const avgScore = totalResumes > 0 
    ? Math.round(resumes.reduce((sum, r) => sum + (r.ats_score || 0), 0) / totalResumes)
    : 0;
  const totalDocs = resumes.reduce((sum, r) => sum + (r.experience?.length || 0), 0);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <StatCard
        label="Total Processos"
        value={totalResumes}
        icon={FileText}
        bgColor="bg-[var(--brand-primary-50)]"
        iconColor="text-[var(--brand-primary)]"
      />
      <StatCard
        label="Taxa Sucesso"
        value={`${avgScore}%`}
        icon={Target}
        bgColor="bg-[var(--bg-secondary)]"
        iconColor="text-[var(--text-secondary)]"
      />
      <StatCard
        label="Documentos"
        value={totalDocs}
        icon={Sparkles}
        bgColor="bg-[var(--bg-secondary)]"
        iconColor="text-[var(--text-secondary)]"
      />
      <div className="hidden lg:block">
        <TeamEventsLoader />
      </div>
    </div>
  );
}
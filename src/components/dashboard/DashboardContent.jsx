import React from "react";
import ResumeCard from "./ResumeCard";
import EmptyState from "./EmptyState";
import LoadingSkeleton from "./LoadingSkeleton";

export default function DashboardContent({ resumes, isLoading, onCreateResume }) {
  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (resumes.length === 0) {
    return <EmptyState onCreateResume={onCreateResume} />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {resumes.map((resume) => (
        <ResumeCard key={resume.id} resume={resume} />
      ))}
    </div>
  );
}
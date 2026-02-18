import React, { useState, useEffect } from "react";
import { Resume, JobApplication } from "@/entities/all";
import { TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ResumeLoader from "@/components/common/ResumeLoader";
import KeyMetrics from "@/components/analytics/KeyMetrics";
import ResumeScoresChart from "@/components/analytics/ResumeScoresChart";
import ApplicationStatusChart from "@/components/analytics/ApplicationStatusChart";
import ApplicationTrendChart from "@/components/analytics/ApplicationTrendChart";
import ResumePerformanceTable from "@/components/analytics/ResumePerformanceTable";

export default function Analytics() {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [resumeData, applicationData] = await Promise.all([
        Resume.list("-updated_date"),
        JobApplication.list("-application_date")
      ]);
      setResumes(resumeData);
      setApplications(applicationData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const getApplicationStatusData = () => {
    const statusCounts = applications.reduce((acc, app) => {
      acc[app.status] = (acc[app.status] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(statusCounts).map(([status, count]) => ({
      name: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));
  };

  const getResumeScoreData = () => {
    return resumes.map((resume, index) => ({
      name: resume.title,
      score: resume.ats_score || 0,
      index
    }));
  };

  const getApplicationTrendData = () => {
    const last6Months = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      
      const count = applications.filter(app => {
        const appDate = new Date(app.application_date);
        return appDate.getMonth() === date.getMonth() && 
               appDate.getFullYear() === date.getFullYear();
      }).length;

      last6Months.push({
        month: monthYear,
        applications: count
      });
    }
    return last6Months;
  };

  const avgATSScore = resumes.length > 0 ? 
    Math.round(resumes.reduce((sum, r) => sum + (r.ats_score || 0), 0) / resumes.length) : 0;

  const successRate = applications.length > 0 ? 
    Math.round((applications.filter(app => ['interview', 'offer'].includes(app.status)).length / applications.length) * 100) : 0;

  if (isLoading) {
    return <ResumeLoader />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-8 h-8 text-[var(--brand-info)]" />
          <h1 className="text-3xl font-bold text-[var(--brand-text-primary)]">Career Analytics</h1>
        </div>
        <p className="text-[var(--brand-text-secondary)] text-lg">
          Track your job search progress and optimize your resume performance.
        </p>
      </motion.div>

      <KeyMetrics resumes={resumes} applications={applications} avgScore={avgATSScore} successRate={successRate} />
      
      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <ResumeScoresChart data={getResumeScoreData()} />
        <ApplicationStatusChart data={getApplicationStatusData()} />
      </div>

      <ApplicationTrendChart data={getApplicationTrendData()} />
      <ResumePerformanceTable resumes={resumes} />
    </div>
  );
}
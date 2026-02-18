import React, { useState, useEffect } from "react";
import { Job } from "@/entities/Job";
import { Resume, JobApplication } from "@/entities/all";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Briefcase, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import ResumeLoader from "@/components/common/ResumeLoader";
import JobFilters from "@/components/jobs/JobFilters";
import JobListItem from "@/components/jobs/JobListItem";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [locationFilter, setLocationFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [levelFilter, setLevelFilter] = useState("all");
  const [showTrendingOnly, setShowTrendingOnly] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [jobData, resumeData] = await Promise.all([
        Job.list("-posted_date"),
        Resume.list("-updated_date")
      ]);
      setJobs(jobData);
      setResumes(resumeData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const applyToJob = async (job) => {
    try {
      if (resumes.length === 0) {
        alert("Please create a resume first before applying to jobs!");
        return;
      }

      // Use the most recently updated resume
      const latestResume = resumes[0];
      
      await JobApplication.create({
        job_title: job.title,
        company_name: job.company,
        application_date: new Date().toISOString().split('T')[0],
        status: "applied",
        resume_used: latestResume.id,
        notes: `Applied through ResumeAI job board`
      });

      alert(`Successfully applied to ${job.title} at ${job.company}!`);
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Error applying to job. Please try again.");
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = locationFilter === "all" || job.location.toLowerCase().includes(locationFilter);
    const matchesType = typeFilter === "all" || job.type === typeFilter;
    const matchesLevel = levelFilter === "all" || job.experience_level === levelFilter;
    const matchesTrending = !showTrendingOnly || job.is_trending;

    return matchesSearch && matchesLocation && matchesType && matchesLevel && matchesTrending;
  });

  const getExperienceLevelColor = (level) => {
    const colors = {
      entry: "bg-green-100 text-green-800",
      mid: "bg-blue-100 text-blue-800", 
      senior: "bg-purple-100 text-purple-800",
      executive: "bg-red-100 text-red-800"
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  const getTypeColor = (type) => {
    const colors = {
      "full-time": "bg-green-100 text-green-800",
      "part-time": "bg-yellow-100 text-yellow-800",
      "contract": "bg-orange-100 text-orange-800",
      "remote": "bg-purple-100 text-purple-800"
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  if (isLoading) {
    return <ResumeLoader />;
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Briefcase className="w-8 h-8 text-[var(--brand-info)]" />
          <h1 className="text-3xl font-bold text-[var(--brand-text-primary)]">Job Opportunities</h1>
          <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white">
            <TrendingUp className="w-4 h-4 mr-1" /> Trending
          </Badge>
        </div>
        <p className="text-[var(--brand-text-secondary)] text-lg">
          Discover exciting career opportunities and apply directly with your AI-optimized resume.
        </p>
      </motion.div>

      <JobFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        locationFilter={locationFilter}
        onLocationChange={setLocationFilter}
        typeFilter={typeFilter}
        onTypeChange={setTypeFilter}
        levelFilter={levelFilter}
        onLevelChange={setLevelFilter}
        showTrendingOnly={showTrendingOnly}
        onTrendingToggle={() => setShowTrendingOnly(!showTrendingOnly)}
        resultCount={filteredJobs.length}
      />

      <div className="space-y-6">
        {filteredJobs.length === 0 ? (
          <Card className="text-center py-16">
            <CardContent>
              <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job, index) => (
            <JobListItem
              key={job.id}
              job={job}
              index={index}
              onApply={applyToJob}
              getTypeColor={getTypeColor}
              getExperienceLevelColor={getExperienceLevelColor}
            />
          ))
        )}
      </div>
    </div>
  );
}
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Job } from "@/entities/Job";
import { Resume, JobApplication } from "@/entities/all";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Briefcase, MapPin, Calendar, Building, ArrowLeft, Bookmark, Send } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { createPageUrl } from "@/utils";
import ResumeLoader from "@/components/common/ResumeLoader";
import JobContentDetail from "@/components/jobs/JobContentDetail";

export default function JobDetails() {
  const [job, setJob] = useState(null);
  const [resumes, setResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const jobId = searchParams.get("id");
    if (jobId) {
      loadJobDetails(jobId);
    }
  }, [location.search]);

  const loadJobDetails = async (jobId) => {
    setIsLoading(true);
    try {
      const [jobData, resumeData] = await Promise.all([
        Job.get(jobId),
        Resume.list("-updated_date"),
      ]);
      setJob(jobData);
      setResumes(resumeData);
    } catch (error) {
      console.error("Error loading job details:", error);
    }
    setIsLoading(false);
  };
  
  const applyToJob = async (job) => {
    try {
      if (resumes.length === 0) {
        alert("Please create a resume first before applying to jobs!");
        return;
      }
      const latestResume = resumes[0];
      await JobApplication.create({
        job_title: job.title,
        company_name: job.company,
        application_date: new Date().toISOString().split('T')[0],
        status: "applied",
        resume_used: latestResume.id,
        notes: `Applied to ${job.title} from Job Details page.`
      });
      alert(`Successfully applied to ${job.title} at ${job.company}!`);
    } catch (error) {
      console.error("Error applying to job:", error);
      alert("Error applying to job. Please try again.");
    }
  };

  if (isLoading) {
    return <ResumeLoader />;
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="text-center py-16">
          <CardContent>
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">Job not found</h3>
            <p className="text-gray-500 mb-4">The job you are looking for does not exist or has been removed.</p>
            <Button asChild>
              <Link to={createPageUrl("Jobs")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Job Board
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Button asChild variant="ghost" className="mb-6">
          <Link to={createPageUrl("Jobs")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Job Board
          </Link>
        </Button>
        
        <Card className="bg-white/80 backdrop-blur-sm border border-gray-200">
          <CardHeader className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 p-6">
            <div className="flex items-start gap-4">
              {job.company_logo && (
                <img 
                  src={job.company_logo} 
                  alt={`${job.company} logo`}
                  className="w-16 h-16 rounded-lg object-contain border p-1"
                />
              )}
              <div>
                <CardTitle className="text-2xl font-bold text-gray-900 mb-2">{job.title}</CardTitle>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-gray-600">
                  <div className="flex items-center gap-1.5"><Building className="w-4 h-4" /> {job.company}</div>
                  <div className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {job.location}</div>
                  <div className="flex items-center gap-1.5"><Calendar className="w-4 h-4" /> Posted {format(new Date(job.posted_date), 'MMM d, yyyy')}</div>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <Button variant="outline"><Bookmark className="w-4 h-4 mr-2" /> Save</Button>
              <Button onClick={() => applyToJob(job)} className="bg-gradient-to-r from-green-500 to-emerald-600"><Send className="w-4 h-4 mr-2" /> Quick Apply</Button>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <div className="bg-green-50 p-4 rounded-lg text-center">
                <p className="text-sm text-green-700 font-medium">Salary Range</p>
                <p className="text-lg font-bold text-green-900">
                  {job.salary_min && job.salary_max ? `$${job.salary_min.toLocaleString()} - $${job.salary_max.toLocaleString()}` : 'Not Disclosed'}
                </p>
              </div>
              <div className="bg-blue-50 p-4 rounded-lg text-center">
                <p className="text-sm text-blue-700 font-medium">Experience Level</p>
                <p className="text-lg font-bold text-blue-900 capitalize">{job.experience_level}</p>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg text-center">
                <p className="text-sm text-purple-700 font-medium">Job Type</p>
                <p className="text-lg font-bold text-purple-900 capitalize">{job.type.replace('-', ' ')}</p>
              </div>
            </div>

            <JobContentDetail job={job} />
            
            {job.application_deadline && (
              <div className="mt-8 text-center text-sm text-gray-500">
                Application Deadline: {format(new Date(job.application_deadline), 'MMM d, yyyy')}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
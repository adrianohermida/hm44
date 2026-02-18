import React, { useState } from "react";
import { Resume } from "@/entities/Resume";
import { base44 } from "@/api/base44Client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Target } from "lucide-react";
import { motion } from "framer-motion";
import MatcherForm from "@/components/jobs/MatcherForm";
import AnalysisResults from "@/components/jobs/AnalysisResults";

export default function JobMatcher() {
  const [resumes, setResumes] = useState([]);
  const [selectedResume, setSelectedResume] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [matchResult, setMatchResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  React.useEffect(() => {
    loadResumes();
  }, []);

  const loadResumes = async () => {
    try {
      const data = await Resume.list("-updated_date");
      setResumes(data);
    } catch (error) {
      console.error("Error loading resumes:", error);
    }
  };

  const analyzeJobMatch = async () => {
    if (!selectedResume || !jobDescription.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const resume = resumes.find(r => r.id === selectedResume);
      
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze the match between this resume and job description. Provide a comprehensive analysis with:

        RESUME:
        Name: ${resume.personal_info?.full_name}
        Summary: ${resume.personal_info?.summary}
        Skills: ${resume.skills?.join(', ')}
        Experience: ${resume.experience?.map(exp => `${exp.title} at ${exp.company}: ${exp.bullets?.join('; ')}`).join(' | ')}
        
        JOB DESCRIPTION:
        ${jobDescription}
        
        Provide:
        1. Overall match percentage (0-100)
        2. Missing skills that are required
        3. Skills that match well
        4. Experience relevance score
        5. Specific suggestions to improve the match
        6. Keywords to add to resume
        7. Sections that need strengthening`,
        response_json_schema: {
          type: "object",
          properties: {
            match_percentage: { type: "number", minimum: 0, maximum: 100 },
            missing_skills: { type: "array", items: { type: "string" } },
            matching_skills: { type: "array", items: { type: "string" } },
            experience_relevance: { type: "number", minimum: 0, maximum: 100 },
            suggestions: { type: "array", items: { type: "string" } },
            keywords_to_add: { type: "array", items: { type: "string" } },
            weak_sections: { type: "array", items: { type: "string" } },
            strong_points: { type: "array", items: { type: "string" } }
          }
        }
      });

      setMatchResult(response);
    } catch (error) {
      console.error("Error analyzing job match:", error);
    }
    setIsAnalyzing(false);
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <Target className="w-8 h-8 text-purple-600" />
          <h1 className="text-3xl font-bold text-[var(--brand-text-primary)]">Job Matcher</h1>
        </div>
        <p className="text-[var(--brand-text-secondary)] text-lg">
          Analyze how well your resume matches specific job descriptions and get personalized improvement suggestions.
        </p>
      </motion.div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <MatcherForm
            resumes={resumes}
            selectedResume={selectedResume}
            onResumeChange={setSelectedResume}
            jobDescription={jobDescription}
            onDescriptionChange={setJobDescription}
            onAnalyze={analyzeJobMatch}
            isAnalyzing={isAnalyzing}
          />
        </div>

        <div className="space-y-6">
          <AnalysisResults result={matchResult} />
        </div>
      </div>

      {matchResult && (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8 grid md:grid-cols-2 gap-6">
          <Card className="bg-white/80 backdrop-blur-sm">
            <CardContent className="p-6 space-y-4">
              {matchResult.matching_skills?.length > 0 && (
                <div>
                  <h4 className="font-medium text-green-700 mb-2">Matching Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {matchResult.matching_skills.map((skill, i) => (
                      <Badge key={i} className="bg-green-100 text-green-800">{skill}</Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
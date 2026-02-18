import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Upload, Sparkles } from "lucide-react";

export default function MatcherForm({ 
  resumes, 
  selectedResume, 
  onResumeChange, 
  jobDescription, 
  onDescriptionChange, 
  onAnalyze, 
  isAnalyzing 
}) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-purple-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Upload className="w-5 h-5" />
          Job Analysis Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Resume</label>
          <Select value={selectedResume} onValueChange={onResumeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a resume to analyze" />
            </SelectTrigger>
            <SelectContent>
              {resumes.map((resume) => (
                <SelectItem key={resume.id} value={resume.id}>
                  {resume.title} ({resume.template})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Description</label>
          <Textarea
            value={jobDescription}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Paste the complete job description here..."
            rows={12}
            className="resize-none"
          />
        </div>

        <Button
          onClick={onAnalyze}
          disabled={isAnalyzing || !selectedResume || !jobDescription.trim()}
          size="lg"
          className="w-full bg-gradient-to-r from-purple-500 to-pink-500"
        >
          {isAnalyzing ? "Analyzing..." : <><Sparkles className="w-5 h-5 mr-2" />Analyze Job Match</>}
        </Button>
      </CardContent>
    </Card>
  );
}
import React, { useState, useEffect, useCallback } from "react";
import { Resume } from "@/entities/Resume";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import ResumeLoader from "@/components/common/ResumeLoader";
import EditorHeader from "@/components/editor/EditorHeader";
import SectionTabs from "@/components/editor/SectionTabs";
import ResumePreview from "@/components/editor/ResumePreview";
import AIAssistant from "@/components/editor/AIAssistant";

export default function Editor() {
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeSection, setActiveSection] = useState("personal");
  
  const urlParams = new URLSearchParams(window.location.search);
  const resumeId = urlParams.get('id');

  const loadResume = useCallback(async () => {
    setIsLoading(true);
    try {
      // Direct fetch by ID is more efficient if the SDK supports it.
      // Assuming it doesn't, filtering from a list is the alternative.
      const data = await Resume.list();
      const resumeData = data.find(r => r.id === resumeId);
      if (resumeData) {
        setResume(resumeData);
      } else {
        console.error("Resume not found for ID:", resumeId);
      }
    } catch (error) {
      console.error("Error loading resume:", error);
    }
    setIsLoading(false);
  }, [resumeId]); // `resumeId` is a dependency here.

  useEffect(() => {
    if (resumeId) {
      loadResume();
    }
  }, [resumeId, loadResume]); // `loadResume` is now a dependency here.

  const saveResume = async () => {
    if (!resume || !resumeId) return;
    
    setIsSaving(true);
    try {
      await Resume.update(resumeId, resume);
    } catch (error) {
      console.error("Error saving resume:", error);
    }
    setIsSaving(false);
  };

  const exportResume = async () => {
    if (!resume) return;
    
    setIsExporting(true);
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Create a professional resume in HTML format that can be converted to PDF. Use this data:

        Personal Info: ${JSON.stringify(resume.personal_info)}
        Experience: ${JSON.stringify(resume.experience)}
        Education: ${JSON.stringify(resume.education)}
        Skills: ${JSON.stringify(resume.skills)}
        Projects: ${JSON.stringify(resume.projects)}
        Template: ${resume.template}

        Create a clean, professional HTML structure with inline CSS that's optimized for PDF conversion. Include all sections and make it ATS-friendly.`,
        response_json_schema: {
          type: "object",
          properties: {
            html: { type: "string" }
          }
        }
      });

      if (response.html) {
        // Create a new window and print
        const printWindow = window.open('', '_blank');
        printWindow.document.write(response.html);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
      }
      
      // Update last exported timestamp
      const updatedResume = { ...resume, last_exported: new Date().toISOString() };
      setResume(updatedResume);
      await Resume.update(resumeId, updatedResume);
      
    } catch (error) {
      console.error("Error exporting resume:", error);
    }
    setIsExporting(false);
  };

  const updateResume = (section, data) => {
    setResume(prev => ({
      ...prev,
      [section]: data
    }));
  };

  const calculateATSScore = async () => {
    if (!resume) return;
    
    try {
      const response = await base44.integrations.Core.InvokeLLM({
        prompt: `Analyze this resume for ATS optimization and provide a score out of 100. Consider: contact information completeness, relevant keywords, quantified achievements, proper formatting, and section organization. 

Resume data: ${JSON.stringify(resume)}

Provide only a numeric score between 0-100.`,
        response_json_schema: {
          type: "object",
          properties: {
            score: { type: "number", minimum: 0, maximum: 100 }
          }
        }
      });
      
      const newScore = response.score || 0;
      const updatedResume = { ...resume, ats_score: newScore };
      setResume(updatedResume);
      
      if (resumeId) {
        await Resume.update(resumeId, updatedResume);
      }
    } catch (error) {
      console.error("Error calculating ATS score:", error);
    }
  };

  if (isLoading) {
    return <ResumeLoader />;
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Resume not found</p>
          <Button onClick={() => window.history.back()}>Go Back</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-green-50">
      <EditorHeader
        resume={resume}
        isSaving={isSaving}
        isExporting={isExporting}
        onSave={saveResume}
        onExport={exportResume}
        onCheckScore={calculateATSScore}
      />

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <SectionTabs
            activeSection={activeSection}
            onChange={setActiveSection}
            resume={resume}
            onUpdateSection={updateResume}
          />
        </div>

        <div className="space-y-6">
          <ResumePreview resume={resume} />
          <AIAssistant resume={resume} onUpdateResume={setResume} />
        </div>
      </div>
    </div>
  );
}
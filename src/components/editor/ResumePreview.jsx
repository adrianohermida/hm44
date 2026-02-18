import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, FileText, Briefcase, GraduationCap, Zap, Code } from "lucide-react";

export default function ResumePreview({ resume }) {
  const personalInfo = resume.personal_info || {};
  const experience = resume.experience || [];
  const education = resume.education || [];
  const skills = resume.skills || [];
  const projects = resume.projects || [];

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Eye className="w-5 h-5" />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96 overflow-y-auto p-4 bg-white rounded-lg shadow-inner border border-gray-200 font-sans">
          <div className="text-center mb-4 border-b pb-2">
            <h2 className="text-xl font-bold text-gray-800">{personalInfo.full_name || "John Doe"}</h2>
            <p className="text-xs text-gray-500">
              {personalInfo.email || "email@example.com"}
              {personalInfo.phone && ` | ${personalInfo.phone}`}
              {personalInfo.location && ` | ${personalInfo.location}`}
            </p>
          </div>
          
          {personalInfo.summary && (
            <div className="mb-3">
              <p className="text-xs text-gray-700">{personalInfo.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-bold text-gray-700 border-b mb-1 flex items-center gap-2"><Briefcase className="w-3 h-3"/> Experience</h3>
              {experience.map((exp, i) => (
                <div key={i} className="mb-2">
                  <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-gray-800">{exp.title}</p>
                    <p className="text-xs text-gray-500">{exp.start_date} - {exp.current ? 'Present' : exp.end_date}</p>
                  </div>
                  <p className="text-xs text-gray-600">{exp.company}</p>
                  <ul className="list-disc list-inside mt-1">
                    {exp.bullets?.map((bullet, bi) => (
                      <li key={bi} className="text-xs text-gray-700">{bullet}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}

          {education.length > 0 && (
             <div className="mb-3">
              <h3 className="text-sm font-bold text-gray-700 border-b mb-1 flex items-center gap-2"><GraduationCap className="w-3 h-3"/> Education</h3>
              {education.map((edu, i) => (
                <div key={i} className="mb-1">
                   <div className="flex justify-between items-baseline">
                    <p className="text-xs font-semibold text-gray-800">{edu.degree}</p>
                    <p className="text-xs text-gray-500">{edu.graduation_year}</p>
                  </div>
                  <p className="text-xs text-gray-600">{edu.institution}</p>
                </div>
              ))}
            </div>
          )}

          {skills.length > 0 && (
            <div className="mb-3">
              <h3 className="text-sm font-bold text-gray-700 border-b mb-1 flex items-center gap-2"><Zap className="w-3 h-3"/> Skills</h3>
              <p className="text-xs text-gray-700">{skills.join(', ')}</p>
            </div>
          )}
          
          {projects.length > 0 && (
            <div>
              <h3 className="text-sm font-bold text-gray-700 border-b mb-1 flex items-center gap-2"><Code className="w-3 h-3"/> Projects</h3>
              {projects.map((proj, i) => (
                <div key={i} className="mb-1">
                  <p className="text-xs font-semibold text-gray-800">{proj.name}</p>
                  <p className="text-xs text-gray-700">{proj.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
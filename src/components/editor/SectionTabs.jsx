import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PersonalSection from "./PersonalSection";
import ExperienceSection from "./ExperienceSection";
import EducationSection from "./EducationSection";
import SkillsSection from "./SkillsSection";
import ProjectsSection from "./ProjectsSection";

export default function SectionTabs({ activeSection, onChange, resume, onUpdateSection }) {
  return (
    <Tabs value={activeSection} onValueChange={onChange} className="w-full">
      <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
      </TabsList>
      
      <TabsContent value="personal">
        <PersonalSection data={resume.personal_info || {}} onChange={(data) => onUpdateSection('personal_info', data)} />
      </TabsContent>
      
      <TabsContent value="experience">
        <ExperienceSection data={resume.experience || []} onChange={(data) => onUpdateSection('experience', data)} />
      </TabsContent>
      
      <TabsContent value="education">
        <EducationSection data={resume.education || []} onChange={(data) => onUpdateSection('education', data)} />
      </TabsContent>
      
      <TabsContent value="skills">
        <SkillsSection data={resume.skills || []} onChange={(data) => onUpdateSection('skills', data)} />
      </TabsContent>
      
      <TabsContent value="projects">
        <ProjectsSection data={resume.projects || []} onChange={(data) => onUpdateSection('projects', data)} />
      </TabsContent>
    </Tabs>
  );
}
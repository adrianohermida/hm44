import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Code, Plus, X } from "lucide-react";
import { useState } from "react";

export default function ProjectsSection({ data, onChange }) {
  const addProject = () => {
    const newProject = {
      name: "",
      description: "",
      technologies: [],
      link: ""
    };
    onChange([...data, newProject]);
  };

  const removeProject = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateProject = (index, field, value) => {
    const updated = data.map((project, i) => 
      i === index ? { ...project, [field]: value } : project
    );
    onChange(updated);
  };

  const addTechnology = (projectIndex, tech) => {
    if (tech.trim() && !data[projectIndex].technologies.includes(tech.trim())) {
      const updated = data.map((project, i) => 
        i === projectIndex 
          ? { ...project, technologies: [...project.technologies, tech.trim()] }
          : project
      );
      onChange(updated);
    }
  };

  const removeTechnology = (projectIndex, techToRemove) => {
    const updated = data.map((project, i) => 
      i === projectIndex 
        ? { ...project, technologies: project.technologies.filter(tech => tech !== techToRemove) }
        : project
    );
    onChange(updated);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <Code className="w-5 h-5" />
            Projects
          </CardTitle>
          <Button onClick={addProject} size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Project
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Code className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No projects added yet. Showcase your best work and side projects.</p>
          </div>
        ) : (
          data.map((project, index) => (
            <ProjectCard
              key={index}
              project={project}
              index={index}
              updateProject={updateProject}
              removeProject={removeProject}
              addTechnology={addTechnology}
              removeTechnology={removeTechnology}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
}

function ProjectCard({ 
  project, 
  index, 
  updateProject, 
  removeProject, 
  addTechnology, 
  removeTechnology 
}) {
  const [newTech, setNewTech] = useState("");

  const handleAddTech = () => {
    if (newTech.trim()) {
      addTechnology(index, newTech);
      setNewTech("");
    }
  };

  const handleTechKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleAddTech();
    }
  };

  return (
    <div className="border border-gray-200 rounded-lg p-4 space-y-4">
      <div className="flex justify-between items-start">
        <h3 className="font-semibold text-gray-900">Project {index + 1}</h3>
        <Button 
          onClick={() => removeProject(index)} 
          size="sm" 
          variant="ghost"
          className="text-red-500 hover:bg-red-50"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label>Project Name</Label>
          <Input
            value={project.name || ""}
            onChange={(e) => updateProject(index, 'name', e.target.value)}
            placeholder="E-commerce Platform"
          />
        </div>
        <div>
          <Label>Link (Optional)</Label>
          <Input
            value={project.link || ""}
            onChange={(e) => updateProject(index, 'link', e.target.value)}
            placeholder="https://github.com/username/project"
          />
        </div>
      </div>
      
      <div>
        <Label>Description</Label>
        <Textarea
          value={project.description || ""}
          onChange={(e) => updateProject(index, 'description', e.target.value)}
          placeholder="Brief description of the project, key features, and your role..."
          rows={3}
        />
      </div>
      
      <div>
        <Label>Technologies Used</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={newTech}
            onChange={(e) => setNewTech(e.target.value)}
            onKeyPress={handleTechKeyPress}
            placeholder="Add technology"
            className="flex-1"
          />
          <Button onClick={handleAddTech} size="icon" variant="outline" className="border-green-200 hover:bg-green-50">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(project.technologies || []).map((tech, techIndex) => (
            <Badge 
              key={techIndex} 
              variant="secondary" 
              className="bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
            >
              {tech}
              <button
                onClick={() => removeTechnology(index, tech)}
                className="ml-2 hover:text-red-600 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
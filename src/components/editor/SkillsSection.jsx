import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Zap, Plus, X } from "lucide-react";

export default function SkillsSection({ data, onChange }) {
  const [newSkill, setNewSkill] = useState("");

  const addSkill = () => {
    if (newSkill.trim() && !data.includes(newSkill.trim())) {
      onChange([...data, newSkill.trim()]);
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    onChange(data.filter(skill => skill !== skillToRemove));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addSkill();
    }
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Zap className="w-5 h-5" />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex gap-2">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Add a skill (e.g., React, Python, Project Management)"
            className="flex-1"
          />
          <Button onClick={addSkill} size="icon" variant="outline" className="border-green-200 hover:bg-green-50">
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Zap className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No skills added yet. Add your technical and professional skills.</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {data.map((skill, index) => (
              <Badge 
                key={index} 
                variant="secondary" 
                className="bg-green-100 text-green-800 hover:bg-green-200 transition-colors group"
              >
                {skill}
                <button
                  onClick={() => removeSkill(skill)}
                  className="ml-2 hover:text-red-600 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
        )}
        
        <div className="text-sm text-gray-500 mt-4">
          <p className="font-medium mb-2">Popular Skills:</p>
          <div className="flex flex-wrap gap-1">
            {["JavaScript", "React", "Python", "Node.js", "AWS", "SQL", "Git", "Figma"].map((skill) => (
              <button
                key={skill}
                onClick={() => {
                  if (!data.includes(skill)) {
                    onChange([...data, skill]);
                  }
                }}
                className="text-xs px-2 py-1 bg-gray-100 hover:bg-green-50 rounded text-gray-600 hover:text-green-700 transition-colors"
                disabled={data.includes(skill)}
              >
                + {skill}
              </button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
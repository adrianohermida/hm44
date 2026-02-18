import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { GraduationCap, Plus, X } from "lucide-react";

export default function EducationSection({ data, onChange }) {
  const addEducation = () => {
    const newEducation = {
      degree: "",
      institution: "",
      location: "",
      graduation_year: "",
      gpa: ""
    };
    onChange([...data, newEducation]);
  };

  const removeEducation = (index) => {
    onChange(data.filter((_, i) => i !== index));
  };

  const updateEducation = (index, field, value) => {
    const updated = data.map((edu, i) => 
      i === index ? { ...edu, [field]: value } : edu
    );
    onChange(updated);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border border-green-200/30">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2 text-gray-900">
            <GraduationCap className="w-5 h-5" />
            Education
          </CardTitle>
          <Button onClick={addEducation} size="sm" variant="outline" className="border-green-200 hover:bg-green-50">
            <Plus className="w-4 h-4 mr-2" />
            Add Education
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <GraduationCap className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p>No education added yet. Click "Add Education" to get started.</p>
          </div>
        ) : (
          data.map((education, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-gray-900">Education {index + 1}</h3>
                <Button 
                  onClick={() => removeEducation(index)} 
                  size="sm" 
                  variant="ghost"
                  className="text-red-500 hover:bg-red-50"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label>Degree</Label>
                  <Input
                    value={education.degree || ""}
                    onChange={(e) => updateEducation(index, 'degree', e.target.value)}
                    placeholder="Bachelor of Science in Computer Science"
                  />
                </div>
                <div>
                  <Label>Institution</Label>
                  <Input
                    value={education.institution || ""}
                    onChange={(e) => updateEducation(index, 'institution', e.target.value)}
                    placeholder="University of California"
                  />
                </div>
              </div>
              
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <Label>Location</Label>
                  <Input
                    value={education.location || ""}
                    onChange={(e) => updateEducation(index, 'location', e.target.value)}
                    placeholder="Berkeley, CA"
                  />
                </div>
                <div>
                  <Label>Graduation Year</Label>
                  <Input
                    value={education.graduation_year || ""}
                    onChange={(e) => updateEducation(index, 'graduation_year', e.target.value)}
                    placeholder="2023"
                  />
                </div>
                <div>
                  <Label>GPA (Optional)</Label>
                  <Input
                    value={education.gpa || ""}
                    onChange={(e) => updateEducation(index, 'gpa', e.target.value)}
                    placeholder="3.8/4.0"
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
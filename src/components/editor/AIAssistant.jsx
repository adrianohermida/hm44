import React, { useState } from "react";
import { InvokeLLM } from "@/integrations/Core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Wand2, Target, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export default function AIAssistant({ resume, onUpdateResume }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [jobDescription, setJobDescription] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const generateBulletPoints = async (experience, index) => {
    setIsGenerating(true);
    try {
      const response = await InvokeLLM({
        prompt: `Generate 3-4 professional, quantified bullet points for this work experience:
        
        Job Title: ${experience.title}
        Company: ${experience.company}
        Current bullets: ${experience.bullets?.join(', ')}
        
        Create bullet points that:
        - Start with strong action verbs
        - Include specific metrics and numbers where possible
        - Highlight achievements and impact
        - Are ATS-friendly and keyword-rich
        - Are concise (under 25 words each)
        
        Return only the bullet points as an array.`,
        response_json_schema: {
          type: "object",
          properties: {
            bullets: {
              type: "array",
              items: { type: "string" }
            }
          }
        }
      });

      if (response.bullets) {
        const updatedExperience = [...resume.experience];
        updatedExperience[index] = {
          ...updatedExperience[index],
          bullets: response.bullets
        };
        
        onUpdateResume({
          ...resume,
          experience: updatedExperience
        });
      }
    } catch (error) {
      console.error("Error generating bullet points:", error);
    }
    setIsGenerating(false);
  };

  const optimizeForJob = async () => {
    if (!jobDescription.trim()) return;
    
    setIsGenerating(true);
    try {
      const response = await InvokeLLM({
        prompt: `Analyze this job description and current resume, then provide optimization suggestions:

        Job Description:
        ${jobDescription}
        
        Current Resume:
        Name: ${resume.personal_info?.full_name}
        Summary: ${resume.personal_info?.summary}
        Skills: ${resume.skills?.join(', ')}
        Experience: ${resume.experience?.map(exp => `${exp.title} at ${exp.company}`).join(', ')}
        
        Provide:
        1. Missing keywords that should be added
        2. Skills to emphasize
        3. Suggested summary improvements
        4. ATS optimization tips`,
        response_json_schema: {
          type: "object",
          properties: {
            missing_keywords: { type: "array", items: { type: "string" } },
            skills_to_emphasize: { type: "array", items: { type: "string" } },
            summary_suggestion: { type: "string" },
            optimization_tips: { type: "array", items: { type: "string" } }
          }
        }
      });

      setSuggestions([
        {
          type: "keywords",
          title: "Missing Keywords",
          items: response.missing_keywords || [],
          icon: Target
        },
        {
          type: "skills",
          title: "Skills to Emphasize", 
          items: response.skills_to_emphasize || [],
          icon: Sparkles
        },
        {
          type: "tips",
          title: "Optimization Tips",
          items: response.optimization_tips || [],
          icon: Lightbulb
        }
      ]);

      if (response.summary_suggestion) {
        onUpdateResume({
          ...resume,
          personal_info: {
            ...resume.personal_info,
            summary: response.summary_suggestion
          }
        });
      }
    } catch (error) {
      console.error("Error optimizing for job:", error);
    }
    setIsGenerating(false);
  };

  const addSkillsToResume = (skills) => {
    const existingSkills = resume.skills || [];
    const newSkills = skills.filter(skill => !existingSkills.includes(skill));
    
    onUpdateResume({
      ...resume,
      skills: [...existingSkills, ...newSkills]
    });
  };

  return (
    <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-gray-900">
          <Sparkles className="w-5 h-5 text-purple-600" />
          AI Assistant
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Job Description Input */}
        <div>
          <h4 className="font-medium text-gray-900 mb-2">Optimize for Job</h4>
          <Textarea
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            placeholder="Paste a job description here to get tailored suggestions..."
            rows={4}
            className="mb-3"
          />
          <Button 
            onClick={optimizeForJob}
            disabled={isGenerating || !jobDescription.trim()}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Analyzing...
              </>
            ) : (
              <>
                <Target className="w-4 h-4 mr-2" />
                Optimize Resume
              </>
            )}
          </Button>
        </div>

        {/* Experience AI Generation */}
        <div className="space-y-2">
          <h4 className="font-medium text-gray-900">Enhance Experience</h4>
          {resume.experience?.map((experience, index) => (
            <div key={index} className="p-3 bg-white/50 rounded-lg">
              <p className="text-sm font-medium text-gray-800 mb-2">
                {experience.title} at {experience.company}
              </p>
              <Button
                onClick={() => generateBulletPoints(experience, index)}
                disabled={isGenerating}
                size="sm"
                variant="outline"
                className="border-purple-200 hover:bg-purple-50"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-purple-500 mr-2"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="w-3 h-3 mr-2" />
                    Generate Bullets
                  </>
                )}
              </Button>
            </div>
          ))}
        </div>

        {/* AI Suggestions */}
        {suggestions.length > 0 && (
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">AI Suggestions</h4>
            {suggestions.map((suggestion, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-white/70 rounded-lg"
              >
                <div className="flex items-center gap-2 mb-3">
                  <suggestion.icon className="w-4 h-4 text-purple-600" />
                  <h5 className="font-medium text-gray-800">{suggestion.title}</h5>
                </div>
                
                {suggestion.type === "keywords" || suggestion.type === "skills" ? (
                  <div className="space-y-2">
                    <div className="flex flex-wrap gap-1">
                      {suggestion.items.map((item, itemIndex) => (
                        <Badge 
                          key={itemIndex}
                          variant="secondary"
                          className="bg-purple-100 text-purple-800 cursor-pointer hover:bg-purple-200 transition-colors"
                          onClick={() => suggestion.type === "skills" && addSkillsToResume([item])}
                        >
                          {item}
                          {suggestion.type === "skills" && (
                            <span className="ml-1 text-xs">+</span>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {suggestion.type === "skills" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => addSkillsToResume(suggestion.items)}
                        className="text-xs"
                      >
                        Add All Skills
                      </Button>
                    )}
                  </div>
                ) : (
                  <ul className="text-sm text-gray-600 space-y-1">
                    {suggestion.items.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex items-start gap-2">
                        <span className="w-1.5 h-1.5 bg-purple-400 rounded-full mt-2 flex-shrink-0"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
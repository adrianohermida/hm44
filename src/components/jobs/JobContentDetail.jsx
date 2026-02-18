import React from "react";
import { Badge } from "@/components/ui/badge";

export default function JobContentDetail({ job }) {
  return (
    <div className="prose prose-sm md:prose-base max-w-none text-gray-700">
      <h3 className="font-bold text-gray-900">Job Description</h3>
      <p>{job.description}</p>

      {job.requirements?.length > 0 && (
        <>
          <h3 className="font-bold text-gray-900 mt-6">Requirements</h3>
          <ul className="list-disc pl-5">
            {job.requirements.map((req, i) => <li key={i}>{req}</li>)}
          </ul>
        </>
      )}

      {job.benefits?.length > 0 && (
        <>
          <h3 className="font-bold text-gray-900 mt-6">Benefits</h3>
          <ul className="list-disc pl-5">
            {job.benefits.map((benefit, i) => <li key={i}>{benefit}</li>)}
          </ul>
        </>
      )}

      {job.skills?.length > 0 && (
        <div className="mt-8">
          <h3 className="font-bold text-gray-900 mb-3">Required Skills</h3>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => <Badge key={i} variant="secondary">{skill}</Badge>)}
          </div>
        </div>
      )}
    </div>
  );
}
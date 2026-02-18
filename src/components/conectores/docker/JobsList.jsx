import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import JobItem from './JobItem';

export default function JobsList({ jobs, onSelectJob }) {
  if (!jobs?.length) {
    return (
      <Card>
        <CardContent className="py-6 text-center text-[var(--text-tertiary)]">
          <p className="text-sm">Nenhum job em execução</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Jobs ({jobs.length})</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {jobs.map(job => (
          <JobItem key={job.id} job={job} onClick={() => onSelectJob(job)} />
        ))}
      </CardContent>
    </Card>
  );
}
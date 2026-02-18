import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AccountStats() {
  return (
    <Card className="bg-gradient-to-r from-[var(--brand-primary-50)] to-emerald-50 border border-green-200">
      <CardHeader>
        <CardTitle className="text-[var(--brand-primary-700)]">Account Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--brand-primary-700)]">3</div>
            <div className="text-sm text-[var(--brand-primary-600)]">Resumes Created</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--brand-primary-700)]">12</div>
            <div className="text-sm text-[var(--brand-primary-600)]">Job Applications</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[var(--brand-primary-700)]">92%</div>
            <div className="text-sm text-[var(--brand-primary-600)]">Average ATS Score</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
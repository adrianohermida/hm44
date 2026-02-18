import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Target, Eye, Download, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { motion } from "framer-motion";
import { format } from "date-fns";

export default function ResumeGrid({ resumes, isLoading, onCreateResume }) {
  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="h-32 bg-gray-200 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (resumes.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <div className="w-24 h-24 bg-[var(--brand-bg-secondary)] rounded-full mx-auto mb-6 flex items-center justify-center">
          <FileText className="w-12 h-12 text-[var(--brand-text-tertiary)]" />
        </div>
        <h3 className="text-2xl font-semibold text-[var(--brand-text-primary)] mb-4">Nenhum documento ainda</h3>
        <p className="text-[var(--brand-text-secondary)] mb-8 max-w-md mx-auto">
          Comece criando seu primeiro documento. Leva apenas alguns minutos!
        </p>
        <Button
          onClick={onCreateResume}
          size="lg"
          className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary-600)] text-white px-8 py-4 rounded-xl"
        >
          <Plus className="w-5 h-5 mr-2" />
          Criar Primeiro Documento
        </Button>
      </motion.div>
    );
  }

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
      {resumes.map((resume, index) => (
        <motion.div
          key={resume.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Card className="group hover:shadow-lg transition-shadow border border-gray-200 hover:border-[var(--brand-primary-200)]">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg font-semibold text-[var(--brand-text-primary)] mb-1">
                    {resume.title}
                  </CardTitle>
                  <p className="text-sm text-[var(--brand-text-secondary)]">
                    {resume.template} template
                  </p>
                </div>
                <div className="flex items-center gap-1 bg-[var(--brand-bg-secondary)] px-2 py-1 rounded-lg">
                  <Target className="w-3 h-3 text-[var(--brand-text-secondary)]" />
                  <span className="text-xs font-medium text-[var(--brand-text-primary)]">
                    {resume.ats_score || 0}%
                  </span>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="bg-[var(--brand-bg-secondary)] rounded-lg p-4 mb-4 h-32 flex items-center justify-center">
                <FileText className="w-16 h-16 text-[var(--brand-text-tertiary)]" />
              </div>
              
              <div className="text-xs text-[var(--brand-text-secondary)] mb-4">
                Updated {format(new Date(resume.updated_date), "MMM d, yyyy")}
              </div>
              
              <div className="flex gap-2">
                <Link 
                  to={createPageUrl(`Editor?id=${resume.id}`)}
                  className="flex-1"
                >
                  <Button size="sm" variant="outline" className="w-full">
                    <Eye className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                </Link>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
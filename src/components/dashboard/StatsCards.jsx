import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { FileText, Target, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function StatsCards({ resumes }) {
  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="bg-[var(--brand-primary-50)] border-[var(--brand-primary-200)]">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--brand-text-secondary)] text-sm font-medium">Total Processos</p>
                <p className="text-2xl font-bold text-[var(--brand-text-primary)]">{resumes.length}</p>
              </div>
              <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-[var(--brand-primary)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--brand-text-secondary)] text-sm font-medium">Taxa Sucesso</p>
                <p className="text-2xl font-bold text-[var(--brand-text-primary)]">
                  {resumes.length > 0 
                    ? Math.round(resumes.reduce((sum, r) => sum + (r.ats_score || 0), 0) / resumes.length)
                    : 0}%
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--brand-bg-secondary)] rounded-xl flex items-center justify-center">
                <Target className="w-6 h-6 text-[var(--brand-text-secondary)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[var(--brand-text-secondary)] text-sm font-medium">Documentos</p>
                <p className="text-2xl font-bold text-[var(--brand-text-primary)]">
                  {resumes.reduce((sum, r) => sum + (r.experience?.length || 0), 0)}
                </p>
              </div>
              <div className="w-12 h-12 bg-[var(--brand-bg-secondary)] rounded-xl flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[var(--brand-text-secondary)]" />
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
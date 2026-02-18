import React from "react";
import { User as UserIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function ProfileHeader() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="mb-8"
    >
      <div className="flex items-center gap-3 mb-4">
        <UserIcon className="w-8 h-8 text-[var(--brand-info)]" />
        <h1 className="text-3xl font-bold text-[var(--brand-text-primary)]">My Profile</h1>
      </div>
      <p className="text-[var(--brand-text-secondary)] text-lg">
        Manage your account settings and personal information.
      </p>
    </motion.div>
  );
}
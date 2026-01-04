"use client";

import React from 'react';
import { motion } from "framer-motion";
import { AlertTriangle, Droplets } from "lucide-react";

export default function DefectCard({ defect, index }) {
  // Simple check to determine color severity based on defect name
  const isCritical = defect.type.includes("Crack") || defect.type === "Spalling";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow"
    >
      <div className="flex items-center gap-4">
        <div
          className={`p-3 rounded-lg ${
            isCritical ? "bg-rose-100 text-rose-600" : "bg-amber-100 text-amber-600"
          }`}
        >
          {defect.type === "Algae" ? <Droplets size={20} /> : <AlertTriangle size={20} />}
        </div>
        <div>
          <h4 className="font-semibold text-slate-900">{defect.type}</h4>
          <p className="text-xs text-slate-500">{defect.count} instance(s) detected</p>
        </div>
      </div>
      <div className="text-right">
        <span className="block text-sm font-bold text-slate-900">{defect.confidence}%</span>
        <span className="text-xs text-slate-400">Confidence</span>
      </div>
    </motion.div>
  );
}
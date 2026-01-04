"use client";

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Layers, FileText, ArrowRight, Droplets } from "lucide-react";
import HealthRing from "./HealthRing";
import DefectCard from "./DefectCard";

export default function ResultsPanel({ result, isLoading }) {
  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key="results"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="space-y-6"
        >
          {/* 1. Score Card */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Wall Health</h2>
                <p className="text-slate-500 text-sm">ISO 9001 Inspection Standard</p>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
                  result.status === "Critical"
                    ? "bg-rose-100 text-rose-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {result.status}
              </span>
            </div>

            <div className="flex items-center gap-8">
              <HealthRing score={result.score} />
              
              {/* Simple Bar Charts */}
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span className="flex items-center gap-2"><Layers size={14} /> Surface</span>
                  <span className="text-rose-500 font-medium">Poor</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-rose-500 h-2 rounded-full w-[30%]"></div>
                </div>

                <div className="flex items-center justify-between text-sm text-slate-600 mt-2">
                  <span className="flex items-center gap-2"><Droplets size={14} /> Moisture</span>
                  <span className="text-amber-500 font-medium">Moderate</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full w-[60%]"></div>
                </div>
              </div>
            </div>
          </div>

          {/* 2. AI Summary */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
              <FileText size={18} /> AI Assessment Summary
            </h3>
            <p className="text-blue-800/80 leading-relaxed text-sm">{result.summary}</p>
          </div>

          {/* 3. Defects List */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 ml-1">Detected Defects</h3>
            {result.defects.map((defect, idx) => (
              <DefectCard key={idx} defect={defect} index={idx} />
            ))}
          </div>

          {/* 4. Export Button */}
          <button className="w-full py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            Export Full PDF Report <ArrowRight size={16} />
          </button>
        </motion.div>
      ) : (
        /* Empty / Loading State */
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-400"
        >
          {isLoading ? (
            <div className="space-y-4">
               <p className="animate-pulse font-medium text-blue-500">Processing visual data...</p>
            </div>
          ) : (
            <>
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Layers size={32} />
              </div>
              <p>Upload an image and run analysis<br />to generate a wall health report.</p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
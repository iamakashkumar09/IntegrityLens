"use client";

import React from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowRight, AlertTriangle, Leaf, Droplets, Activity } from "lucide-react";
import HealthRing from "./HealthRing";
import DefectCard from "./DefectCard";

export default function ResultsPanel({ result, isLoading }) {
  
  // 1. SAFETY CHECK: Handle backend errors gracefully
  if (result?.error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
        <h3 className="font-bold text-lg mb-2">Analysis Error</h3>
        <p>{result.error}</p>
        <p className="text-sm mt-2 opacity-75">Check your Python backend terminal for details.</p>
      </div>
    );
  }

  // Helper to choose icons based on defect type
  const getIcon = (type) => {
    if (type.includes("Vegetation")) return <Leaf size={14} />;
    if (type.includes("Stains")) return <Droplets size={14} />;
    if (type.includes("Cracks") || type.includes("Spalling")) return <AlertTriangle size={14} />;
    return <Activity size={14} />;
  };

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
          {/* --- 1. MAIN SCORE CARD --- */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Wall Health</h2>
                <p className="text-slate-500 text-sm">AI-Based Structural Assessment</p>
              </div>
              <span
                className={`px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wide ${
                  result.status === "Critical"
                    ? "bg-rose-100 text-rose-700"
                    : result.status === "Caution" 
                    ? "bg-amber-100 text-amber-700"
                    : "bg-emerald-100 text-emerald-700"
                }`}
              >
                {result.status || "Unknown"}
              </span>
            </div>

            <div className="flex items-center gap-8">
              {/* Score Ring */}
              <HealthRing score={result.score || 0} />
              
              {/* --- NEW: Dynamic Model Stats --- */}
              <div className="flex-1 space-y-4">
                <div className="text-sm font-medium text-slate-400 uppercase tracking-wider mb-2">
                  Primary Detection
                </div>
                {Array.isArray(result.defects) && result.defects.length > 0 ? (
                   <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                      <div className="flex items-center gap-3 mb-2">
                        <div className={`p-2 rounded-lg ${result.status === 'Safe' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                           {getIcon(result.defects[0].type)}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900">{result.defects[0].type}</h4>
                          <p className="text-xs text-slate-500">Highest Confidence Match</p>
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2 mt-2">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${result.defects[0].confidence}%` }}
                          className="bg-blue-600 h-2 rounded-full"
                        />
                      </div>
                      <div className="text-right text-xs font-bold text-blue-600 mt-1">
                        {Number(result.defects[0].confidence).toFixed(2)}% Confidence
                      </div>
                   </div>
                ) : (
                  <p className="text-sm text-slate-400">No specific defects identified.</p>
                )}
              </div>
            </div>
          </div>

          {/* --- 2. AI SUMMARY --- */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6">
            <h3 className="flex items-center gap-2 font-semibold text-blue-900 mb-2">
              <FileText size={18} /> AI Assessment Summary
            </h3>
            <p className="text-blue-800/80 leading-relaxed text-sm">
              {result.summary || "Analysis complete."}
            </p>
          </div>

          {/* --- 3. DETAILED DEFECTS LIST --- */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 ml-1">Detected Conditions</h3>
            
            {Array.isArray(result.defects) && result.defects.length > 0 ? (
              result.defects.map((defect, idx) => (
                <DefectCard key={idx} defect={defect} index={idx} />
              ))
            ) : (
              <p className="text-slate-500 italic p-4 text-center border-2 border-dashed rounded-xl">
                No major defects detected. Wall appears normal.
              </p>
            )}
          </div>

          {/* --- 4. EXPORT ACTION --- */}
          <button className="w-full py-3 border border-slate-200 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition-colors flex items-center justify-center gap-2">
            Export Full PDF Report <ArrowRight size={16} />
          </button>
        </motion.div>
      ) : (
        /* EMPTY / LOADING STATE */
        <motion.div
          key="empty"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="h-full min-h-[400px] border-2 border-dashed border-slate-200 rounded-3xl p-8 flex flex-col items-center justify-center text-center text-slate-400"
        >
          {isLoading ? (
             <p className="animate-pulse font-medium text-blue-500">Processing visual data...</p>
          ) : (
            <>
              <div className="bg-slate-50 p-4 rounded-full mb-4">
                <Activity size={32} />
              </div>
              <p>Upload an image and run analysis<br />to detect cracks, spalling, or vegetation.</p>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
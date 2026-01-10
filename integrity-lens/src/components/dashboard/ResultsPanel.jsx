"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { FileText, ArrowRight, AlertTriangle, Leaf, Droplets, Activity, Sparkles, Hammer } from "lucide-react";
import HealthRing from "./HealthRing";
import DefectCard from "./DefectCard";

export default function ResultsPanel({ result, isLoading }) {
  const [remedies, setRemedies] = useState(null);
  const [isRemedyLoading, setIsRemedyLoading] = useState(false);
  const [error, setError] = useState(null);
  const [remedies, setRemedies] = useState(null);
  const [isRemedyLoading, setIsRemedyLoading] = useState(false);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    setRemedies(null);       // Clear the old text
    setError(null);          // Clear old errors
    setIsRemedyLoading(false); 
  }, [result]);
  // --- MANUAL TRIGGER FUNCTION ---
  const handleGenerateRemedy = async () => {
    if (!result || result.error) return;

    setIsRemedyLoading(true);
    setError(null);

    try {
      const topDefect = result.defects?.[0]?.type || "General Defect";

      const response = await fetch('/api/remedies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          defectType: topDefect,
          score: result.score
        }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error || "Failed to fetch");

      if (data.remedies) {
        setRemedies(data.remedies);
      }
    } catch (err) {
      console.error("Failed to fetch remedies:", err);
      setError("Could not generate plan. Please try again.");
    } finally {
      setIsRemedyLoading(false);
    }
  };

  // --- SAFETY CHECKS ---
  if (result?.error) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-xl text-red-700 text-center">
        <h3 className="font-bold text-lg mb-2">Analysis Error</h3>
        <p>{result.error}</p>
      </div>
    );
  }

  const getIcon = (type) => {
    if (type.includes("Vegetation")) return <Leaf size={14} />;
    if (type.includes("Stains")) return <Droplets size={14} />;
    if (type.includes("Cracks")) return <AlertTriangle size={14} />;
    return <Activity size={14} />;
  };

  return (
    <AnimatePresence mode="wait">
      {result ? (
        <motion.div
          key="results"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-6"
        >
          {/* 1. SCORE CARD */}
          <div className="bg-white rounded-3xl p-8 shadow-xl shadow-slate-200/50 border border-slate-100">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Wall Health</h2>
                <p className="text-slate-500 text-sm">AI-Based Structural Assessment</p>
              </div>
              <span className={`px-4 py-1 rounded-full text-sm font-bold uppercase ${result.status === "Critical" ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
                }`}>
                {result.status}
              </span>
            </div>

            <div className="flex items-center gap-8">
              <HealthRing score={result.score} />
              <div className="flex-1">
                {result.defects?.[0] ? (
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                    <div className="flex items-center gap-2 font-bold text-slate-700">
                      {getIcon(result.defects[0].type)}
                      {result.defects[0].type}
                    </div>
                    <div className="text-xs text-slate-500 mt-1">
                      Primary Issue Detected
                    </div>
                  </div>
                ) : <p>No Defects</p>}
              </div>
            </div>
          </div>

          {/* 2. AI REMEDY SECTION (Button OR Card) */}
          <div className="transition-all duration-300">
            {/* STATE A: Show Button if no remedies yet */}
            {!remedies && !isRemedyLoading && (
              <button
                onClick={handleGenerateRemedy}
                className="w-full group relative overflow-hidden bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4 rounded-2xl shadow-lg shadow-emerald-200/50 hover:shadow-emerald-300/50 transition-all active:scale-[0.98]"
              >
                <div className="relative z-10 flex items-center justify-center gap-3 font-semibold text-lg">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                  Generate Professional Repair Plan
                  <ArrowRight className="w-5 h-5 opacity-70 group-hover:translate-x-1 transition-transform" />
                </div>
                {/* Shine effect */}
                <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
              </button>
            )}

            {/* STATE B: Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center p-2 bg-red-50 rounded-lg border border-red-100 mb-4">
                {error}
              </div>
            )}

            {/* STATE C: The Remedy Card (Loading OR Content) */}
            {(remedies || isRemedyLoading) && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />

                <h3 className="flex items-center gap-2 font-bold text-slate-800 mb-4">
                  <div className="bg-emerald-100 p-2 rounded-lg text-emerald-700">
                    <Hammer size={18} />
                  </div>
                  Engineer Recommendation
                </h3>

                <div className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                  {isRemedyLoading ? (
                    <div className="space-y-3 animate-pulse">
                      <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                      <div className="h-4 bg-slate-100 rounded w-full"></div>
                      <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                      <div className="h-4 bg-slate-100 rounded w-2/3"></div>
                    </div>
                  ) : (
                    remedies
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* 3. DEFECT LIST */}
          <div className="space-y-3">
            <h3 className="font-semibold text-slate-900 ml-1">Detected Conditions</h3>
            {result.defects?.map((defect, idx) => (
              <DefectCard key={idx} defect={defect} index={idx} />
            ))}
          </div>

        </motion.div>
      ) : (
        /* LOADING STATE */
        <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-3xl">
          {isLoading ? <p className="animate-pulse">Analyzing...</p> : <p>Upload an image to start</p>}
        </div>
      )}
    </AnimatePresence>
  );
}

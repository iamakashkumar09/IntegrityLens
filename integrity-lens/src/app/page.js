"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import UploadZone from "@/components/input/UploadZone";
import ResultsPanel from "@/components/dashboard/ResultsPanel";

export default function Home() {
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  return (
    <main className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
      <Header />

      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Intro Text */}
        <div className="mb-10 text-center max-w-1xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight"
          >
            See the Unseen. <br/> 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              Structural AI Analytics.
            </span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-slate-500"
          >
            Detect cracks, mold, and structural risks instantly with our specialized computer vision workspace.
          </motion.p>
        </div>

        {/* Workspace Grid */}
        <div className="grid lg:grid-cols-10 gap-6 items-start">
          
          {/* Left: Input */}
          <div className="lg:col-span-5">
            <UploadZone 
              onAnalyzeStart={() => setIsAnalyzing(true)}
              onAnalyzeComplete={(data) => {
                setResult(data);
                setIsAnalyzing(false);
              }}
            />
          </div>

          {/* Right: Results */}
          <div className="lg:col-span-5 sticky top-24">
            <ResultsPanel result={result} isLoading={isAnalyzing} />
          </div>

        </div>
      </div>
    </main>
  );
}
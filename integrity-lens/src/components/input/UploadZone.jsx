"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Scan, Activity, X } from "lucide-react";

export default function UploadZone({ onAnalyzeStart, onAnalyzeComplete }) {
  const [preview, setPreview] = useState(null);
  const [file, setFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleReset = (e) => {
    e.stopPropagation(); // Prevent triggering the file input if clicked
    setFile(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // inside components/input/UploadZone.jsx

  const runAnalysis = async () => {
    if (!file) return;

    setIsScanning(true);
    onAnalyzeStart();

    try {
      // 1. Wrap the file in FormData
      const formData = new FormData();
      // The key "file" here must match 'formData.get("file")' in the API Route
      formData.append("file", file); 

      // 2. Send to Next.js API
      const res = await fetch("/api/analyze", { 
          method: "POST",
          body: formData 
      });

      if (!res.ok) throw new Error("Analysis failed");
      
      const data = await res.json();

      // 3. Update State
      // We keep the timeout just for the cool animation effect :)
      setTimeout(() => {
          onAnalyzeComplete(data);
          setIsScanning(false);
      }, 1500);

    } catch (error) {
      console.error(error);
      setIsScanning(false);
      alert("Something went wrong with the analysis.");
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        layout
        className={`relative overflow-hidden rounded-3xl border-2 transition-all duration-300 ${
          preview
            ? "border-slate-200 bg-slate-900 shadow-2xl"
            : "border-dashed border-slate-300 bg-white hover:border-blue-400 hover:bg-blue-50/50 min-h-[400px]" // Fixed height only when empty
        }`}
      >
        <AnimatePresence mode="wait">
          {preview ? (
            <motion.div
              key="preview"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative group flex items-start justify-center bg-slate-950"
            >
              {/* Image Size Adjustment: w-full fills width, h-auto keeps aspect ratio */}
              <img
                src={preview}
                alt="Wall Analysis"
                className="w-full h-auto object-contain max-h-[75vh]" 
              />

              {/* Reset Button (Top Right) */}
              {!isScanning && (
                <button
                  onClick={handleReset}
                  className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-md transition-all z-30"
                >
                  <X size={20} />
                </button>
              )}

              {/* Scanning Animation Overlay */}
              {isScanning && (
                <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-20">
                  <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto mb-6">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-full h-full border-4 border-blue-500/30 border-t-blue-500 rounded-full"
                      />
                      <Scan className="absolute inset-0 m-auto text-blue-400" size={32} />
                    </div>
                    <h3 className="text-white text-xl font-medium animate-pulse">
                      Analyzing...
                    </h3>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.label
              key="dropzone"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full min-h-[400px] cursor-pointer p-12 text-center"
            >
              <div className="bg-blue-100 p-6 rounded-full mb-6 text-blue-600">
                <Upload size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">
                Upload Wall Image
              </h3>
              <p className="text-slate-500 max-w-sm">
                Click or drag & drop. <br />
                We recommend high-resolution photos.
              </p>
              <input
                ref={fileInputRef}
                type="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*"
              />
            </motion.label>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Action Button */}
      <AnimatePresence>
        {preview && !isScanning && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            onClick={runAnalysis}
            className="w-full py-4 bg-slate-900 text-white rounded-xl font-semibold text-lg hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3"
          >
            <Activity size={20} />
            Run Integrity Analysis
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}
"use client";

import React from 'react';
import { cn } from "@/lib/utils";

export default function HealthRing({ score }) {
  const circumference = 2 * Math.PI * 40; // radius = 40
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getColor = (s) => {
    if (s >= 80) return "text-emerald-500";
    if (s >= 50) return "text-amber-500";
    return "text-rose-500";
  };

  return (
    <div className="relative flex items-center justify-center w-32 h-32">
      {/* Background Circle */}
      <svg className="transform -rotate-90 w-32 h-32">
        <circle 
          cx="64" cy="64" r="40" 
          stroke="currentColor" 
          strokeWidth="8" 
          fill="transparent" 
          className="text-slate-100" 
        />
        {/* Animated Progress Circle */}
        <circle
          cx="64" cy="64" r="40"
          stroke="currentColor"
          strokeWidth="8"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className={cn("transition-all duration-1000 ease-out", getColor(score))}
        />
      </svg>
      {/* Center Text */}
      <div className="absolute flex flex-col items-center">
        <span className={cn("text-3xl font-bold", getColor(score))}>{score}</span>
        <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Health</span>
      </div>
    </div>
  );
}
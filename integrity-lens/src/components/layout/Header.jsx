import React from 'react';
import { Search } from "lucide-react";

export default function Header() {
  return (
    <nav className="flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-slate-100">
      <div className="flex items-center gap-2">
        <div className="bg-blue-600 p-2 rounded-lg text-white">
          <Search size={20} strokeWidth={3} />
        </div>
        <span className="text-xl font-bold text-slate-900 tracking-tight">IntegrityLens</span>
      </div>
      <div className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
        <a href="#" className="hover:text-blue-600 transition-colors">History</a>
        <a href="#" className="hover:text-blue-600 transition-colors">Documentation</a>
        <button className="bg-slate-900 text-white px-5 py-2 rounded-full hover:bg-slate-800 transition-all">
          My Dashboard
        </button>
      </div>
    </nav>
  );
}
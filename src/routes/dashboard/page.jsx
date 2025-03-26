import React from "react";
import { Play } from "lucide-react";

const DashboardPage = () => {
  const brandColor = "#1e628c";
  
  return (
    <div className="flex flex-col gap-6 p-4">
      {/* Header Section */}
      <div className="rounded-xl py-8 px-6 text-white text-center" style={{ backgroundColor: brandColor }}>
        <h1 className="text-3xl font-bold">Welcome to RapidRoutines AI</h1>
      </div>

      {/* Main Content - Video Section */}
      <div className="flex justify-center w-full">
        <div className="w-full max-w-3xl">
          <div className="relative rounded-xl overflow-hidden shadow-md border border-slate-200">
            {/* Video Component */}
            <div className="aspect-video bg-slate-800 flex items-center justify-center">
              {/* Overlay with Play Button */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/50 flex items-center justify-center">
                <button 
                  className="bg-white/90 hover:bg-white rounded-full w-14 h-14 flex items-center justify-center transition-all hover:scale-105"
                  style={{ boxShadow: `0 0 0 3px ${brandColor}40` }}
                >
                  <Play size={28} style={{ color: brandColor, fill: brandColor }} />
                </button>
              </div>
              
              {/* Video Title */}
              <div className="absolute bottom-4 left-4">
                <h2 className="text-white text-lg font-bold">Discover AI-Assisted Fitness</h2>
                <p className="text-white/70 text-sm">Transform your workout with our intelligent tools</p>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1 w-full bg-slate-700">
              <div className="h-full" style={{ width: "0%", backgroundColor: brandColor }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
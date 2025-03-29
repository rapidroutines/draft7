import { Camera } from "lucide-react";
import { Footer } from "@/layouts/footer";
import { useEffect } from "react";

// Exercise types supported by RepBot
const SUPPORTED_EXERCISES = [
  "Bicep Curl", 
  "Squat", 
  "Push-up", 
  "Shoulder Press", 
  "Sit-up", 
  "Jumping Jacks", 
  "Lunges"
];

const RepBotPage = () => {
  useEffect(() => {
    // Update page title
    document.title = "RapidRoutines - RepBot";
  }, []);
  
  // Direct external link function
  const handleLaunchClick = (e) => {
    e.preventDefault();
    
    // Use the full absolute URL to ensure we break out of any iframe or embedding
    const repbotUrl = "https://rapidroutines.org/repbot/";
    
    // Use window.open with _top or _blank to ensure it breaks out of iframes
    window.open(repbotUrl, "_top");
    
    // Fallback: also set direct location
    setTimeout(() => {
      window.location.href = repbotUrl;
    }, 100);
    
    return false;
  };

  return (
    <div className="flex flex-col items-center gap-y-6">
      {/* Welcoming Header */}
      <div className="w-full text-center">
        <h1 className="title mb-2">Welcome to RepBot</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">
          Your AI workout form assistant
        </p>
      </div>

      {/* Simple Container */}
      <div className="max-w-2xl w-full bg-white dark:bg-slate-800 rounded-xl p-6 shadow-md border border-slate-200 dark:border-slate-700">
        {/* Exercises Section */}
        <h2 className="text-xl font-medium text-slate-900 dark:text-white mb-4">
          Exercises We Support
        </h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
          {SUPPORTED_EXERCISES.map((exercise, index) => (
            <div
              key={index}
              className={`bg-slate-50 dark:bg-slate-700 rounded-lg p-3 text-center border-2 border-[#1e628c]/30 ${
                exercise === "Lunge" ? "col-span-2 sm:col-span-3 mx-auto max-w-xs" : ""
              }`}
            >
              <span className="text-slate-800 dark:text-slate-200">{exercise}</span>
            </div>
          ))}
        </div>
        
        {/* Button with direct link instead of React Router */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleLaunchClick}
            className="inline-flex items-center justify-center rounded-lg bg-[#1e628c] text-white px-8 py-3 font-medium text-lg hover:bg-[#1a567c] transition-colors"
          >
            <Camera size={20} className="mr-2" />
            Launch RepBot
          </button>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RepBotPage;
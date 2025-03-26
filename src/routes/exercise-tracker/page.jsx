import { useState } from "react";
import { Dumbbell } from "lucide-react";

const ExerciseTrackerPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    return (
        <div className="flex flex-col gap-y-4">
            {/* Header */}
            <div className="flex items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c] text-white">
                        <Dumbbell size={20} />
                    </div>
                    <div>
                        <h1 className="title">Exercise Tracker</h1>
                        <p className="text-slate-600 text-sm">Track your workouts and monitor your progress</p>
                    </div>
                </div>
            </div>
            
            {/* Embedded Tracker without border */}
            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-150px)]">
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="h-12 w-12 rounded-full border-4 border-[#1e628c]/30 border-t-[#1e628c] animate-spin"></div>
                    </div>
                )}
                
                {/* Fixed height iframe container to prevent main page scrolling */}
                <div className="w-full h-full">
                    <iframe 
                        src="https://exercise-tracker-tau.vercel.app" 
                        className="w-full h-full border-0"
                        title="Exercise Tracker"
                        onLoad={() => setIsLoading(false)}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default ExerciseTrackerPage;
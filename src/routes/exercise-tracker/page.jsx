import { useState, useEffect } from "react";
import { Dumbbell } from "lucide-react";

const ExerciseTrackerPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    
    // Add effect to increase the page height by modifying the layout container
    useEffect(() => {
        // Target the parent layout container to give it more height
        const layoutContainer = document.querySelector('.h-\\[calc\\(100vh-60px\\)\\]');
        if (layoutContainer) {
            layoutContainer.style.height = 'calc(100vh - 30px)';
            layoutContainer.style.maxHeight = 'none';
            // Reset when component unmounts
            return () => {
                layoutContainer.style.height = 'calc(100vh - 60px)';
                layoutContainer.style.maxHeight = '';
            };
        }
    }, []);
    
    return (
        <div className="flex flex-col gap-y-4 h-full">
            {/* Header - minimized for more space */}
            <div className="flex items-center mb-1">
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
            
            {/* Embedded Tracker with maximized height */}
            <div className="relative bg-white rounded-lg shadow-sm overflow-hidden h-[calc(100vh-80px)] min-h-[900px] flex-grow">
                {/* Loading State */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 z-10">
                        <div className="h-12 w-12 rounded-full border-4 border-[#1e628c]/30 border-t-[#1e628c] animate-spin"></div>
                    </div>
                )}
                
                {/* Maximized height iframe container */}
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

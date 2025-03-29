import { useState } from "react";
import ExerciseCounter from "@/components/ExerciseCounter";
import ErrorBoundary from "@/components/ErrorBoundary";
import { RefreshCw } from "lucide-react";

const RepBotPage = () => {
    const [key, setKey] = useState(0); // Used to force remount of the component
    
    const handleRetry = () => {
        // Force a remount of the ExerciseCounter component
        setKey(prevKey => prevKey + 1);
    };
    
    // Custom fallback component for the error boundary
    const errorFallback = (
        <div className="mt-4">
            <p className="mb-4">This could be due to camera permission issues or incompatible browser.</p>
            <button
                onClick={handleRetry}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
                <RefreshCw size={18} />
                Try Again
            </button>
        </div>
    );

    return (
        <div className="flex flex-col gap-y-4 h-[calc(100vh-80px)]">
            <div className="flex items-center mb-2">
                <div className="flex flex-col">
                    <h1 className="title">RepBot AI Exercise Counter</h1>
                    <p className="text-slate-600 text-sm">Count your exercise repetitions with AI assistance</p>
                </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
                <ErrorBoundary fallback={errorFallback}>
                    <ExerciseCounter key={key} />
                </ErrorBoundary>
            </div>
            
            <div className="text-center text-sm text-slate-500 mt-2">
                <p>Having trouble? Try refreshing the page and ensure you've granted camera permissions.</p>
                <button 
                    onClick={handleRetry}
                    className="text-[#1e628c] font-medium hover:underline mt-1"
                >
                    Reset RepBot
                </button>
            </div>
        </div>
    );
};

export default RepBotPage;
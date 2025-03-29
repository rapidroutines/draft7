import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Check } from "lucide-react";
import WorkoutSummaryModal from "@/components/workout-summary-modal";
import WorkoutService from "@/services/workout-service";

const RepBotPage = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const navigate = useNavigate();
    
    // Listen for messages from the iframe
    useEffect(() => {
        const handleMessage = (event) => {
            // Verify origin (replace with your actual domain)
            if (event.origin !== "https://render-repbot.vercel.app") {
                return;
            }
            
            // Handle workout complete message
            if (event.data && event.data.type === 'WORKOUT_COMPLETE') {
                console.log('Workout complete message received:', event.data.workout);
                setCurrentWorkout(event.data.workout);
                setShowModal(true);
            }
        };
        
        window.addEventListener('message', handleMessage);
        
        return () => {
            window.removeEventListener('message', handleMessage);
        };
    }, []);
    
    // Handle modal actions
    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const handleViewHistory = () => {
        setShowModal(false);
        navigate('/exercise-tracker');
    };

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            {/* Full-height container for the iframe */}
            <div className="relative flex-1 w-full overflow-hidden bg-white dark:bg-slate-950 rounded-lg shadow-sm">
                {/* Loading overlay */}
                {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-white/80 dark:bg-slate-950/80 z-10">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-[#1e628c]" />
                            <p className="mt-2 text-slate-600 dark:text-slate-300">Loading RepBot...</p>
                        </div>
                    </div>
                )}
                
                {/* RepBot iframe - full height and width */}
                <iframe 
                    src="https://render-repbot.vercel.app/" 
                    className="w-full h-full border-0"
                    title="RepBot AI Exercise Counter"
                    onLoad={() => setIsLoading(false)}
                    allow="camera; microphone; accelerometer; gyroscope; fullscreen"
                    allowFullScreen
                />
            </div>
            
            {/* Workout Complete notification */}
            <div className="fixed bottom-4 right-4 bg-white rounded-lg shadow-lg p-4 z-20 hidden">
                <div className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                        <Check className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                        <h3 className="font-medium">Workout Complete!</h3>
                        <p className="text-sm text-slate-600">Great job on your workout.</p>
                    </div>
                </div>
            </div>
            
            {/* Workout Summary Modal */}
            {showModal && currentWorkout && (
                <WorkoutSummaryModal 
                    workout={currentWorkout}
                    onClose={handleCloseModal}
                    onViewHistory={handleViewHistory}
                />
            )}
        </div>
    );
};

export default RepBotPage;
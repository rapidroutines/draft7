import { useState, useEffect } from "react";
import { Maximize2, Minimize2, Camera } from "lucide-react";
import { cn } from "@/utils/cn";

const RepBotPage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showCameraPrompt, setShowCameraPrompt] = useState(true);
    const [iframeVisible, setIframeVisible] = useState(false);

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Handle escape key to exit fullscreen
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === "Escape" && isFullscreen) {
                setIsFullscreen(false);
            }
        };

        window.addEventListener("keydown", handleEscKey);
        return () => window.removeEventListener("keydown", handleEscKey);
    }, [isFullscreen]);

    const handleCameraAccess = async () => {
        try {
            // Simple approach - just try to get camera access
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: true,
                audio: false
            });
            
            // Stop the tracks immediately - we just needed permission
            stream.getTracks().forEach(track => track.stop());
            
            // Hide the prompt and show the iframe
            setShowCameraPrompt(false);
            setIframeVisible(true);
        } catch (error) {
            console.error("Camera access error:", error);
            // Keep the prompt visible with error state
            // You could set an error state here if you want to show different UI
        }
    };

    return (
        <div className={cn(
            "flex flex-col gap-y-4",
            isFullscreen && "fixed inset-0 z-50 bg-slate-100 p-4 dark:bg-slate-950"
        )}>
            <div className="flex items-center justify-between">
                <h1 className="title">RepBot</h1>
                <div className="flex items-center gap-3">
                    <button
                        className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-white transition-colors hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700"
                        onClick={toggleFullscreen}
                    >
                        {isFullscreen ? (
                            <>
                                <Minimize2 size={18} />
                                <span className="hidden sm:inline">Exit Fullscreen</span>
                            </>
                        ) : (
                            <>
                                <Maximize2 size={18} />
                                <span className="hidden sm:inline">Fullscreen</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            <div className="card flex flex-col overflow-hidden">
                <div className={cn(
                    "relative",
                    isFullscreen ? "h-[calc(100vh-80px)]" : "h-[80vh]"
                )}>
                    {/* Camera permission prompt */}
                    {showCameraPrompt && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/80">
                            <div className="max-w-md rounded-xl bg-white p-6 text-center dark:bg-slate-800">
                                <Camera className="mx-auto h-12 w-12 text-blue-500" />
                                <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                                    Camera Access Required
                                </h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-300">
                                    RepBot needs your camera to analyze your exercise form and provide feedback.
                                    Your video stays on your device and is not stored.
                                </p>
                                <button
                                    onClick={handleCameraAccess}
                                    className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                                >
                                    Allow Camera Access
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading indicator */}
                    {isLoading && iframeVisible && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-slate-900/90">
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-2 text-blue-400">Loading RepBot</p>
                            </div>
                        </div>
                    )}
                    
                    {/* RepBot iframe */}
                    {iframeVisible && (
                        <iframe
                            src="https://render-repbot.vercel.app/"
                            className="h-full w-full border-0"
                            onLoad={() => setIsLoading(false)}
                            title="RepBot Exercise Tracker"
                            allow="camera *; microphone *; accelerometer; gyroscope"
                            allowFullScreen
                            referrerPolicy="origin"
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RepBotPage;
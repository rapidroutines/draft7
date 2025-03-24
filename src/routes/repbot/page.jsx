import { useState, useEffect } from "react";
import { Maximize2, Minimize2 } from "lucide-react";
import { cn } from "@/utils/cn";

const RepBotPage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

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
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-2 text-blue-400">Loading RepBot</p>
                            </div>
                        </div>
                    )}
                    
                    <iframe 
                        src="https://render-repbot.vercel.app/"
                        className="h-full w-full border-0"
                        onLoad={() => setIsLoading(false)}
                        title="RepBot Exercise Tracker"
                        allow="camera;microphone;accelerometer;gyroscope"
                    ></iframe>
                </div>
            </div>
        </div>
    );
};

export default RepBotPage;
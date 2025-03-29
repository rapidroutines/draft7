import { useState } from "react";
import { Loader2 } from "lucide-react";

const RepBotPage = () => {
    const [isLoading, setIsLoading] = useState(true);

    return (
        <div className="flex flex-col h-[calc(100vh-60px)]">
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
        </div>
    );
};

export default RepBotPage;
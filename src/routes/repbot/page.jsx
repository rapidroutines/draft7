import { useState, useEffect } from "react";
import { Maximize2, Minimize2, Camera, AlertCircle } from "lucide-react";
import { cn } from "@/utils/cn";

const RepBotPage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [permissionState, setPermissionState] = useState("initial"); // initial, granted, denied, requesting
    const [iframeLoaded, setIframeLoaded] = useState(false);

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

    // Check if camera permissions are already granted
    useEffect(() => {
        const checkPermissions = async () => {
            try {
                // Check if we can access permission state
                if (navigator.permissions && navigator.permissions.query) {
                    const result = await navigator.permissions.query({ name: 'camera' });
                    setPermissionState(result.state);
                    
                    // Listen for permission changes
                    result.onchange = () => {
                        setPermissionState(result.state);
                    };
                }
            } catch (error) {
                console.log("Permission check error:", error);
                // If we can't check permissions, we'll rely on the request permission flow
            }
        };
        
        checkPermissions();
    }, []);

    const requestCameraPermission = async () => {
        setPermissionState("requesting");
        
        try {
            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            
            // If we got here, permission was granted
            setPermissionState("granted");
            
            // Stop the stream since we just needed it for the permission
            stream.getTracks().forEach(track => track.stop());
            
            // Set a timeout to allow animations to complete
            setTimeout(() => {
                setIframeLoaded(true);
            }, 500);
            
        } catch (error) {
            console.error("Camera permission denied:", error);
            setPermissionState("denied");
        }
    };

    const renderPermissionUI = () => {
        if (permissionState === "granted" || iframeLoaded) {
            return null;
        }
        
        return (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-20">
                <div className="max-w-md rounded-xl bg-white p-6 text-center dark:bg-slate-800">
                    {permissionState === "denied" ? (
                        <>
                            <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">Camera Access Denied</h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">
                                RepBot needs camera access to analyze your exercise form. Please enable camera access in your browser settings and reload this page.
                            </p>
                            <button
                                onClick={() => window.location.reload()}
                                className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                            >
                                Reload Page
                            </button>
                        </>
                    ) : (
                        <>
                            <Camera className="mx-auto h-12 w-12 text-blue-500" />
                            <h3 className="mt-4 text-lg font-semibold text-slate-900 dark:text-white">
                                {permissionState === "requesting" ? "Requesting Camera Access..." : "Camera Access Required"}
                            </h3>
                            <p className="mt-2 text-slate-600 dark:text-slate-300">
                                RepBot needs your camera to analyze your exercise form and provide feedback. Your video stays on your device and is not stored.
                            </p>
                            {permissionState !== "requesting" && (
                                <button
                                    onClick={requestCameraPermission}
                                    className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                                    disabled={permissionState === "requesting"}
                                >
                                    {permissionState === "requesting" ? "Requesting Access..." : "Allow Camera Access"}
                                </button>
                            )}
                            {permissionState === "requesting" && (
                                <div className="mt-4 flex items-center justify-center">
                                    <div className="h-5 w-5 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
                                    <span className="ml-2 text-slate-600 dark:text-slate-300">Please allow camera access in the browser prompt</span>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
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
                    {isLoading && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
                            <div className="flex flex-col items-center">
                                <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
                                <p className="mt-2 text-blue-400">Loading RepBot</p>
                            </div>
                        </div>
                    )}
                    
                    {renderPermissionUI()}
                    
                    {(permissionState === "granted" || iframeLoaded) && (
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
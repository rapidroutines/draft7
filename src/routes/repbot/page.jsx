import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, Camera, RefreshCw } from "lucide-react";
import { cn } from "@/utils/cn";
import { Footer } from "@/layouts/footer";
import { useLocation } from "react-router-dom";

const RepBotPage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showCameraPrompt, setShowCameraPrompt] = useState(true);
    const [iframeVisible, setIframeVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const iframeRef = useRef(null);
    const location = useLocation();
    const sessionKey = useRef(`repbot-session-${Date.now()}`).current;

    const toggleFullscreen = () => {
        setIsFullscreen(!isFullscreen);
    };

    // Reset the iframe when there's an error
    const resetIframe = () => {
        setErrorMessage("");
        setIsLoading(true);
        
        // If the iframe is already visible, reload it
        if (iframeVisible && iframeRef.current) {
            // Add timestamp to force a complete reload without caching
            const currentSrc = iframeRef.current.src.split('?')[0];
            iframeRef.current.src = `${currentSrc}?t=${Date.now()}`;
        } else {
            // Otherwise, show the camera prompt again
            setShowCameraPrompt(true);
            setIframeVisible(false);
            
            // Clear the session storage
            try {
                sessionStorage.removeItem(sessionKey);
            } catch (error) {
                console.error("Error clearing sessionStorage:", error);
            }
        }
    };

    // Initialize component state from sessionStorage to persist across reloads
    useEffect(() => {
        try {
            const storedState = sessionStorage.getItem(sessionKey);
            if (storedState) {
                const { hadCameraAccess } = JSON.parse(storedState);
                if (hadCameraAccess) {
                    setShowCameraPrompt(false);
                    setIframeVisible(true);
                }
            }
        } catch (error) {
            console.error("Error reading from sessionStorage:", error);
        }
    }, [sessionKey]);

    // Handle route changes and page reloads
    useEffect(() => {
        // When component loads or route changes, reset any errors
        setErrorMessage("");
        
        // Save state before unloading
        const handleBeforeUnload = () => {
            try {
                const stateToStore = {
                    hadCameraAccess: iframeVisible,
                    timestamp: Date.now()
                };
                sessionStorage.setItem(sessionKey, JSON.stringify(stateToStore));
            } catch (error) {
                console.error("Error saving to sessionStorage:", error);
            }
        };
        
        window.addEventListener('beforeunload', handleBeforeUnload);
        
        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
            handleBeforeUnload(); // Save state when component unmounts
        };
    }, [location.pathname, iframeVisible, sessionKey]);
    
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

    // Listen for iframe error events
    useEffect(() => {
        const handleIframeError = () => {
            setErrorMessage("There was a problem loading RepBot. Please try refreshing.");
            setIsLoading(false);
        };

        const iframe = iframeRef.current;
        if (iframe) {
            iframe.addEventListener("error", handleIframeError);
            
            // Handle messages from the iframe
            const handleMessage = (event) => {
                // Check if the message is from our iframe
                if (event.data && typeof event.data === 'string') {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'error' && data.message) {
                            setErrorMessage(data.message);
                            setIsLoading(false);
                        }
                    } catch (e) {
                        // Not a JSON message, ignore
                    }
                }
            };
            
            window.addEventListener('message', handleMessage);

            return () => {
                iframe.removeEventListener("error", handleIframeError);
                window.removeEventListener('message', handleMessage);
            };
        }
    }, [iframeVisible]);

    const handleCameraAccess = async () => {
        try {
            setErrorMessage("");
            
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
            
            // Save the camera access permission to session storage
            try {
                const stateToStore = {
                    hadCameraAccess: true,
                    timestamp: Date.now()
                };
                sessionStorage.setItem(sessionKey, JSON.stringify(stateToStore));
            } catch (error) {
                console.error("Error saving to sessionStorage:", error);
            }
        } catch (error) {
            console.error("Camera access error:", error);
            // Show specific error message based on the error type
            if (error.name === "NotAllowedError") {
                setErrorMessage("Camera access was denied. Please enable camera access in your browser settings and try again.");
            } else if (error.name === "NotFoundError") {
                setErrorMessage("No camera was found. Please ensure your device has a working camera and try again.");
            } else {
                setErrorMessage(`Camera error: ${error.message}`);
            }
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
                    {errorMessage && (
                        <button
                            className="flex items-center gap-2 rounded-lg bg-green-500 px-4 py-2 text-white transition-colors hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700"
                            onClick={resetIframe}
                        >
                            <RefreshCw size={18} />
                            <span className="hidden sm:inline">Reload</span>
                        </button>
                    )}
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
                    {showCameraPrompt && !errorMessage && (
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

                    {/* Error message */}
                    {errorMessage && (
                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-900/80">
                            <div className="max-w-md rounded-xl bg-white p-6 text-center dark:bg-slate-800">
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-500">
                                    <RefreshCw size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                    Something went wrong
                                </h3>
                                <p className="mt-2 text-slate-600 dark:text-slate-300">
                                    {errorMessage}
                                </p>
                                <button
                                    onClick={resetIframe}
                                    className="mt-4 w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                                >
                                    Try Again
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Loading indicator */}
                    {isLoading && iframeVisible && !errorMessage && (
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
                            ref={iframeRef}
                            src={`https://render-repbot.vercel.app/?session=${sessionKey}`}
                            className="h-full w-full border-0"
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setErrorMessage("Failed to load RepBot. Please try again.");
                                setIsLoading(false);
                            }}
                            title="RepBot Exercise Tracker"
                            allow="camera *; microphone *; accelerometer; gyroscope"
                            allowFullScreen
                            referrerPolicy="origin"
                            sandbox="allow-scripts allow-same-origin allow-forms allow-modals allow-popups allow-downloads"
                        />
                    )}
                </div>
            </div>

            {!isFullscreen && <Footer />}
        </div>
    );
};

export default RepBotPage;
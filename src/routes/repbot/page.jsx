import { useState, useEffect, useRef } from "react";
import { Maximize2, Minimize2, Camera, RefreshCw, Video } from "lucide-react";
import { cn } from "@/utils/cn";
import { Footer } from "@/layouts/footer";
import { useLocation } from "react-router-dom";

const RepBotPage = () => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showCameraPrompt, setShowCameraPrompt] = useState(true);
    const [iframeVisible, setIframeVisible] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [cameraStream, setCameraStream] = useState(null);
    const videoRef = useRef(null);
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
        
        // Stop any existing camera stream
        if (cameraStream) {
            cameraStream.getTracks().forEach(track => track.stop());
            setCameraStream(null);
        }
        
        // If the iframe is already visible, reload it
        if (iframeVisible && iframeRef.current) {
            // Add timestamp to force a complete reload without caching
            const currentSrc = iframeRef.current.src.split('?')[0];
            iframeRef.current.src = `${currentSrc}?t=${Date.now()}`;
        }
        
        // Show the camera prompt again
        setShowCameraPrompt(true);
        setIframeVisible(false);
        
        // Clear the session storage
        try {
            sessionStorage.removeItem(sessionKey);
        } catch (error) {
            console.error("Error clearing sessionStorage:", error);
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
            
            // Clean up any camera streams
            if (cameraStream) {
                cameraStream.getTracks().forEach(track => track.stop());
            }
        };
    }, [location.pathname, iframeVisible, sessionKey, cameraStream]);
    
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
        const iframe = iframeRef.current;
        if (iframe && iframeVisible) {
            const handleIframeError = () => {
                setErrorMessage("There was a problem loading RepBot. Please try refreshing.");
                setIsLoading(false);
            };
            
            // Handle messages from the iframe
            const handleMessage = (event) => {
                // Check if the message is from our iframe
                if (event.data && typeof event.data === 'string') {
                    try {
                        const data = JSON.parse(event.data);
                        if (data.type === 'error' && data.message) {
                            setErrorMessage(data.message);
                            setIsLoading(false);
                        } else if (data.type === 'loaded') {
                            setIsLoading(false);
                        }
                    } catch (e) {
                        // Not a JSON message, ignore
                    }
                }
            };
            
            iframe.addEventListener("error", handleIframeError);
            window.addEventListener('message', handleMessage);

            return () => {
                iframe.removeEventListener("error", handleIframeError);
                window.removeEventListener('message', handleMessage);
            };
        }
    }, [iframeVisible]);

    // New direct camera feed component
    const DirectCameraFeed = () => {
        useEffect(() => {
            if (videoRef.current && cameraStream) {
                videoRef.current.srcObject = cameraStream;
            }
        }, []);

        return (
            <div className="flex h-full flex-col items-center justify-center">
                <video 
                    ref={videoRef} 
                    autoPlay 
                    muted 
                    playsInline
                    className="h-full max-h-[80vh] w-auto rounded-lg border border-slate-300 dark:border-slate-700"
                />
            </div>
        );
    };

    const handleCameraAccess = async () => {
        try {
            setErrorMessage("");
            console.log("Requesting camera access...");
            
            // Check if MediaDevices API is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error("Your browser doesn't support camera access. Try a different browser.");
            }
            
            // Request camera access with specific constraints to help on mobile
            const stream = await navigator.mediaDevices.getUserMedia({ 
                video: {
                    width: { ideal: 1280 },
                    height: { ideal: 720 },
                    facingMode: "user" // Prefer front camera on mobile
                },
                audio: false
            });
            
            // Keep the stream active
            setCameraStream(stream);
            console.log("Camera access granted successfully");
            
            // For the iframe approach
            setShowCameraPrompt(false);
            setIframeVisible(true);
            
            // Save the camera access permission to session storage
            try {
                sessionStorage.setItem(sessionKey, JSON.stringify({
                    hadCameraAccess: true,
                    timestamp: Date.now()
                }));
            } catch (error) {
                console.error("Error saving to sessionStorage:", error);
            }
        } catch (error) {
            console.error("Camera access error:", error);
            let message = "Unknown camera error occurred.";
            
            // Show specific error message based on the error type
            if (error.name === "NotAllowedError" || error.name === "PermissionDeniedError") {
                message = "Camera access was denied. Please check your browser settings and try again.";
            } else if (error.name === "NotFoundError") {
                message = "No camera was found. Please connect a camera and try again.";
            } else if (error.name === "NotReadableError" || error.name === "TrackStartError") {
                message = "Your camera is currently in use by another application. Please close other camera apps and try again.";
            } else if (error.name === "OverconstrainedError") {
                message = "Your camera doesn't meet the required constraints. Please try a different camera.";
            } else if (error.name === "SecurityError") {
                message = "Camera access is restricted due to security policies. Try using HTTPS or a different browser.";
            } else if (error.message) {
                message = `Camera error: ${error.message}`;
            }
            
            setErrorMessage(message);
            console.log(`Camera error details: ${error.name}: ${error.message}`);
        }
    };

    // Direct camera access as fallback
    const useDirect = () => {
        handleCameraAccess().then(() => {
            setIframeVisible(false);
            setErrorMessage("");
        });
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
                            <span className="hidden sm:inline">Try Again</span>
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
                                <div className="mt-4 flex flex-col gap-2">
                                    <button
                                        onClick={handleCameraAccess}
                                        className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                                    >
                                        Allow Camera Access
                                    </button>
                                    <div className="mt-2 flex items-center justify-center">
                                        <span className="text-xs text-slate-500 dark:text-slate-400">
                                            Having trouble? Try 
                                            <button 
                                                onClick={useDirect} 
                                                className="ml-1 text-blue-500 hover:underline dark:text-blue-400"
                                            >
                                                direct camera mode
                                            </button>
                                        </span>
                                    </div>
                                </div>
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
                                <div className="mt-4 flex flex-col gap-2">
                                    <button
                                        onClick={resetIframe}
                                        className="w-full rounded-lg bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600"
                                    >
                                        Try Again
                                    </button>
                                    <button
                                        onClick={useDirect}
                                        className="w-full rounded-lg bg-slate-200 px-4 py-2 font-medium text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
                                    >
                                        <Video size={16} className="mr-2 inline-block" />
                                        Use Direct Camera Mode
                                    </button>
                                </div>
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
                    
                    {/* Direct camera view */}
                    {cameraStream && !iframeVisible && !errorMessage && (
                        <DirectCameraFeed />
                    )}
                    
                    {/* RepBot iframe */}
                    {iframeVisible && (
                        <iframe
                            ref={iframeRef}
                            src={`https://render-repbot.vercel.app/?session=${sessionKey}`}
                            className="h-full w-full border-0"
                            onLoad={() => setIsLoading(false)}
                            onError={() => {
                                setErrorMessage("Failed to load RepBot. Please try again or use direct camera mode.");
                                setIsLoading(false);
                            }}
                            title="RepBot Exercise Tracker"
                            allow="camera *; microphone *; accelerometer; gyroscope; autoplay; clipboard-write"
                            allowFullScreen
                            referrerPolicy="origin"
                        />
                    )}
                </div>
            </div>

            {!isFullscreen && <Footer />}
        </div>
    );
};

export default RepBotPage;
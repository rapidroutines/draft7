import { useState, useEffect } from "react";
import RepBotIntegration from "./RepBotIntegration";

const RepBotPage = () => {
    // Add MediaPipe scripts dynamically
    useEffect(() => {
        // Helper function to load scripts in sequence
        const loadScript = (src) => {
            return new Promise((resolve, reject) => {
                const script = document.createElement('script');
                script.src = src;
                script.crossOrigin = "anonymous";
                script.onload = () => resolve();
                script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
                document.head.appendChild(script);
            });
        };

        // Load scripts in the required order
        const loadScripts = async () => {
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js');
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js');
                await loadScript('https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js');
            } catch (error) {
                console.error("Failed to load MediaPipe scripts:", error);
            }
        };

        loadScripts();

        // Clean up scripts on unmount
        return () => {
            // Optional: remove scripts if needed
        };
    }, []);

    return (
        <div className="flex flex-col gap-y-4">
            
            <div className="flex items-center justify-between">
                <h1 className="title">RepBot Exercise Counter</h1>
            </div>
            
            <p className="text-slate-600">
                RepBot uses your camera to count repetitions of various exercises. Position yourself so that your full body is visible.
            </p>
            
            <RepBotIntegration />
            
            <div className="bg-white p-4 rounded-lg shadow-sm mt-4">
                <h3 className="font-medium text-slate-900 mb-2">Tips for best results:</h3>
                <ul className="list-disc pl-5 text-slate-600 space-y-1">
                    <li>Make sure you have good lighting</li>
                    <li>Position your camera so your full body is visible</li>
                    <li>Wear clothing that contrasts with your background</li>
                    <li>Keep at least 6 feet (2 meters) away from the camera</li>
                    <li>For best results, use a webcam rather than a mobile device</li>
                </ul>
            </div>
        </div>
    );
};

export default RepBotPage;
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Camera, Check, ChevronLeft, RefreshCw, AlertTriangle } from "lucide-react";
import WorkoutSummaryModal from "@/components/workout-summary-modal";
import WorkoutService from "@/services/workout-service";

// Import required MediaPipe libraries (these will need to be added to your package.json)
// You can include these via CDN in your index.html instead if preferred

const RepBotIntegration = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [cameraActive, setCameraActive] = useState(false);
    const [exerciseType, setExerciseType] = useState("bicepCurl");
    const [repCount, setRepCount] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [currentWorkout, setCurrentWorkout] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [isWorkoutFinished, setIsWorkoutFinished] = useState(false);
    const [exerciseProgress, setExerciseProgress] = useState([]);
    const [sessionId, setSessionId] = useState('');
    
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const cameraRef = useRef(null);
    const poseRef = useRef(null);
    const navigate = useNavigate();
    
    // Generate a session ID on component mount
    useEffect(() => {
        const newSessionId = 'user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now();
        setSessionId(newSessionId);
        console.log("Session ID created:", newSessionId);
    }, []);

    // Initialize MediaPipe Pose detection
    useEffect(() => {
        const loadMediaPipe = async () => {
            try {
                setIsLoading(true);
                
                // Check if MediaPipe libraries are available
                if (!window.Pose) {
                    setErrorMessage("MediaPipe libraries not loaded. Please check your connection.");
                    setIsLoading(false);
                    return;
                }
                
                // Initialize MediaPipe Pose
                poseRef.current = new window.Pose({
                    locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
                });
                
                poseRef.current.setOptions({
                    modelComplexity: 1,
                    smoothLandmarks: true,
                    minDetectionConfidence: 0.5,
                    minTrackingConfidence: 0.5
                });
                
                poseRef.current.onResults(onResults);
                
                setIsLoading(false);
            } catch (error) {
                console.error("Error initializing MediaPipe:", error);
                setErrorMessage("Failed to initialize exercise detection. Please refresh and try again.");
                setIsLoading(false);
            }
        };
        
        loadMediaPipe();
        
        // Clean up MediaPipe on unmount
        return () => {
            if (poseRef.current) {
                poseRef.current.close();
            }
            
            if (cameraRef.current) {
                cameraRef.current.stop();
            }
        };
    }, []);
    
    // Handle pose detection results
    const onResults = (results) => {
        if (!canvasRef.current || !results.poseLandmarks) return;
        
        const ctx = canvasRef.current.getContext('2d');
        const width = canvasRef.current.width;
        const height = canvasRef.current.height;
        
        // Clear canvas
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections and landmarks
        if (window.drawConnectors && window.drawLandmarks) {
            window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
                color: '#1E628C',
                lineWidth: 2
            });
            
            window.drawLandmarks(ctx, results.poseLandmarks, {
                color: '#FF0000',
                lineWidth: 1,
                radius: 3
            });
        }
        
        // Send landmarks to backend for processing
        sendLandmarksToBackend(results.poseLandmarks);
    };
    
    // Start camera with MediaPipe
    const startCamera = async () => {
        try {
            if (!poseRef.current) {
                setErrorMessage("Exercise detection not initialized. Please refresh and try again.");
                return;
            }
            
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                setErrorMessage("Camera access is not supported in this browser.");
                return;
            }
            
            const constraints = {
                video: {
                    facingMode: 'environment',
                    width: { ideal: 1280 },
                    height: { ideal: 720 }
                }
            };
            
            const stream = await navigator.mediaDevices.getUserMedia(constraints);
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                
                videoRef.current.onloadedmetadata = () => {
                    videoRef.current.play().then(() => {
                        if (!canvasRef.current) return;
                        
                        // Set canvas dimensions to match video
                        canvasRef.current.width = videoRef.current.clientWidth;
                        canvasRef.current.height = videoRef.current.clientHeight;
                        
                        // Initialize camera with MediaPipe
                        cameraRef.current = new window.Camera(videoRef.current, {
                            onFrame: async () => {
                                if (poseRef.current) {
                                    await poseRef.current.send({image: videoRef.current});
                                }
                            },
                            width: 1280,
                            height: 720
                        });
                        
                        cameraRef.current.start().then(() => {
                            setCameraActive(true);
                            resetExerciseData();
                        });
                    });
                };
            }
        } catch (error) {
            console.error("Error starting camera:", error);
            setErrorMessage("Failed to access camera. Please ensure you've granted camera permissions.");
        }
    };
    
    // Stop camera
    const stopCamera = () => {
        if (cameraRef.current) {
            cameraRef.current.stop();
        }
        
        if (videoRef.current && videoRef.current.srcObject) {
            const tracks = videoRef.current.srcObject.getTracks();
            tracks.forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        
        setCameraActive(false);
    };
    
    // Reset exercise data
    const resetExerciseData = () => {
        setRepCount(0);
        setFeedback("");
        setExerciseProgress([]);
        setIsWorkoutFinished(false);
    };
    
    // Change exercise type
    const handleExerciseChange = (e) => {
        setExerciseType(e.target.value);
        resetExerciseData();
    };
    
    // Send landmarks to backend for processing
    const sendLandmarksToBackend = async (landmarks) => {
        try {
            const response = await fetch("https://render-chatbot1-a8hc.onrender.com/process_landmarks", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    landmarks: landmarks,
                    exerciseType: exerciseType,
                    sessionId: sessionId
                }),
                mode: 'cors'
            });
            
            if (!response.ok) {
                throw new Error(`Server responded with status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Update UI based on response
            if (result.repCounter !== undefined && repCount !== result.repCounter) {
                setRepCount(result.repCounter);
                
                // Add to exercise progress
                setExerciseProgress(prev => [
                    ...prev,
                    {
                        name: getExerciseName(exerciseType),
                        reps: 1,
                        timestamp: new Date().toISOString()
                    }
                ]);
                
                // Check if workout is finished (set a threshold of 10 reps)
                if (result.repCounter >= 10 && !isWorkoutFinished) {
                    finishWorkout();
                }
            }
            
            if (result.feedback) {
                setFeedback(result.feedback);
            }
        } catch (error) {
            console.error('Error sending landmarks to backend:', error);
            setFeedback(`Connection error: ${error.message}`);
        }
    };
    
    // Finish workout and save data
    const finishWorkout = () => {
        setIsWorkoutFinished(true);
        
        // Create workout summary
        const workout = {
            id: `workout_${Date.now()}`,
            date: new Date().toISOString(),
            duration: Math.floor(Math.random() * 300) + 300, // Random duration between 5-10 minutes
            exercises: []
        };
        
        // Group exercises by name and sum reps
        const exercisesMap = {};
        
        exerciseProgress.forEach(exercise => {
            if (!exercisesMap[exercise.name]) {
                exercisesMap[exercise.name] = 0;
            }
            exercisesMap[exercise.name] += exercise.reps;
        });
        
        // Convert to array
        workout.exercises = Object.entries(exercisesMap).map(([name, reps]) => ({
            name,
            reps
        }));
        
        // Ensure we have at least the current exercise
        if (workout.exercises.length === 0) {
            workout.exercises.push({
                name: getExerciseName(exerciseType),
                reps: repCount
            });
        }
        
        // Save workout
        WorkoutService.saveWorkout(workout);
        
        // Set current workout for modal
        setCurrentWorkout(workout);
        
        // Show modal
        setShowModal(true);
    };
    
    // Get proper exercise name
    const getExerciseName = (exerciseType) => {
        const exerciseNames = {
            'bicepCurl': 'Bicep Curls',
            'squat': 'Squats',
            'pushup': 'Push-ups',
            'shoulderPress': 'Shoulder Press',
            'tricepExtension': 'Tricep Extensions',
            'lunge': 'Lunges',
            'calfRaises': 'Calf Raises'
        };
        
        return exerciseNames[exerciseType] || exerciseType;
    };
    
    // Handle modal actions
    const handleCloseModal = () => {
        setShowModal(false);
    };
    
    const handleViewHistory = () => {
        setShowModal(false);
        navigate('/exercise-tracker');
    };
    
    return (
        <div className="flex flex-col h-[calc(100vh-120px)] gap-4">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center bg-white p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2">
                    <select 
                        value={exerciseType}
                        onChange={handleExerciseChange}
                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                        disabled={cameraActive}
                    >
                        <option value="bicepCurl">Bicep Curls</option>
                        <option value="squat">Squats</option>
                        <option value="pushup">Push-ups</option>
                        <option value="shoulderPress">Shoulder Press</option>
                        <option value="tricepExtension">Tricep Extensions</option>
                        <option value="lunge">Lunges</option>
                        <option value="calfRaises">Calf Raises</option>
                    </select>
                    
                    {cameraActive ? (
                        <button 
                            onClick={stopCamera}
                            className="flex items-center gap-2 rounded-lg bg-red-500 px-3 py-2 text-sm font-medium text-white hover:bg-red-600"
                        >
                            <ChevronLeft className="h-4 w-4" />
                            <span>Stop Camera</span>
                        </button>
                    ) : (
                        <button 
                            onClick={startCamera}
                            className="flex items-center gap-2 rounded-lg bg-[#1e628c] px-3 py-2 text-sm font-medium text-white hover:bg-[#174e70]"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Camera className="h-4 w-4" />
                            )}
                            <span>Start Camera</span>
                        </button>
                    )}
                </div>
                
                <div className="flex items-center gap-3">
                    <div className="text-center">
                        <div className="text-sm text-slate-500">Reps</div>
                        <div className="text-2xl font-bold text-[#1e628c]">{repCount}</div>
                    </div>
                    
                    <button 
                        onClick={resetExerciseData}
                        className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
                        disabled={!cameraActive || repCount === 0}
                    >
                        <RefreshCw className="h-4 w-4" />
                        <span>Reset</span>
                    </button>
                    
                    <button 
                        onClick={finishWorkout}
                        className="flex items-center gap-1 rounded-lg bg-green-500 px-3 py-2 text-sm font-medium text-white hover:bg-green-600"
                        disabled={!cameraActive || repCount === 0}
                    >
                        <Check className="h-4 w-4" />
                        <span>Finish</span>
                    </button>
                </div>
            </div>
            
            {/* Video and canvas container */}
            <div className="relative flex-1 w-full bg-black rounded-lg overflow-hidden">
                {errorMessage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 p-4 z-10">
                        <div className="bg-orange-100 p-3 rounded-full mb-3">
                            <AlertTriangle className="h-8 w-8 text-orange-500" />
                        </div>
                        <p className="text-white text-center max-w-md">{errorMessage}</p>
                        <button 
                            onClick={() => window.location.reload()}
                            className="mt-4 bg-white text-slate-900 px-4 py-2 rounded-md"
                        >
                            Refresh Page
                        </button>
                    </div>
                )}
                
                {isLoading && !errorMessage && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/90 z-10">
                        <div className="flex flex-col items-center">
                            <Loader2 className="h-10 w-10 animate-spin text-white" />
                            <p className="mt-2 text-white">Initializing exercise detection...</p>
                        </div>
                    </div>
                )}
                
                {!cameraActive && !isLoading && !errorMessage && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/90 z-10">
                        <div className="bg-[#1e628c]/20 p-4 rounded-full mb-4">
                            <Camera className="h-12 w-12 text-white" />
                        </div>
                        <p className="text-white text-center max-w-md">
                            Select an exercise type and click "Start Camera" to begin tracking your workout
                        </p>
                    </div>
                )}
                
                <video 
                    ref={videoRef}
                    className="w-full h-full object-contain" 
                    playsinline="true"
                ></video>
                
                <canvas 
                    ref={canvasRef}
                    className="absolute top-0 left-0 w-full h-full"
                ></canvas>
                
                {/* Feedback display */}
                {cameraActive && feedback && (
                    <div className="absolute top-4 left-0 right-0 mx-auto w-max bg-black/50 text-white px-4 py-2 rounded-lg">
                        {feedback}
                    </div>
                )}
                
                {/* Rep counter display */}
                {cameraActive && (
                    <div className="absolute bottom-4 right-4 bg-[#1e628c] text-white text-3xl font-bold rounded-full h-16 w-16 flex items-center justify-center">
                        {repCount}
                    </div>
                )}
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

export default RepBotIntegration;
import { useState, useEffect, useRef } from "react";

const ExerciseCounter = () => {
  // References for DOM elements
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  
  // State variables
  const [repCounter, setRepCounter] = useState(0);
  const [stage, setStage] = useState("down");
  const [feedback, setFeedback] = useState("");
  const [exerciseType, setExerciseType] = useState("bicepCurl");
  const [cameraStarted, setCameraStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // MediaPipe and camera instances
  const poseRef = useRef(null);
  const cameraRef = useRef(null);
  
  // Session ID for backend
  const sessionIdRef = useRef('user_' + Math.random().toString(36).substr(2, 9) + '_' + Date.now());
  
  // Backend URL
  const backendUrl = "https://render-chatbot1-a8hc.onrender.com";
  
  // Movement detection variables
  const lastLandmarksRef = useRef(null);
  const noMovementFramesRef = useRef(0);
  const movementThreshold = 0.05;
  const maxNoMovementFrames = 150;
  const keyPoints = [0, 11, 12, 13, 14, 15, 16, 23, 24, 25, 26, 27, 28]; // Head, shoulders, arms, hips, legs
  
  // Inactivity tracking
  const lastActivityTimeRef = useRef(Date.now());
  const inactivityTimeout = 180000; // 3 minutes
  const inactivityTimerRef = useRef(null);

  // Define a function to check if MediaPipe scripts are loaded
  const areMediaPipeScriptsLoaded = () => {
    return window.Pose && window.Camera && window.drawConnectors && 
           window.drawLandmarks && window.POSE_CONNECTIONS;
  };

  // Define a function to load MediaPipe scripts dynamically via script tags
  const loadMediaPipeScripts = () => {
    return new Promise((resolve, reject) => {
      // Only load if not already loaded
      if (areMediaPipeScriptsLoaded()) {
        return resolve();
      }

      let scriptsLoaded = 0;
      const totalScripts = 3;
      const scriptUrls = [
        "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
        "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
      ];

      const onScriptLoad = () => {
        scriptsLoaded++;
        if (scriptsLoaded === totalScripts) {
          // Give a little time for scripts to initialize
          setTimeout(() => {
            if (areMediaPipeScriptsLoaded()) {
              resolve();
            } else {
              reject(new Error("MediaPipe scripts loaded but objects not available"));
            }
          }, 500);
        }
      };

      scriptUrls.forEach(url => {
        const script = document.createElement('script');
        script.src = url;
        script.crossOrigin = "anonymous";
        script.onload = onScriptLoad;
        script.onerror = () => reject(new Error(`Failed to load script: ${url}`));
        document.head.appendChild(script);
      });

      // Set a timeout in case scripts never load
      setTimeout(() => {
        if (scriptsLoaded < totalScripts) {
          reject(new Error("Timed out waiting for MediaPipe scripts to load"));
        }
      }, 10000); // 10 second timeout
    });
  };

  // Initialize pose detection
  useEffect(() => {
    const initializePose = async () => {
      try {
        // First check if MediaPipe is already available globally
        if (!areMediaPipeScriptsLoaded()) {
          console.log('MediaPipe not found in global scope, loading scripts...');
          try {
            // Try to load via script tags
            await loadMediaPipeScripts();
            console.log('MediaPipe scripts loaded successfully');
          } catch (scriptError) {
            console.warn('Failed to load MediaPipe via script tags:', scriptError);
            
            // Try dynamic imports as a last resort
            try {
              console.log('Trying dynamic imports...');
              const poseModule = await import("@mediapipe/pose");
              const cameraModule = await import("@mediapipe/camera_utils");
              const drawingModule = await import("@mediapipe/drawing_utils");
              
              window.Pose = poseModule.Pose;
              window.Camera = cameraModule.Camera;
              window.drawConnectors = drawingModule.drawConnectors;
              window.drawLandmarks = drawingModule.drawLandmarks;
              window.POSE_CONNECTIONS = drawingModule.POSE_CONNECTIONS;
            } catch (importError) {
              console.error('Dynamic imports also failed:', importError);
              throw new Error('Could not load MediaPipe libraries. Please try a different browser.');
            }
          }
        } else {
          console.log('MediaPipe already available in global scope');
        }
        
        // Ensure we have all the required objects
        if (!window.Pose || !window.drawConnectors || !window.drawLandmarks || !window.POSE_CONNECTIONS) {
          throw new Error('Required MediaPipe libraries not available');
        }
        
        console.log('Initializing MediaPipe Pose...');
        const pose = new window.Pose({
          locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`
        });

        pose.setOptions({
          modelComplexity: 1,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });

        pose.onResults(onResults);
        poseRef.current = pose;
        
        console.log('MediaPipe initialized successfully');
      } catch (error) {
        console.error("Error initializing pose detection:", error);
        setErrorMessage(`Failed to initialize pose detection: ${error.message}. Please try a different browser or ensure your camera is accessible.`);
      }
    };

    initializePose();
    
    // Clean up function
    return () => {
      if (cameraRef.current) {
        cameraRef.current.stop();
      }
      if (inactivityTimerRef.current) {
        clearTimeout(inactivityTimerRef.current);
      }
    };
  }, []);

  // Canvas resize handler
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current && containerRef.current) {
        canvasRef.current.width = containerRef.current.clientWidth;
        canvasRef.current.height = containerRef.current.clientHeight;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize size
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Exercise change handler
  const handleExerciseChange = (e) => {
    const newExerciseType = e.target.value;
    console.log("Exercise changed to:", newExerciseType);
    setExerciseType(newExerciseType);
    setRepCounter(0);
    setStage("down");
    setFeedback("");
    resetInactivityTimer();
  };

  // Start camera handler
  const startCamera = async () => {
    try {
      setCameraStarted(true);
      console.log("Starting camera...");

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('getUserMedia is not supported in this browser');
      }

      // First, make sure the Pose model is initialized
      if (!poseRef.current) {
        console.log("Waiting for pose detection to initialize first...");
        // Wait a bit more for initialization to complete
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        if (!poseRef.current) {
          throw new Error('Pose detection not initialized properly. Please refresh the page.');
        }
      }

      // Get user media constraints prioritizing the back camera on mobile
      const constraints = {
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      };

      console.log("Requesting camera permissions...");
      // Get user media stream
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      console.log("Camera permission granted");
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      } else {
        throw new Error('Video element not found');
      }

      // Wait for video to be ready
      await new Promise((resolve, reject) => {
        if (videoRef.current) {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(resolve)
              .catch(err => {
                console.error("Error playing video:", err);
                reject(new Error('Could not play video: ' + err.message));
              });
          };
          
          // Add a timeout in case metadata never loads
          setTimeout(() => {
            reject(new Error('Video metadata loading timed out'));
          }, 5000);
        } else {
          reject(new Error('Video element not found'));
        }
      });

      let Camera;
      // Try to get Camera from window first (CDN)
      if (window.Camera) {
        Camera = window.Camera;
        console.log("Using Camera from CDN");
      } else {
        // Import Camera class dynamically as fallback
        try {
          const cameraModule = await import("@mediapipe/camera_utils");
          Camera = cameraModule.Camera;
          console.log("Using Camera from dynamic import");
        } catch (err) {
          console.error("Error importing Camera:", err);
          throw new Error('Could not load Camera API. Please try a different browser.');
        }
      }

      if (!Camera) {
        throw new Error('Camera API not available');
      }

      // Setup the camera with MediaPipe
      if (videoRef.current && poseRef.current) {
        console.log("Creating camera instance...");
        
        // Create camera with error handling
        try {
          const camera = new Camera(videoRef.current, {
            onFrame: async () => {
              try {
                if (poseRef.current && videoRef.current) {
                  await poseRef.current.send({ image: videoRef.current });
                }
              } catch (frameError) {
                console.error("Error in onFrame:", frameError);
              }
            },
            width: 1280,
            height: 720
          });

          console.log("Starting camera...");
          await camera.start();
          cameraRef.current = camera;
          console.log("Camera started successfully");

          // Start inactivity timer
          startInactivityTimer();
        } catch (cameraError) {
          console.error("Error setting up camera:", cameraError);
          throw new Error('Could not initialize camera: ' + cameraError.message);
        }
      } else {
        throw new Error('Video or pose not initialized');
      }
    } catch (error) {
      console.error('Error starting camera:', error);
      setErrorMessage(error.message || 'Unknown camera error');
      setCameraStarted(false);
    }
  };

  // Results handler for pose detection
  const onResults = (results) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    
    // Clear canvas
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);

    // Draw pose landmarks
    if (results.poseLandmarks) {
      // Draw connections first - make sure they're blue just like the render version
      window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
        color: '#1E628C', // This is the blue color used in the original app
        lineWidth: 3 // Slightly thicker lines for better visibility
      });
      
      // Draw landmarks as small red dots
      window.drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: 3
      });

      // Check for movement
      detectMovement(results.poseLandmarks);

      // Send landmarks to backend for processing
      sendLandmarksToBackend(results.poseLandmarks);
    }
  };

  // Detect movement in the pose landmarks
  const detectMovement = (landmarks) => {
    // If no previous landmarks, store current ones and return
    if (!lastLandmarksRef.current) {
      lastLandmarksRef.current = JSON.parse(JSON.stringify(landmarks));
      return;
    }

    // Check if there's significant movement between frames
    let movement = false;
    
    // Check key landmarks for movement
    for (const i of keyPoints) {
      if (landmarks[i] && lastLandmarksRef.current[i]) {
        const dx = landmarks[i].x - lastLandmarksRef.current[i].x;
        const dy = landmarks[i].y - lastLandmarksRef.current[i].y;
        // Using square of distance to avoid expensive square root operation
        const distanceSquared = dx*dx + dy*dy;
        
        if (distanceSquared > movementThreshold * movementThreshold) {
          movement = true;
          break;
        }
      }
    }

    // Update movement counter
    if (movement) {
      noMovementFramesRef.current = 0;
      resetInactivityTimer(); // Reset inactivity timer on movement
    } else {
      noMovementFramesRef.current++;
      
      // If no movement for maxNoMovementFrames consecutive frames, consider inactive
      if (noMovementFramesRef.current >= maxNoMovementFrames) {
        checkInactivity();
      }
    }

    // Store current landmarks for next comparison
    lastLandmarksRef.current = JSON.parse(JSON.stringify(landmarks));
  };

  // Send landmark data to backend
  const sendLandmarksToBackend = async (landmarks) => {
    try {
      // Prepare the data to send
      const data = {
        landmarks: landmarks,
        exerciseType: exerciseType,
        sessionId: sessionIdRef.current
      };

      // Send the data to the backend
      const response = await fetch(`${backendUrl}/process_landmarks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors'
      });

      if (!response.ok) {
        throw new Error(`Server responded with status: ${response.status}`);
      }

      // Process the response
      const result = await response.json();
      
      // If exercise is being performed (rep count increases), reset inactivity
      if (result.repCounter !== undefined && repCounter !== result.repCounter) {
        resetInactivityTimer();
        setRepCounter(result.repCounter);
      }
      
      updateUIFromResponse(result);
    } catch (error) {
      console.error('Error sending landmarks to backend:', error);
      setFeedback(`Connection error: ${error.message}`);
    }
  };

  // Update UI based on backend response
  const updateUIFromResponse = (result) => {
    // Update rep counter if changed
    if (result.repCounter !== undefined && repCounter !== result.repCounter) {
      // Exercise rep count increased
      const newRepCount = result.repCounter;
      setRepCounter(newRepCount);
      
      // Log rep to Exercise Tracker if rep was just completed
      if (newRepCount > repCounter) {
        logExerciseToTracker(exerciseType, newRepCount);
      }
    }

    // Update stage if changed
    if (result.stage !== undefined) {
      setStage(result.stage);
    }

    // Display feedback if available
    if (result.feedback) {
      setFeedback(result.feedback);
    }

    // Display angles or other visual feedback if provided
    if (result.angles && canvasRef.current) {
      displayAngles(result.angles);
    }
  };
  
  // State for showing rep logged notification
  const [showRepLogged, setShowRepLogged] = useState(false);
  
  // Function to log exercise reps to the Exercise Tracker
  const logExerciseToTracker = (exerciseType, repCount) => {
    try {
      // Get existing tracker data from localStorage or initialize empty array
      const trackerKey = 'exerciseTrackerData';
      const existingData = localStorage.getItem(trackerKey);
      const trackerData = existingData ? JSON.parse(existingData) : [];
      
      // Format exercise name for display (convert camelCase to Title Case)
      const formatExerciseName = (name) => {
        return name
          .replace(/([A-Z])/g, ' $1') // Add space before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
      };
      
      // Create new tracker entry
      const newEntry = {
        id: Date.now(), // Unique ID based on timestamp
        exercise: formatExerciseName(exerciseType),
        reps: 1, // Count as 1 rep each time
        date: new Date().toISOString(),
        sets: Math.ceil(repCount / 5) // Assume a new set every 5 reps
      };
      
      // Add to tracker data
      trackerData.push(newEntry);
      
      // Save back to localStorage
      localStorage.setItem(trackerKey, JSON.stringify(trackerData));
      
      console.log(`Logged ${newEntry.exercise} rep to Exercise Tracker`);
      
      // Show notification that rep was logged
      setShowRepLogged(true);
      setTimeout(() => {
        setShowRepLogged(false);
      }, 2000); // Hide notification after 2 seconds
      
    } catch (error) {
      console.error('Error logging exercise to tracker:', error);
    }
  };

  // Display angles on the canvas
  const displayAngles = (angles) => {
    if (!canvasRef.current) return;
    
    const ctx = canvasRef.current.getContext('2d');
    
    // Display angles directly on the body parts
    ctx.font = "bold 16px Arial";
    ctx.lineWidth = 3;
    
    // Loop through all the angles and display them at their respective positions
    for (const [key, data] of Object.entries(angles)) {
      if (data.position && data.value !== undefined) {
        // Convert normalized coordinates to canvas coordinates
        const x = data.position.x * canvasRef.current.width;
        const y = data.position.y * canvasRef.current.height;
        
        // Create background for better visibility
        const text = `${key}: ${Math.round(data.value)}°`;
        const textWidth = ctx.measureText(text).width;
        
        // Draw background rectangle
        ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        ctx.fillRect(x - textWidth/2 - 5, y - 20, textWidth + 10, 25);
        
        // Draw text
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, x, y - 7);
      }
    }
  };

  // Inactivity timer functions
  const startInactivityTimer = () => {
    resetInactivityTimer();
    console.log("Inactivity timer started");
  };

  const resetInactivityTimer = () => {
    // Clear existing timer
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }
    
    // Update last activity time
    lastActivityTimeRef.current = Date.now();
    
    // Set new timer
    inactivityTimerRef.current = setTimeout(() => {
      checkInactivity();
    }, inactivityTimeout);
  };

  const checkInactivity = () => {
    const inactiveTime = Date.now() - lastActivityTimeRef.current;
    
    // If inactive for longer than timeout, redirect
    if (inactiveTime >= inactivityTimeout) {
      console.log("User inactive, redirecting to dashboard...");
      showRedirectNotice();
    }
  };

  const [showRedirectNotice, setShowRedirectNotice] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(5);

  useEffect(() => {
    let countdownInterval;
    
    if (showRedirectNotice) {
      countdownInterval = setInterval(() => {
        setRedirectCountdown(prev => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            window.location.href = "/";  // Redirect to dashboard
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    
    return () => {
      if (countdownInterval) clearInterval(countdownInterval);
    };
  }, [showRedirectNotice]);

  const handleStayOnPage = () => {
    setShowRedirectNotice(false);
    setRedirectCountdown(5);
    resetInactivityTimer();
  };

  // Add event listeners for activity
  useEffect(() => {
    const handleActivity = () => resetInactivityTimer();
    
    document.addEventListener('mousemove', handleActivity);
    document.addEventListener('keydown', handleActivity);
    document.addEventListener('click', handleActivity);
    document.addEventListener('touchstart', handleActivity);
    
    return () => {
      document.removeEventListener('mousemove', handleActivity);
      document.removeEventListener('keydown', handleActivity);
      document.removeEventListener('click', handleActivity);
      document.removeEventListener('touchstart', handleActivity);
    };
  }, []);

  return (
    <div className="flex flex-col h-full">
      <div 
        ref={containerRef}
        className="relative w-full max-w-3xl mx-auto h-[600px] overflow-hidden rounded-lg border border-slate-300 bg-white shadow-md"
      >
        <video 
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover bg-white"
          playsInline
        />
        <canvas 
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
        />
        
        <div className="absolute bottom-5 right-5 bg-[#1e628c] text-white px-4 py-2 text-xl font-bold rounded-lg z-10">
          Reps: <span>{repCounter}</span>
        </div>
        
        <div className="absolute top-5 left-5 bg-[#1e628c] text-white p-2 rounded-lg z-10">
          <select 
            value={exerciseType}
            onChange={handleExerciseChange}
            className="bg-[#1e628c] text-white border border-white rounded px-2 py-1"
          >
            <option value="bicepCurl">Bicep Curl</option>
            <option value="squat">Squat</option>
            <option value="pushup">Push-up</option>
            <option value="shoulderPress">Shoulder Press</option>
            <option value="tricepExtension">Floor Tricep Extension</option>
            <option value="lunge">Lunge</option>
            <option value="calfRaises">Calf Raises</option>
          </select>
        </div>
        
        {feedback && (
          <div className="absolute top-5 right-5 bg-[#1e628c]/80 text-white p-2 rounded-lg z-10 max-w-[200px] break-words">
            {feedback}
          </div>
        )}
        
        {!cameraStarted && (
          <button
            onClick={startCamera}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 px-6 py-3 bg-[#1e628c] text-white rounded-lg text-lg cursor-pointer z-10 hover:bg-[#174e70] transition-colors"
          >
            Start Camera
          </button>
        )}
        
        {errorMessage && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-black/70 text-white p-5 rounded-lg text-center max-w-[80%] z-30">
            <p>Camera Error: {errorMessage}</p>
            <p>Please ensure you've granted camera permissions and try again.</p>
          </div>
        )}
        
        {showRedirectNotice && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70 z-50 text-white">
            <h2 className="text-xl font-semibold">No activity detected</h2>
            <p className="mt-2">Redirecting to dashboard in <span>{redirectCountdown}</span> seconds...</p>
            <button
              onClick={handleStayOnPage}
              className="mt-5 px-5 py-2 bg-[#1e628c] border-none text-white rounded cursor-pointer"
            >
              Stay on this page
            </button>
          </div>
        )}
        
        {showRepLogged && (
          <div className="absolute bottom-20 left-1/2 transform -translate-x-1/2 bg-green-600/90 text-white px-4 py-2 rounded-lg text-center z-20 animate-pulse">
            <div className="flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
              <span>Exercise logged to tracker!</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExerciseCounter;
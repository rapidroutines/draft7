import { useState, useEffect, useRef } from "react";
import { Camera, Settings, X, ChevronDown, ChevronUp, RotateCcw, CheckCircle2 } from "lucide-react";
import { cn } from "@/utils/cn";

// Exercise types and their display names
const EXERCISE_TYPES = {
  bicepCurl: "Bicep Curl",
  squat: "Squat",
  pushup: "Push-up",
  shoulderPress: "Shoulder Press",
  situp: "Sit-up",
  jumpingJacks: "Jumping Jacks",
  lunge: "Lunge"
};

const RepBot = ({ isFullscreen }) => {
  // State variables
  const [isLoading, setIsLoading] = useState(true);
  const [cameraStarted, setCameraStarted] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [repCount, setRepCount] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [exerciseType, setExerciseType] = useState("bicepCurl");
  const [stage, setStage] = useState("down");
  const [angles, setAngles] = useState({});
  const [sessionId] = useState(`session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`);
  const [poseDetectionStarted, setPoseDetectionStarted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showInstructions, setShowInstructions] = useState(true);
  
  // Refs
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const cameraRef = useRef(null);
  const poseRef = useRef(null);
  const animationRef = useRef(null);
  const lastRepTimeRef = useRef(0);

  // Exercise state tracking
  const exerciseStateRef = useRef({
    repCounter: 0,
    stage: "down",
    lastRepTime: 0,
    holdStart: 0,
    leftArmStage: "down",
    rightArmStage: "down",
    leftArmHoldStart: 0,
    rightArmHoldStart: 0
  });

  useEffect(() => {
    // Load MediaPipe libraries
    const loadMediaPipe = async () => {
      try {
        // Check if MediaPipe is already loaded
        if (window.Pose) {
          initializePose();
          setIsLoading(false);
          return;
        }

        // Load required scripts if not already loaded
        const scripts = [
          "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
          "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
          "https://cdn.jsdelivr.net/npm/@mediapipe/pose/pose.js"
        ];

        for (const scriptSrc of scripts) {
          // Check if script is already loaded
          if (document.querySelector(`script[src="${scriptSrc}"]`)) continue;
          
          // Load script
          await new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = scriptSrc;
            script.crossOrigin = "anonymous";
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load script: ${scriptSrc}`));
            document.body.appendChild(script);
          });
        }

        // Wait a moment for libraries to initialize
        setTimeout(() => {
          initializePose();
          setIsLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error loading MediaPipe:", error);
        setErrorMessage("Failed to load required libraries. Please refresh and try again.");
        setIsLoading(false);
      }
    };

    loadMediaPipe();

    // Cleanup function
    return () => {
      stopCamera();
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const initializePose = () => {
    if (!window.Pose) {
      setErrorMessage("MediaPipe Pose library not found. Please refresh and try again.");
      return;
    }

    try {
      poseRef.current = new window.Pose({
        locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
        }
      });

      poseRef.current.setOptions({
        modelComplexity: 1,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
      });

      poseRef.current.onResults(onPoseResults);
      setPoseDetectionStarted(true);
    } catch (error) {
      console.error("Error initializing MediaPipe Pose:", error);
      setErrorMessage("Failed to initialize pose detection. Please refresh and try again.");
    }
  };

  const startCamera = async () => {
    try {
      if (!videoRef.current || !canvasRef.current || !poseRef.current) {
        setErrorMessage("Video or canvas elements not found.");
        return;
      }

      setErrorMessage("");

      // Request camera access
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });
      
      videoRef.current.srcObject = stream;
      
      // Wait for video to be ready
      await new Promise((resolve) => {
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().then(resolve);
        };
      });

      // Setup MediaPipe camera
      cameraRef.current = new window.Camera(videoRef.current, {
        onFrame: async () => {
          if (poseRef.current) {
            await poseRef.current.send({ image: videoRef.current });
          }
        },
        width: 1280,
        height: 720
      });

      await cameraRef.current.start();
      setCameraStarted(true);
      setShowInstructions(false);
    } catch (error) {
      console.error("Error starting camera:", error);
      if (error.name === "NotAllowedError") {
        setErrorMessage("Camera access was denied. Please enable camera access and try again.");
      } else if (error.name === "NotFoundError") {
        setErrorMessage("No camera was found. Please ensure your device has a working camera.");
      } else {
        setErrorMessage(`Camera error: ${error.message}`);
      }
    }
  };

  const stopCamera = () => {
    if (cameraRef.current) {
      cameraRef.current.stop();
    }
    
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    
    setCameraStarted(false);
  };

  const resetExercise = () => {
    exerciseStateRef.current = {
      repCounter: 0,
      stage: "down",
      lastRepTime: 0,
      holdStart: 0,
      leftArmStage: "down",
      rightArmStage: "down",
      leftArmHoldStart: 0,
      rightArmHoldStart: 0
    };
    setRepCount(0);
    setFeedback("");
    setStage("down");
    setAngles({});
    lastRepTimeRef.current = 0;
  };

  const changeExercise = (type) => {
    setExerciseType(type);
    resetExercise();
    setShowSettings(false);
  };

  const onPoseResults = (results) => {
    // Clear canvas
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    
    // Adjust canvas size to match video dimensions
    if (videoRef.current) {
      const videoWidth = videoRef.current.videoWidth;
      const videoHeight = videoRef.current.videoHeight;
      
      if (canvasRef.current.width !== videoWidth || canvasRef.current.height !== videoHeight) {
        canvasRef.current.width = videoWidth;
        canvasRef.current.height = videoHeight;
      }
    }

    // Draw pose landmarks
    if (results.poseLandmarks) {
      // Draw connections and landmarks
      window.drawConnectors(ctx, results.poseLandmarks, window.POSE_CONNECTIONS, {
        color: '#1E628C',
        lineWidth: 2
      });
      window.drawLandmarks(ctx, results.poseLandmarks, {
        color: '#FF0000',
        lineWidth: 1,
        radius: 3
      });

      // Process landmarks for exercise tracking
      processPoseLandmarks(results.poseLandmarks);
    }
  };

  // Process landmarks and track exercises
  const processPoseLandmarks = (landmarks) => {
    // Convert landmarks to the format expected by our processing functions
    // MediaPipe landmarks come in normalized format (0-1), we'll keep this format
    
    // Current time for tracking repetition timing
    const current_time = Date.now();
    const rep_cooldown = 1000; // Prevent double counting
    const hold_threshold = 500; // Time to hold at position
    
    // Process based on selected exercise type
    let result = { repCounter: exerciseStateRef.current.repCounter, stage: exerciseStateRef.current.stage, feedback: "" };
    
    switch (exerciseType) {
      case "bicepCurl":
        result = processBicepCurl(landmarks, exerciseStateRef.current, current_time, rep_cooldown, hold_threshold);
        break;
      case "squat":
        result = processSquat(landmarks, exerciseStateRef.current, current_time, rep_cooldown, hold_threshold);
        break;
      case "pushup":
        result = processPushup(landmarks, exerciseStateRef.current, current_time, rep_cooldown, hold_threshold);
        break;
      case "shoulderPress":
        result = processShoulderPress(landmarks, exerciseStateRef.current, current_time, rep_cooldown, hold_threshold);
        break;
      case "situp":
        result = processSitup(landmarks, exerciseStateRef.current, current_time, rep_cooldown, hold_threshold);
        break;
      case "jumpingJacks":
        result = processJumpingJacks(landmarks, exerciseStateRef.current, current_time, rep_cooldown, hold_threshold);
        break;
      case "lunge":
        result = processLunge(landmarks, exerciseStateRef.current, current_time, rep_cooldown, hold_threshold);
        break;
      default:
        break;
    }
    
    // Update state and UI based on processing results
    if (result.repCounter !== repCount) {
      setRepCount(result.repCounter);
    }
    
    if (result.feedback) {
      setFeedback(result.feedback);
    }
    
    if (result.stage !== stage) {
      setStage(result.stage);
    }
    
    if (result.angles) {
      setAngles(result.angles);
    }
    
    // Update reference object with new values
    exerciseStateRef.current = { ...exerciseStateRef.current, repCounter: result.repCounter, stage: result.stage };
  };

  // Function to calculate angle between three points
  const calculateAngle = (a, b, c) => {
    try {
      // Convert to vector from pointB to pointA and pointB to pointC
      const vectorBA = {
        x: a.x - b.x,
        y: a.y - b.y
      };

      const vectorBC = {
        x: c.x - b.x,
        y: c.y - b.y
      };

      // Calculate dot product
      const dotProduct = vectorBA.x * vectorBC.x + vectorBA.y * vectorBC.y;

      // Calculate magnitudes
      const magnitudeBA = Math.sqrt(vectorBA.x**2 + vectorBA.y**2);
      const magnitudeBC = Math.sqrt(vectorBC.x**2 + vectorBC.y**2);

      // Calculate angle in radians (handle division by zero or invalid inputs)
      if (magnitudeBA === 0 || magnitudeBC === 0) {
        return 0;
      }
        
      let cosAngle = dotProduct / (magnitudeBA * magnitudeBC);
      
      // Handle floating point errors that could make cos_angle outside [-1, 1]
      cosAngle = Math.max(Math.min(cosAngle, 1.0), -1.0);
      
      const angleRad = Math.acos(cosAngle);

      // Convert to degrees
      const angleDeg = angleRad * (180 / Math.PI);
      
      return angleDeg;
    } catch (error) {
      console.error("Error calculating angle:", error);
      return 0;
    }
  };

  // Process landmarks for bicep curl exercise
  const processBicepCurl = (landmarks, state, current_time, rep_cooldown, hold_threshold) => {
    try {
      // Left arm
      const left_shoulder = landmarks[11];
      const left_elbow = landmarks[13];
      const left_wrist = landmarks[15];

      // Right arm
      const right_shoulder = landmarks[12];
      const right_elbow = landmarks[14];
      const right_wrist = landmarks[16];

      // Track state for both arms
      let left_angle = null;
      let right_angle = null;
      let left_curl_detected = false;
      let right_curl_detected = false;
      const angles = {};

      // Calculate and store left arm angle
      if (left_shoulder && left_elbow && left_wrist) {
        left_angle = calculateAngle(left_shoulder, left_elbow, left_wrist);
        // Store angle with position data
        angles['L'] = {
          value: left_angle,
          position: {
            x: left_elbow.x,
            y: left_elbow.y
          }
        };

        // Detect left arm curl
        if (left_angle > 150) {
          state.leftArmStage = "down";
          state.leftArmHoldStart = current_time;
        }
        if (left_angle < 40 && state.leftArmStage === "down") {
          if (current_time - state.leftArmHoldStart > hold_threshold) {
            left_curl_detected = true;
            state.leftArmStage = "up";
          }
        }
      }

      // Calculate and store right arm angle
      if (right_shoulder && right_elbow && right_wrist) {
        right_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);
        // Store angle with position data
        angles['R'] = {
          value: right_angle,
          position: {
            x: right_elbow.x,
            y: right_elbow.y
          }
        };

        // Detect right arm curl
        if (right_angle > 150) {
          state.rightArmStage = "down";
          state.rightArmHoldStart = current_time;
        }
        if (right_angle < 40 && state.rightArmStage === "down") {
          if (current_time - state.rightArmHoldStart > hold_threshold) {
            right_curl_detected = true;
            state.rightArmStage = "up";
          }
        }
      }

      // Count rep if either arm completes a curl and enough time has passed since last rep
      if ((left_curl_detected || right_curl_detected) && current_time - state.lastRepTime > rep_cooldown) {
        state.repCounter += 1;
        state.lastRepTime = current_time;
        
        // Generate feedback
        let feedback = "Good rep!";
        if (left_curl_detected && right_curl_detected) {
          feedback = "Great form! Both arms curled.";
        } else if (left_curl_detected) {
          feedback = "Left arm curl detected.";
        } else if (right_curl_detected) {
          feedback = "Right arm curl detected.";
        }

        return {
          repCounter: state.repCounter,
          stage: 'up',
          feedback: feedback,
          angles: angles
        };
      }

      return {
        repCounter: state.repCounter,
        stage: state.leftArmStage === "up" || state.rightArmStage === "up" ? "up" : "down",
        angles: angles
      };
    } catch (error) {
      console.error("Error in bicep curl detection:", error);
      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: `Error: ${error.message}`
      };
    }
  };

  // Process landmarks for squat exercise
  const processSquat = (landmarks, state, current_time, rep_cooldown, hold_threshold) => {
    try {
      // Get landmarks for both legs
      const left_hip = landmarks[23];
      const left_knee = landmarks[25];
      const left_ankle = landmarks[27];
      const right_hip = landmarks[24];
      const right_knee = landmarks[26];
      const right_ankle = landmarks[28];

      // Variables to store angles and status
      let left_knee_angle = null;
      let right_knee_angle = null;
      let avg_knee_angle = null;
      let hip_height = null;
      const angles = {};
      let feedback = "";

      // Calculate left knee angle if landmarks are visible
      if (left_hip && left_knee && left_ankle) {
        left_knee_angle = calculateAngle(left_hip, left_knee, left_ankle);
        angles['L'] = {
          value: left_knee_angle,
          position: {
            x: left_knee.x + 0.05,  // Offset a bit to the right
            y: left_knee.y
          }
        };
      }

      // Calculate right knee angle if landmarks are visible
      if (right_hip && right_knee && right_ankle) {
        right_knee_angle = calculateAngle(right_hip, right_knee, right_ankle);
        angles['R'] = {
          value: right_knee_angle,
          position: {
            x: right_knee.x + 0.05,  // Offset a bit to the right
            y: right_knee.y
          }
        };
      }

      // Calculate average knee angle if both are available
      if (left_knee_angle !== null && right_knee_angle !== null) {
        avg_knee_angle = (left_knee_angle + right_knee_angle) / 2;
        // Position between both knees
        const mid_x = (left_knee.x + right_knee.x) / 2;
        const mid_y = (left_knee.y + right_knee.y) / 2;
        angles['Avg'] = {
          value: avg_knee_angle,
          position: {
            x: mid_x,
            y: mid_y - 0.05  // Offset upward
          }
        };
      } else if (left_knee_angle !== null) {
        avg_knee_angle = left_knee_angle;
      } else if (right_knee_angle !== null) {
        avg_knee_angle = right_knee_angle;
      }

      // Calculate hip height (normalized to image height)
      if (left_hip && right_hip) {
        hip_height = (left_hip.y + right_hip.y) / 2;
        const mid_x = (left_hip.x + right_hip.x) / 2;
        angles['Hip'] = {
          value: hip_height * 100,  // Convert to percentage
          position: {
            x: mid_x,
            y: hip_height - 0.05  // Offset upward
          }
        };
      }

      // Process squat detection using both knee angles and hip height
      if (avg_knee_angle !== null && hip_height !== null) {
        // Standing position detection (straight legs and higher hip position)
        if (avg_knee_angle > 160 && hip_height < 0.6) {
          state.stage = "up";
          state.holdStart = current_time;
          feedback = "Standing position";
        }
        
        // Squat position detection (bent knees and lower hip position)
        if (avg_knee_angle < 120 && hip_height > 0.65 && state.stage === "up") {
          if (current_time - state.holdStart > hold_threshold && current_time - state.lastRepTime > rep_cooldown) {
            state.stage = "down";
            state.repCounter += 1;
            state.lastRepTime = current_time;
            feedback = "Rep complete!";
          } else {
            feedback = "Squatting";
          }
        }
      }

      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: feedback,
        angles: angles,
        status: state.stage === "up" ? "Standing" : "Squatting"
      };
    } catch (error) {
      console.error("Error in squat detection:", error);
      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: `Error: ${error.message}`,
        angles: {}
      };
    }
  };

  // Process landmarks for pushup exercise
  const processPushup = (landmarks, state, current_time, rep_cooldown, hold_threshold) => {
    try {
      // Get landmarks for both arms and shoulders
      const left_shoulder = landmarks[11];
      const left_elbow = landmarks[13];
      const left_wrist = landmarks[15];
      const right_shoulder = landmarks[12];
      const right_elbow = landmarks[14];
      const right_wrist = landmarks[16];

      // Additional body points for height/position tracking
      const nose = landmarks[0];
      const left_hip = landmarks[23];
      const right_hip = landmarks[24];

      // Variables to store angles and status
      let left_elbow_angle = null;
      let right_elbow_angle = null;
      let avg_elbow_angle = null;
      let body_height = null;
      let body_alignment = null;
      const angles = {};
      let feedback = "";
      const warnings = [];

      // Calculate left arm angle if landmarks are visible
      if (left_shoulder && left_elbow && left_wrist) {
        left_elbow_angle = calculateAngle(left_shoulder, left_elbow, left_wrist);
        angles['L'] = {
          value: left_elbow_angle,
          position: {
            x: left_elbow.x + 0.05,
            y: left_elbow.y
          }
        };
      }

      // Calculate right arm angle if landmarks are visible
      if (right_shoulder && right_elbow && right_wrist) {
        right_elbow_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);
        angles['R'] = {
          value: right_elbow_angle,
          position: {
            x: right_elbow.x + 0.05,
            y: right_elbow.y
          }
        };
      }

      // Calculate average elbow angle if both are available
      if (left_elbow_angle !== null && right_elbow_angle !== null) {
        avg_elbow_angle = (left_elbow_angle + right_elbow_angle) / 2;
        // Position between both elbows
        const mid_x = (left_elbow.x + right_elbow.x) / 2;
        const mid_y = (left_elbow.y + right_elbow.y) / 2;
        angles['Avg'] = {
          value: avg_elbow_angle,
          position: {
            x: mid_x,
            y: mid_y - 0.05
          }
        };
      } else if (left_elbow_angle !== null) {
        avg_elbow_angle = left_elbow_angle;
      } else if (right_elbow_angle !== null) {
        avg_elbow_angle = right_elbow_angle;
      }

      // Calculate body height (y-coordinate of shoulders)
      if (left_shoulder && right_shoulder) {
        body_height = (left_shoulder.y + right_shoulder.y) / 2;
        const mid_x = (left_shoulder.x + right_shoulder.x) / 2;
        angles['Height'] = {
          value: body_height * 100,
          position: {
            x: mid_x,
            y: body_height - 0.05
          }
        };
      }

      // Check body alignment (straight back)
      if (left_shoulder && right_shoulder && left_hip && right_hip) {
        const shoulder_mid_x = (left_shoulder.x + right_shoulder.x) / 2;
        const shoulder_mid_y = (left_shoulder.y + right_shoulder.y) / 2;
        const hip_mid_x = (left_hip.x + right_hip.x) / 2;
        const hip_mid_y = (left_hip.y + right_hip.y) / 2;

        // Calculate angle between shoulders and hips to check for body alignment
        const alignment_angle = Math.atan2(hip_mid_y - shoulder_mid_y, hip_mid_x - shoulder_mid_x) * 180 / Math.PI;
        const abs_alignment_angle = Math.abs(alignment_angle);

        // Normalize to 0-90 degree range (0 = perfect horizontal alignment)
        body_alignment = abs_alignment_angle > 90 ? 180 - abs_alignment_angle : abs_alignment_angle;
        
        angles['Align'] = {
          value: body_alignment,
          position: {
            x: hip_mid_x,
            y: hip_mid_y + 0.05
          }
        };
        
        // Check alignment and add warning if needed
        if (body_alignment > 15) {
          warnings.push("Keep body straight!");
        }
      }

      // Process pushup detection using elbow angles, body height, and alignment
      let status = "";
      if (avg_elbow_angle !== null && body_height !== null) {
        // Up position detection (straight arms, higher body position)
        if (avg_elbow_angle > 160 && body_height < 0.7) {
          state.stage = "up";
          state.holdStart = current_time;
          status = "Up Position";
        }

        // Down position detection (bent arms, lower body position)
        if (avg_elbow_angle < 90 && state.stage === "up") {
          if (current_time - state.holdStart > hold_threshold && current_time - state.lastRepTime > rep_cooldown) {
            state.stage = "down";
            state.repCounter += 1;
            state.lastRepTime = current_time;
            status = "Rep Complete!";
            feedback = "Rep complete! Good pushup.";
          } else {
            status = "Down Position";
            feedback = "Down position - hold briefly";
          }
        }
      }

      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: feedback,
        angles: angles,
        status: status,
        warnings: warnings
      };
    } catch (error) {
      console.error("Error in pushup detection:", error);
      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: `Error: ${error.message}`,
        angles: {},
        status: "",
        warnings: []
      };
    }
  };

  // Process landmarks for shoulder press exercise
  const processShoulderPress = (landmarks, state, current_time, rep_cooldown, hold_threshold) => {
    try {
      // Get landmarks for both arms
      const left_shoulder = landmarks[11];
      const left_elbow = landmarks[13];
      const left_wrist = landmarks[15];
      const right_shoulder = landmarks[12];
      const right_elbow = landmarks[14];
      const right_wrist = landmarks[16];

      // Variables to store angles and positions
      let left_elbow_angle = null;
      let right_elbow_angle = null;
      let left_wrist_above_shoulder = false;
      let right_wrist_above_shoulder = false;
      const angles = {};
      const positions = {};
      let feedback = "";
      const warnings = [];

      // Calculate left arm position and angle
      if (left_shoulder && left_elbow && left_wrist) {
        left_elbow_angle = calculateAngle(left_wrist, left_elbow, left_shoulder);
        
        // Check if left wrist is above shoulder
        left_wrist_above_shoulder = left_wrist.y < left_shoulder.y;
        
        // Store angle with position data
        angles['L'] = {
          value: left_elbow_angle,
          position: {
            x: left_elbow.x + 0.05,
            y: left_elbow.y
          }
        };
        
        // Store wrist position indicator
        positions['LWrist'] = {
          value: left_wrist_above_shoulder ? "↑" : "↓",
          position: {
            x: left_wrist.x,
            y: left_wrist.y - 0.02
          },
          color: left_wrist_above_shoulder ? "#00FF00" : "#FF9900"
        };
      }

      // Calculate right arm position and angle
      if (right_shoulder && right_elbow && right_wrist) {
        right_elbow_angle = calculateAngle(right_wrist, right_elbow, right_shoulder);
        
        // Check if right wrist is above shoulder
        right_wrist_above_shoulder = right_wrist.y < right_shoulder.y;
        
        // Store angle with position data
        angles['R'] = {
          value: right_elbow_angle,
          position: {
            x: right_elbow.x + 0.05,
            y: right_elbow.y
          }
        };
        
        // Store wrist position indicator
        positions['RWrist'] = {
          value: right_wrist_above_shoulder ? "↑" : "↓",
          position: {
            x: right_wrist.x,
            y: right_wrist.y - 0.02
          },
          color: right_wrist_above_shoulder ? "#00FF00" : "#FF9900"
        };
      }

      // Calculate average elbow angle if both are available
      let avg_elbow_angle = null;
      if (left_elbow_angle !== null && right_elbow_angle !== null) {
        avg_elbow_angle = (left_elbow_angle + right_elbow_angle) / 2;
        
        // Store average angle with position between elbows
        angles['Avg'] = {
          value: avg_elbow_angle,
          position: {
            x: (left_elbow.x + right_elbow.x) / 2,
            y: (left_elbow.y + right_elbow.y) / 2 - 0.05
          }
        };
      } else if (left_elbow_angle !== null) {
        avg_elbow_angle = left_elbow_angle;
      } else if (right_elbow_angle !== null) {
        avg_elbow_angle = right_elbow_angle;
      }

      // Determine arm positions for stage detection
      const both_wrists_below_shoulder = !left_wrist_above_shoulder && !right_wrist_above_shoulder;
      const both_wrists_above_shoulder = left_wrist_above_shoulder && right_wrist_above_shoulder;
      const one_wrist_above_shoulder = left_wrist_above_shoulder || right_wrist_above_shoulder;

      // Process shoulder press detection
      let status = "";
      if (avg_elbow_angle !== null) {
        // Starting (down) position - arms bent, wrists below shoulders
        if (avg_elbow_angle < 100 && both_wrists_below_shoulder) {
          state.stage = "down";
          state.holdStart = current_time;
          status = "Ready Position";
          feedback = "Ready position - good start";
        }

        // Up position - arms extended, wrists above shoulders
        if (avg_elbow_angle > 140 && (both_wrists_above_shoulder || (one_wrist_above_shoulder && avg_elbow_angle > 150))) {
          if (state.stage === "down" && current_time - state.holdStart > hold_threshold && current_time - state.lastRepTime > rep_cooldown) {
            state.stage = "up";
            state.repCounter += 1;
            state.lastRepTime = current_time;
            status = "Rep Complete!";
            feedback = "Rep complete! Good press.";
          } else if (state.stage === "up") {
            status = "Press Complete";
            feedback = "Press complete - hold position";
          }
        }

        // Form feedback
        if (state.stage === "down" && avg_elbow_angle < 65) {
          warnings.push("Start higher!");
          feedback = "Start with arms higher";
        }

        if (one_wrist_above_shoulder && !both_wrists_above_shoulder && state.stage === "up") {
          warnings.push("Press both arms evenly!");
          feedback = "Press both arms evenly";
        }
      }

      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: feedback,
        angles: angles,
        positions: positions,
        status: status,
        warnings: warnings
      };
    } catch (error) {
      console.error("Error in shoulder press detection:", error);
      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: `Error: ${error.message}`,
        angles: {},
        positions: {},
        status: "",
        warnings: []
      };
    }
  };

  // Process landmarks for situp exercise
  const processSitup = (landmarks, state, current_time, rep_cooldown, hold_threshold) => {
    try {
      // Get landmarks for both sides
      const left_shoulder = landmarks[11];
      const left_hip = landmarks[23];
      const left_knee = landmarks[25];
      const right_shoulder = landmarks[12];
      const right_hip = landmarks[24];
      const right_knee = landmarks[26];

      // Initialize variables to track angles
      let left_angle = 0;
      let right_angle = 0;
      let avg_angle = 0;
      const angles = {};
      let feedback = "";

      // Check if we have all required landmarks
      if (left_shoulder && left_hip && left_knee && right_shoulder && right_hip && right_knee) {
        // Calculate angle for left side
        left_angle = calculateAngle(
          {x: left_shoulder.x, y: left_shoulder.y},
          {x: left_hip.x, y: left_hip.y},
          {x: left_knee.x, y: left_knee.y}
        );
        
        // Store angle with position data
        angles['L'] = {
          value: left_angle,
          position: {
            x: left_hip.x + 0.05,
            y: left_hip.y
          }
        };

        // Calculate angle for right side
        right_angle = calculateAngle(
          {x: right_shoulder.x, y: right_shoulder.y},
          {x: right_hip.x, y: right_hip.y},
          {x: right_knee.x, y: right_knee.y}
        );
        
        // Store angle with position data
        angles['R'] = {
          value: right_angle,
          position: {
            x: right_hip.x + 0.05,
            y: right_hip.y - 0.05
          }
        };

        // Calculate average angle (for more stability)
        avg_angle = (left_angle + right_angle) / 2;
        
        // Store average angle
        angles['Avg'] = {
          value: avg_angle,
          position: {
            x: left_hip.x + 0.05,
            y: left_hip.y - 0.1
          }
        };

        // Rep counting logic using average angle for more stability
        if (avg_angle > 160) {
          // Lying flat
          state.stage = "down";
          state.holdStart = current_time;
          feedback = "Down position - prepare to sit up";
        }
        
        if (avg_angle < 80 && state.stage === "down") {
          // Sitting up
          if (current_time - state.holdStart > hold_threshold && current_time - state.lastRepTime > rep_cooldown) {
            state.stage = "up";
            state.repCounter += 1;
            state.lastRepTime = current_time;
            feedback = "Rep complete! Good sit-up.";
          } else {
            feedback = "Almost there - complete the sit-up";
          }
        }

        return {
          repCounter: state.repCounter,
          stage: state.stage,
          feedback: feedback,
          angles: angles,
          status: state.stage
        };
      } else {
        return {
          repCounter: state.repCounter,
          stage: state.stage,
          feedback: "Position not clear - adjust camera",
          angles: {},
          status: ""
        };
      }
    } catch (error) {
      console.error("Error in sit-up detection:", error);
      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: `Error: ${error.message}`,
        angles: {},
        status: ""
      };
    }
  };

  // Process landmarks for jumping jacks exercise
  const processJumpingJacks = (landmarks, state, current_time, rep_cooldown, hold_threshold) => {
    try {
      // Extract key landmarks
      const left_shoulder = landmarks[11];
      const right_shoulder = landmarks[12];
      const left_elbow = landmarks[13];
      const right_elbow = landmarks[14];
      const left_wrist = landmarks[15];
      const right_wrist = landmarks[16];
      const left_hip = landmarks[23];
      const right_hip = landmarks[24];
      const left_knee = landmarks[25];
      const right_knee = landmarks[26];
      const left_ankle = landmarks[27];
      const right_ankle = landmarks[28];

      // Check if all landmarks are present
      const key_points = [
        left_shoulder, right_shoulder, left_elbow, right_elbow, left_wrist, right_wrist,
        left_hip, right_hip, left_knee, right_knee, left_ankle, right_ankle
      ];
      
      if (!key_points.every(point => point)) {
        return {
          repCounter: state.repCounter,
          stage: state.stage,
          feedback: "Position not clear - adjust camera",
          angles: {},
          position: ""
        };
      }

      // Calculate arm angles (angle between shoulder-elbow-wrist)
      const left_arm_angle = calculateAngle(left_shoulder, left_elbow, left_wrist);
      const right_arm_angle = calculateAngle(right_shoulder, right_elbow, right_wrist);

      // Calculate shoulder angles (angle between hip-shoulder-elbow)
      const left_shoulder_angle = calculateAngle(left_hip, left_shoulder, left_elbow);
      const right_shoulder_angle = calculateAngle(right_hip, right_shoulder, right_elbow);

      // Calculate leg angles (angle between hip-knee-ankle)
      const left_leg_angle = calculateAngle(left_hip, left_knee, left_ankle);
      const right_leg_angle = calculateAngle(right_hip, right_knee, right_ankle);

      // Calculate hip angles (angle between shoulder-hip-knee)
      const left_hip_angle = calculateAngle(left_shoulder, left_hip, left_knee);
      const right_hip_angle = calculateAngle(right_shoulder, right_hip, right_knee);

      // Store angles for display with positions
      const mid_shoulder_x = (left_shoulder.x + right_shoulder.x) / 2;
      const mid_shoulder_y = (left_shoulder.y + right_shoulder.y) / 2;
      
      const angles = {
        'LArm': {
          value: left_arm_angle,
          position: {
            x: left_elbow.x,
            y: left_elbow.y
          }
        },
        'RArm': {
          value: right_arm_angle,
          position: {
            x: right_elbow.x,
            y: right_elbow.y
          }
        },
        'LShoulder': {
          value: left_shoulder_angle,
          position: {
            x: left_shoulder.x,
            y: left_shoulder.y
          }
        },
        'RShoulder': {
          value: right_shoulder_angle,
          position: {
            x: right_shoulder.x,
            y: right_shoulder.y
          }
        },
        'LLeg': {
          value: left_leg_angle,
          position: {
            x: left_knee.x,
            y: left_knee.y
          }
        },
        'RLeg': {
          value: right_leg_angle,
          position: {
            x: right_knee.x,
            y: right_knee.y
          }
        },
        'LHip': {
          value: left_hip_angle,
          position: {
            x: left_hip.x,
            y: left_hip.y
          }
        },
        'RHip': {
          value: right_hip_angle,
          position: {
            x: right_hip.x,
            y: right_hip.y
          }
        },
        'Summary': {
          value: `L:${Math.round(left_arm_angle)}° R:${Math.round(right_arm_angle)}°`,
          position: {
            x: mid_shoulder_x,
            y: mid_shoulder_y - 0.12
          }
        }
      };

      // Detect jumping jack phases using angles
      // Closed position: Arms down (large arm angle, small shoulder angle) and legs together (large leg angle, small hip angle)
      const is_closed_position = (
        left_arm_angle > 150 && right_arm_angle > 150 &&
        left_shoulder_angle < 50 && right_shoulder_angle < 50 &&
        left_leg_angle > 160 && right_leg_angle > 160 &&
        left_hip_angle < 30 && right_hip_angle < 30
      );

      // Open position: Arms up (small arm angle, large shoulder angle) and legs apart (small leg angle, large hip angle)
      const is_open_position = (
        left_arm_angle < 120 && right_arm_angle < 120 &&
        left_shoulder_angle > 160 && right_shoulder_angle > 160 &&
        left_leg_angle < 140 && right_leg_angle < 140 &&
        left_hip_angle > 50 && right_hip_angle > 50
      );

      let feedback = "";
      let position = "TRANSITION";
      
      if (is_closed_position) {
        state.stage = "closed";
        state.holdStart = current_time;
        feedback = "Closed position - prepare to jump";
        position = "CLOSED";
      }
      
      if (is_open_position && state.stage === "closed") {
        if (current_time - state.holdStart > hold_threshold && current_time - state.lastRepTime > rep_cooldown) {
          state.stage = "open";
          state.repCounter += 1;
          state.lastRepTime = current_time;
          feedback = "Rep complete! Good jumping jack.";
          position = "OPEN";
        } else {
          feedback = "Open position - good form";
          position = "OPEN";
        }
      }
      
      if (!is_open_position && !is_closed_position) {
        feedback = "Transition - continue your movement";
        position = "TRANSITION";
      }

      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: feedback,
        angles: angles,
        position: position
      };
    } catch (error) {
      console.error("Error in jumping jacks detection:", error);
      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: `Error: ${error.message}`,
        angles: {},
        position: ""
      };
    }
  };

  // Process landmarks for lunge exercise
  const processLunge = (landmarks, state, current_time, rep_cooldown, hold_threshold) => {
    try {
      // Get landmarks for both sides of the body
      const left_hip = landmarks[23];
      const left_knee = landmarks[25];
      const left_ankle = landmarks[27];
      const right_hip = landmarks[24];
      const right_knee = landmarks[26];
      const right_ankle = landmarks[28];

      // Check if all landmarks are present with x, y coordinates
      if (!left_hip || !left_knee || !left_ankle || !right_hip || !right_knee || !right_ankle) {
        return {
          repCounter: state.repCounter,
          stage: state.stage,
          feedback: "Position not clear - adjust camera",
          angles: {}
        };
      }

      // Calculate leg angles for both sides
      const left_leg_angle = calculateAngle(
        {x: left_hip.x, y: left_hip.y},
        {x: left_knee.x, y: left_knee.y},
        {x: left_ankle.x, y: left_ankle.y}
      );

      const right_leg_angle = calculateAngle(
        {x: right_hip.x, y: right_hip.y},
        {x: right_knee.x, y: right_knee.y},
        {x: right_ankle.x, y: right_ankle.y}
      );

      // Calculate vertical distance between knees to detect lunge position
      const knee_height_diff = Math.abs(left_knee.y - right_knee.y);

      // Determine which leg is in front (lower knee is the front leg)
      const front_leg_angle = left_knee.y > right_knee.y ? right_leg_angle : left_leg_angle;
      const back_leg_angle = left_knee.y > right_knee.y ? left_leg_angle : right_leg_angle;
      const front_knee = left_knee.y > right_knee.y ? right_knee : left_knee;
      const back_knee = left_knee.y > right_knee.y ? left_knee : right_knee;
      
      // Store angles for display
      const angles = {
        'LLeg': {
          value: left_leg_angle,
          position: {
            x: left_knee.x,
            y: left_knee.y
          }
        },
        'RLeg': {
          value: right_leg_angle,
          position: {
            x: right_knee.x,
            y: right_knee.y
          }
        },
        'Front': {
          value: front_leg_angle,
          position: {
            x: front_knee.x + 0.05,
            y: front_knee.y
          }
        },
        'Back': {
          value: back_leg_angle,
          position: {
            x: back_knee.x + 0.05,
            y: back_knee.y
          }
        },
        'KneeDiff': {
          value: knee_height_diff * 100,
          position: {
            x: (left_knee.x + right_knee.x) / 2,
            y: (left_knee.y + right_knee.y) / 2
          }
        }
      };

      // Track standing position - both legs relatively straight
      let feedback = "";
      if ((left_leg_angle > 150 && right_leg_angle > 150) && knee_height_diff < 0.1) {
        state.stage = "up";
        state.holdStart = current_time;
        feedback = "Standing position - prepare for lunge";
      }

      // Proper lunge detection - front leg bent, back leg straighter, significant height difference
      const proper_front_angle = front_leg_angle < 110;  // Front knee should be bent (~90° is ideal)
      const proper_back_angle = back_leg_angle > 130;    // Back leg should be straighter
      const proper_knee_height = knee_height_diff > 0.2;  // Sufficient height difference between knees

      if (proper_front_angle && proper_back_angle && proper_knee_height && state.stage === "up") {
        if (current_time - state.holdStart > hold_threshold && current_time - state.lastRepTime > rep_cooldown) {
          state.stage = "down";
          state.repCounter += 1;
          state.lastRepTime = current_time;
          feedback = "Rep complete! Good lunge.";
        } else {
          feedback = "Lunge position - hold it";
        }
      }
      
      // Form feedback
      if (state.stage === "down" && !proper_front_angle) {
        feedback = "Bend your front knee more";
      } else if (state.stage === "down" && !proper_back_angle) {
        feedback = "Keep your back leg straighter";
      } else if (state.stage === "up" && knee_height_diff > 0.1) {
        feedback = "Stand with feet together";
      }

      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: feedback,
        angles: angles
      };
    } catch (error) {
      console.error("Error in lunge detection:", error);
      return {
        repCounter: state.repCounter,
        stage: state.stage,
        feedback: `Error: ${error.message}`,
        angles: {}
      };
    }
  };

  // Render camera start instructions
  const renderInstructions = () => (
    <div className="flex h-full flex-col items-center justify-center bg-slate-200 px-4 text-center dark:bg-slate-800">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-500 text-white">
        <Camera size={40} />
      </div>
      <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Welcome to RepBot</h2>
      <p className="mb-6 max-w-md text-slate-700 dark:text-slate-300">
        RepBot uses your camera to analyze your exercise form and count repetitions. 
        Your video stays on your device and is not stored or shared.
      </p>
      <button
        onClick={startCamera}
        className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
      >
        <Camera size={18} />
        Start Camera
      </button>
    </div>
  );
  
  // Render error message
  const renderError = () => (
    <div className="flex h-full flex-col items-center justify-center bg-slate-200 px-4 text-center dark:bg-slate-800">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-red-500 text-white">
        <X size={40} />
      </div>
      <h2 className="mb-2 text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
      <p className="mb-6 max-w-md text-slate-700 dark:text-slate-300">
        {errorMessage}
      </p>
      <button
        onClick={() => {
          setErrorMessage("");
          setShowInstructions(true);
        }}
        className="flex items-center gap-2 rounded-lg bg-blue-500 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-600"
      >
        <RotateCcw size={18} />
        Try Again
      </button>
    </div>
  );

  // Render exercise settings panel
  const renderSettings = () => (
    <div className={`absolute right-0 top-0 z-10 w-64 overflow-hidden rounded-bl-lg bg-white shadow-lg transition-all dark:bg-slate-800 ${showSettings ? 'h-auto' : 'h-0'}`}>
      <div className="p-4">
        <h3 className="mb-3 font-semibold text-slate-900 dark:text-white">Exercise Type</h3>
        <div className="space-y-2">
          {Object.entries(EXERCISE_TYPES).map(([value, label]) => (
            <div 
              key={value}
              className={`cursor-pointer rounded-lg p-2 transition-colors ${
                value === exerciseType 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-200'
              }`}
              onClick={() => changeExercise(value)}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // Main render
  if (isLoading) {
    return (
      <div className="flex h-full flex-1 items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          <p className="mt-2 text-slate-600 dark:text-slate-400">Loading RepBot...</p>
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return renderError();
  }

  if (showInstructions && !cameraStarted) {
    return renderInstructions();
  }

  return (
    <div className={cn(
      "relative h-full w-full overflow-hidden bg-slate-200 dark:bg-slate-800",
      isFullscreen ? "flex flex-col" : "flex flex-col"
    )}>
      {/* Camera video and canvas overlay */}
      <div className="relative flex-1 overflow-hidden bg-black">
        {/* Hidden video element (used by MediaPipe) */}
        <video 
          ref={videoRef}
          className="invisible absolute h-0 w-0"
          playsInline
        />
        
        {/* Canvas for drawing pose landmarks */}
        <canvas 
          ref={canvasRef}
          className="h-full w-full object-contain"
        />
        
        {/* Settings panel */}
        {renderSettings()}
        
        {/* Exercise controls */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between bg-black/60 p-4 text-white">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Exercise:</span>
              <span className="rounded-full bg-blue-500 px-3 py-1 text-sm font-medium">
                {EXERCISE_TYPES[exerciseType]}
              </span>
            </div>
            <div className="mt-1">
              <span className="text-sm font-medium">Status:</span>
              <span className="ml-2 text-sm">
                {stage === "up" ? "Up Position" : "Down Position"}
              </span>
            </div>
          </div>
          
          <div className="flex flex-col items-end">
            <div className="text-3xl font-bold">{repCount}</div>
            <div className="text-sm">Reps</div>
          </div>
        </div>
        
        {/* Feedback display */}
        {feedback && (
          <div className="absolute left-1/2 top-4 -translate-x-1/2 rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-white">
            {feedback}
          </div>
        )}
      </div>
      
      {/* Controls */}
      <div className="flex items-center justify-between bg-white p-4 dark:bg-slate-900">
        <button
          onClick={resetExercise}
          className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-200 dark:hover:bg-slate-600"
        >
          <RotateCcw size={16} />
          Reset
        </button>
        
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white hover:bg-blue-600"
        >
          <Settings size={16} />
          {showSettings ? (
            <ChevronUp size={16} />
          ) : (
            <ChevronDown size={16} />
          )}
        </button>
      </div>
    </div>
  );
};

export default RepBot;
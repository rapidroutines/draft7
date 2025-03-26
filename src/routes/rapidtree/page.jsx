import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { X, Info, CheckCircle, Lock } from "lucide-react";
import { cn } from "@/utils/cn";

// Exercise data organized by categories (imported from the uploaded files)
const exerciseCategories = {
    push: [
        { id: 'inclinePushUp', title: 'Incline Push-Ups', icon: 'IP', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'kneelingPushUp', title: 'Kneeling Push-Ups', icon: 'KP', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'pushUp', title: 'Regular Push-Ups', icon: 'P', level: 'Beginner', isCompleted: false, isLocked: true },
        { id: 'widePushUp', title: 'Wide Push-Ups', icon: 'W', level: 'Beginner-Int', isCompleted: false, isLocked: true },
        { id: 'declinePushUp', title: 'Decline Push-Ups', icon: 'DP', level: 'Beginner-Int', isCompleted: false, isLocked: true },
        { id: 'diamondPushUp', title: 'Diamond Push-Ups', icon: 'D', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'pseudoPlanche', title: 'Pseudo Planche Push-Ups', icon: 'PP', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'pikePushUp', title: 'Pike Push-Ups', icon: 'PK', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'wallHsPushUp', title: 'Wall Handstand Push-Ups', icon: 'WH', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'archPushUp', title: 'Archer Push-Ups', icon: 'AP', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'ringPushUp', title: 'Ring Push-Ups', icon: 'RP', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'handstandPushUp', title: 'Handstand Push-Ups', icon: 'HS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'oneArmPushup', title: 'One-Arm Push-Ups', icon: 'OA', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'planchePushUp', title: 'Planche Push-Ups', icon: 'PL', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'maltese', title: 'Maltese Push-Ups', icon: 'M', level: 'Elite', isCompleted: false, isLocked: true }
    ],
    pull: [
        { id: 'scapulaPull', title: 'Scapula Pulls', icon: 'SC', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'activeHang', title: 'Active Hangs', icon: 'AH', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'negPullUp', title: 'Negative Pull-Ups', icon: 'NP', level: 'Beginner', isCompleted: false, isLocked: true },
        { id: 'australianPull', title: 'Australian Pull-Ups', icon: 'AU', level: 'Beginner-Int', isCompleted: false, isLocked: true },
        { id: 'chinUp', title: 'Chin-Ups', icon: 'C', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'pullUp', title: 'Pull-Ups', icon: 'P', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'widePullUp', title: 'Wide-Grip Pull-Ups', icon: 'WP', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'lSitPullUp', title: 'L-Sit Pull-Ups', icon: 'LP', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'archPullUp', title: 'Archer Pull-Ups', icon: 'A', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'typeWriter', title: 'Typewriter Pull-Ups', icon: 'TW', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'clappingPull', title: 'Clapping Pull-Ups', icon: 'CP', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'muscleUp', title: 'Muscle-Ups', icon: 'MU', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'oneArmPull', title: 'One-Arm Pull-Ups', icon: 'OA', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'frontLeverPull', title: 'Front Lever Pull-Ups', icon: 'FL', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'oneArmMuscleUp', title: 'One-Arm Muscle-Up', icon: 'OM', level: 'Elite', isCompleted: false, isLocked: true }
    ],
    legs: [
        { id: 'assistSquat', title: 'Assisted Squats', icon: 'AS', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'squat', title: 'Air Squats', icon: 'S', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'lunge', title: 'Forward Lunges', icon: 'L', level: 'Beginner', isCompleted: false, isLocked: true },
        { id: 'sideLunge', title: 'Side Lunges', icon: 'SL', level: 'Beginner', isCompleted: false, isLocked: true },
        { id: 'calfRaise', title: 'Calf Raises', icon: 'CR', level: 'Beginner', isCompleted: false, isLocked: true },
        { id: 'bulgarianSquat', title: 'Bulgarian Split Squats', icon: 'BS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'jumpSquat', title: 'Jump Squats', icon: 'JS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'deepSquat', title: 'Deep Squats', icon: 'DS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'walljumpSquat', title: 'Cossack Squats', icon: 'CS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'singleLegCalfRaise', title: 'Single-Leg Calf Raises', icon: 'SC', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'singleLegBridge', title: 'Single-Leg Bridges', icon: 'SB', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'shrimpsquat', title: 'Shrimp Squats', icon: 'SS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'pistolSquat', title: 'Pistol Squats', icon: 'PS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'naturalLegExt', title: 'Natural Leg Extensions', icon: 'NL', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'deepPistolSquat', title: 'Deep Pistol Squats', icon: 'DP', level: 'Elite', isCompleted: false, isLocked: true }
    ],
    core: [
        { id: 'deadBug', title: 'Dead Bug', icon: 'DB', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'plank', title: 'Plank', icon: 'P', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'kneeRaise', title: 'Knee Raises', icon: 'KR', level: 'Beginner', isCompleted: false, isLocked: true },
        { id: 'mountainClimber', title: 'Mountain Climbers', icon: 'MC', level: 'Beginner', isCompleted: false, isLocked: true },
        { id: 'windshieldWiper', title: 'Windshield Wipers', icon: 'WW', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'sidePlank', title: 'Side Plank', icon: 'SP', level: 'Beginner-Int', isCompleted: false, isLocked: true },
        { id: 'legRaise', title: 'Hanging Leg Raises', icon: 'LR', level: 'Beginner-Int', isCompleted: false, isLocked: true },
        { id: 'hollowHold', title: 'Hollow Body Hold', icon: 'HH', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'lsit', title: 'L-Sit', icon: 'LS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'abWheel', title: 'Ab Wheel Rollout', icon: 'AW', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'dragonFlag', title: 'Dragon Flag', icon: 'DF', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'backLever', title: 'Back Lever', icon: 'BL', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'frontLever', title: 'Front Lever', icon: 'FL', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'vSit', title: 'V-Sit', icon: 'VS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'manna', title: 'Manna', icon: 'MA', level: 'Elite', isCompleted: false, isLocked: true }
    ],
    mobility: [
        { id: 'neckRotation', title: 'Neck Rotations', icon: 'NR', level: 'All Levels', isCompleted: false, isLocked: false },
        { id: 'wristMob', title: 'Wrist Mobility', icon: 'WM', level: 'All Levels', isCompleted: false, isLocked: false },
        { id: 'shoulderMob', title: 'Shoulder Mobility', icon: 'SM', level: 'All Levels', isCompleted: false, isLocked: true },
        { id: 'thoracicRotation', title: 'Thoracic Rotations', icon: 'TR', level: 'All Levels', isCompleted: false, isLocked: true },
        { id: 'catCow', title: 'Cat-Cow Stretch', icon: 'CC', level: 'All Levels', isCompleted: false, isLocked: true },
        { id: 'hipMob', title: 'Hip Mobility', icon: 'HM', level: 'All Levels', isCompleted: false, isLocked: true },
        { id: 'butterflyStretch', title: 'Butterfly Stretch', icon: 'BS', level: 'All Levels', isCompleted: false, isLocked: true },
        { id: 'spinalFlex', title: 'Spinal Flexibility', icon: 'SF', level: 'All Levels', isCompleted: false, isLocked: true },
        { id: 'ankleMob', title: 'Ankle Mobility', icon: 'AM', level: 'All Levels', isCompleted: false, isLocked: true },
        { id: 'germanHang', title: 'German Hang', icon: 'GH', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'chestStretch', title: 'Deep Chest Stretch', icon: 'CS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'pancake', title: 'Pancake Stretch', icon: 'PS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'frontSplit', title: 'Front Split', icon: 'FS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'middleSplit', title: 'Middle Split', icon: 'MS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'bridgeStretch', title: 'Full Bridge', icon: 'FB', level: 'Advanced', isCompleted: false, isLocked: true }
    ],
    skills: [
        { id: 'ctw', title: 'Crow to Wall', icon: 'CW', level: 'Beginner', isCompleted: false, isLocked: false },
        { id: 'crow', title: 'Crow Pose', icon: 'CP', level: 'Beginner-Int', isCompleted: false, isLocked: false },
        { id: 'lsit', title: 'L-Sit', icon: 'LS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'frogstand', title: 'Frog Stand', icon: 'FS', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'wallHandstand', title: 'Wall Handstand', icon: 'WH', level: 'Intermediate', isCompleted: false, isLocked: true },
        { id: 'handstand', title: 'Free Handstand', icon: 'HS', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'straddle', title: 'Straddle Planche', icon: 'SP', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'tuckedPlanche', title: 'Tuck Planche', icon: 'TP', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'advTuckPlanche', title: 'Advanced Tuck Planche', icon: 'AT', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'humanFlag', title: 'Human Flag', icon: 'HF', level: 'Advanced', isCompleted: false, isLocked: true },
        { id: 'backLever', title: 'Back Lever', icon: 'BL', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'frontLever', title: 'Front Lever', icon: 'FL', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'planche', title: 'Full Planche', icon: 'PL', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'icarusCross', title: 'Icarus Cross', icon: 'IC', level: 'Elite', isCompleted: false, isLocked: true },
        { id: 'victorianCross', title: 'Victorian Cross', icon: 'VC', level: 'Elite', isCompleted: false, isLocked: true }
    ]
};

const RapidTreePage = () => {
    const [activeCategory, setActiveCategory] = useState('push');
    const [exercises, setExercises] = useState({...exerciseCategories});
    const [selectedExercise, setSelectedExercise] = useState(null);
    const [totalProgress, setTotalProgress] = useState(0);

    // Calculate total progress
    useEffect(() => {
        let completedCount = 0;
        let totalCount = 0;

        Object.keys(exercises).forEach(category => {
            exercises[category].forEach(exercise => {
                totalCount++;
                if (exercise.isCompleted) {
                    completedCount++;
                }
            });
        });

        const percentage = Math.floor((completedCount / totalCount) * 100);
        setTotalProgress(percentage);
    }, [exercises]);

    // Load saved progress from localStorage
    useEffect(() => {
        const savedProgress = localStorage.getItem('rapidTreeProgress');
        if (savedProgress) {
            try {
                const parsedProgress = JSON.parse(savedProgress);
                const updatedExercises = {...exercises};

                Object.keys(parsedProgress).forEach(category => {
                    if (updatedExercises[category]) {
                        parsedProgress[category].forEach(savedExercise => {
                            const index = updatedExercises[category].findIndex(ex => ex.id === savedExercise.id);
                            if (index !== -1) {
                                updatedExercises[category][index].isCompleted = savedExercise.isCompleted;
                                updatedExercises[category][index].isLocked = savedExercise.isLocked;
                            }
                        });
                    }
                });

                setExercises(updatedExercises);
            } catch (error) {
                console.error('Error loading saved progress:', error);
            }
        }
    }, []);

    // Save progress to localStorage
    const saveProgress = () => {
        const progressData = {};

        Object.keys(exercises).forEach(category => {
            progressData[category] = exercises[category].map(exercise => ({
                id: exercise.id,
                isCompleted: exercise.isCompleted,
                isLocked: exercise.isLocked
            }));
        });

        localStorage.setItem('rapidTreeProgress', JSON.stringify(progressData));
    };

    // Show exercise details
    const showExerciseDetails = (category, exerciseId) => {
        const exercise = exercises[category].find(ex => ex.id === exerciseId);
        if (exercise && !exercise.isLocked) {
            setSelectedExercise({...exercise, category});
        }
    };

    // Complete an exercise
    const completeExercise = (category, exerciseId) => {
        const updatedExercises = {...exercises};
        const index = updatedExercises[category].findIndex(ex => ex.id === exerciseId);

        if (index === -1 || updatedExercises[category][index].isCompleted) return;

        updatedExercises[category][index].isCompleted = true;

        // Unlock the next exercise if it exists
        if (index + 1 < updatedExercises[category].length) {
            updatedExercises[category][index + 1].isLocked = false;
        }

        setExercises(updatedExercises);
        setSelectedExercise(null);
        saveProgress();
    };

    // Reset exercise completion
    const resetExercise = (category, exerciseId) => {
        const updatedExercises = {...exercises};
        const index = updatedExercises[category].findIndex(ex => ex.id === exerciseId);

        if (index === -1) return;

        updatedExercises[category][index].isCompleted = false;
        updatedExercises[category][index].isLocked = false;

        // Re-lock subsequent exercises if they're not completed
        const lockSubsequentExercises = (startIndex) => {
            for (let i = startIndex + 1; i < updatedExercises[category].length; i++) {
                if (!updatedExercises[category][i].isCompleted) {
                    updatedExercises[category][i].isLocked = true;
                } else {
                    break; // Stop locking if we find a completed exercise
                }
            }
        };

        // Lock subsequent uncompleted exercises
        if (index + 1 < updatedExercises[category].length && !updatedExercises[category][index + 1].isCompleted) {
            updatedExercises[category][index + 1].isLocked = true;
            lockSubsequentExercises(index + 1);
        }

        setExercises(updatedExercises);
        setSelectedExercise(null);
        saveProgress();
    };

    // Get exercise description - simplified for demo
    const getExerciseDescription = (exerciseId) => {
        const descriptions = {
            pushUp: 'The standard push-up works the chest, shoulders, triceps, and core.',
            widePushUp: 'Wide push-ups place more emphasis on the chest muscles.',
            // More descriptions would be added here
        };
        return descriptions[exerciseId] || 'This exercise focuses on building functional strength through proper form and progression.';
    };

    // Get exercise tips - simplified for demo
    const getExerciseTips = (exerciseId) => {
        const tips = {
            pushUp: ['Keep body in a straight line', 'Lower until chest nearly touches ground', 'Keep elbows at about 45°'],
            widePushUp: ['Engage your core to maintain stability', 'Lower chest to just above the ground', 'Keep elbows flared properly'],
            // More tips would be added here
        };
        return tips[exerciseId] || ['Maintain proper form', 'Focus on controlled movement', 'Breathe steadily throughout'];
    };

    return (
        <div className="flex flex-col gap-y-6">
            <h1 className="title">RapidTree Progression</h1>

            {/* Progress Bar */}
            <div className="w-full rounded-lg bg-slate-100 p-4 shadow-sm">
                <div className="flex w-full flex-col items-center justify-center">
                    <div className="mb-2 flex justify-between w-full">
                        <span className="text-sm font-medium text-slate-700">Your Progress</span>
                        <span className="text-sm font-medium text-slate-700">{totalProgress}%</span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-slate-200">
                        <div 
                            className="h-full rounded-full bg-[#1e628c] transition-all duration-500" 
                            style={{width: `${totalProgress}%`}}
                        ></div>
                    </div>
                </div>
            </div>

            {/* Category Menu */}
            <div className="flex flex-wrap gap-2 overflow-x-auto pb-2 sm:flex-nowrap">
                {Object.keys(exercises).map((category) => (
                    <button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={cn(
                            "whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                            activeCategory === category 
                                ? "bg-[#1e628c] text-white" 
                                : "bg-white text-slate-800 hover:bg-slate-100"
                        )}
                    >
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                    </button>
                ))}
            </div>

            {/* Hexagon Grid Container - Responsive */}
            <div className="relative min-h-[50vh] w-full overflow-x-auto">
                <div className="grid grid-cols-2 gap-4 pb-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {exercises[activeCategory].map((exercise, index) => (
                        <div
                            key={exercise.id}
                            onClick={() => !exercise.isLocked && showExerciseDetails(activeCategory, exercise.id)}
                            className={cn(
                                "relative flex aspect-[1/1.15] cursor-pointer flex-col items-center justify-center rounded-lg p-2 text-center transition-all duration-200",
                                exercise.isCompleted ? "bg-[#27ae60] text-white" : 
                                exercise.isLocked ? "cursor-not-allowed bg-slate-300 text-slate-500" : "bg-[#1e628c] text-white",
                                "hover:shadow-lg",
                            )}
                        >
                            {exercise.isLocked && (
                                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/20">
                                    <Lock className="h-6 w-6 text-white" />
                                </div>
                            )}
                            {exercise.isCompleted && (
                                <div className="absolute right-2 top-2">
                                    <CheckCircle className="h-5 w-5 text-white" />
                                </div>
                            )}
                            <div className="text-xl font-bold">{exercise.icon}</div>
                            <div className="mt-2 text-xs font-medium leading-tight sm:text-sm">{exercise.title}</div>
                            <div className="mt-1 text-xs opacity-80">{exercise.level}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Exercise Details Panel */}
            {selectedExercise && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
                    <div className="max-h-[90vh] w-full max-w-md overflow-y-auto rounded-lg bg-white p-6 shadow-xl">
                        <div className="mb-4 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className={cn(
                                    "flex h-12 w-12 items-center justify-center rounded-lg text-white",
                                    selectedExercise.isCompleted ? "bg-[#27ae60]" : "bg-[#1e628c]"
                                )}>
                                    <span className="text-lg font-bold">{selectedExercise.icon}</span>
                                </div>
                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900">{selectedExercise.title}</h3>
                                    <div className="text-sm text-slate-500">{selectedExercise.level} Level</div>
                                </div>
                            </div>
                            <button 
                                onClick={() => setSelectedExercise(null)}
                                className="rounded-full p-1 text-slate-500 hover:bg-slate-100"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <p className="text-slate-700">{getExerciseDescription(selectedExercise.id)}</p>

                            <div>
                                <h4 className="mb-2 font-semibold text-slate-900">Requirements:</h4>
                                <div className="mb-1 flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                                    <span className="text-slate-700">Sets</span>
                                    <span className="font-medium text-slate-900">3</span>
                                </div>
                                <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                                    <span className="text-slate-700">Reps</span>
                                    <span className="font-medium text-slate-900">8-12</span>
                                </div>
                            </div>

                            <div>
                                <h4 className="mb-2 font-semibold text-slate-900">Tips:</h4>
                                <ul className="space-y-1 rounded-lg bg-slate-50 p-3">
                                    {getExerciseTips(selectedExercise.id).map((tip, i) => (
                                        <li key={i} className="flex items-start gap-2 text-slate-700">
                                            <div className="mt-1 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-[#1e628c]"></div>
                                            <span>{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
                                <button
                                    onClick={() => 
                                        selectedExercise.isCompleted 
                                            ? resetExercise(selectedExercise.category, selectedExercise.id)
                                            : completeExercise(selectedExercise.category, selectedExercise.id)
                                    }
                                    className={cn(
                                        "flex-1 rounded-lg py-2 text-center font-medium text-white",
                                        selectedExercise.isCompleted
                                            ? "bg-red-500 hover:bg-red-600"
                                            : "bg-[#1e628c] hover:bg-[#174e70]"
                                    )}
                                >
                                    {selectedExercise.isCompleted ? 'Reset Progress' : 'Mark as Complete'}
                                </button>
                                <button
                                    onClick={() => setSelectedExercise(null)}
                                    className="flex-1 rounded-lg border border-slate-300 bg-white py-2 text-center font-medium text-slate-700 hover:bg-slate-50"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="pb-6">
                <Footer />
            </div>
        </div>
    );
};

export default RapidTreePage;
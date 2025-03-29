import { useState, useEffect } from "react";
import { Dumbbell, Calendar, Clock, BarChart, ChevronRight, Plus, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/utils/cn";

const ExerciseTrackerPage = () => {
    // Function to handle manual refresh of data
    const refreshData = () => {
        // Simply re-run the data loading process
        setIsLoading(true);
        
        try {
            // Get workout history from localStorage
            const workoutHistory = JSON.parse(localStorage.getItem('workout_history') || '[]');
            
            // Get exercise tracking data from ExerciseCounter component
            const exerciseData = JSON.parse(localStorage.getItem('exerciseTrackerData') || '[]');
            
            // Convert exercise data to workout format
            const exerciseWorkouts = processExerciseData(exerciseData);
            
            // Combine both data sources
            const combinedWorkouts = [...workoutHistory, ...exerciseWorkouts];
            
            // Sort workouts by date (newest first)
            const sortedWorkouts = combinedWorkouts.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            setWorkouts(sortedWorkouts);
            
            // Calculate stats
            calculateStats(sortedWorkouts);
            
            // If there are workouts, select the first one by default
            if (sortedWorkouts.length > 0) {
                setSelectedWorkout(sortedWorkouts[0]);
            }
        } catch (error) {
            console.error('Error refreshing workout data:', error);
        } finally {
            setIsLoading(false);
        }
    };
    const [workouts, setWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalWorkouts: 0,
        totalExercises: 0,
        mostPopularExercise: "",
        thisWeekCount: 0
    });
    
    // Load workout data from localStorage
    useEffect(() => {
        setIsLoading(true);
        
        try {
            // Get workout history from localStorage
            const workoutHistory = JSON.parse(localStorage.getItem('workout_history') || '[]');
            
            // Get exercise tracking data from ExerciseCounter component
            const exerciseData = JSON.parse(localStorage.getItem('exerciseTrackerData') || '[]');
            
            // Convert exercise data to workout format
            const exerciseWorkouts = processExerciseData(exerciseData);
            
            // Combine both data sources
            const combinedWorkouts = [...workoutHistory, ...exerciseWorkouts];
            
            // Sort workouts by date (newest first)
            const sortedWorkouts = combinedWorkouts.sort((a, b) => {
                return new Date(b.date) - new Date(a.date);
            });
            
            setWorkouts(sortedWorkouts);
            
            // Calculate stats
            calculateStats(sortedWorkouts);
            
            // If there are workouts, select the first one by default
            if (sortedWorkouts.length > 0) {
                setSelectedWorkout(sortedWorkouts[0]);
            }
        } catch (error) {
            console.error('Error loading workout data:', error);
        } finally {
            setIsLoading(false);
        }
    }, []);
    
    // Helper function to process exercise data into workout format
    const processExerciseData = (exerciseData) => {
        if (!exerciseData || exerciseData.length === 0) return [];
        
        // Group exercises by date (year-month-day)
        const exercisesByDate = {};
        
        exerciseData.forEach(exercise => {
            const date = new Date(exercise.date);
            const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD format
            
            if (!exercisesByDate[dateKey]) {
                exercisesByDate[dateKey] = [];
            }
            
            exercisesByDate[dateKey].push(exercise);
        });
        
        // Convert to workout format
        return Object.entries(exercisesByDate).map(([dateKey, exercises]) => {
            return {
                id: `repbot-${dateKey}`,
                date: new Date(dateKey).toISOString(),
                title: "RepBot Session",
                duration: exercises.length * 60, // Estimate 60 seconds per exercise
                exercises: exercises,
                source: "RepBot"
            };
        });
    };
    
    // Helper function to calculate stats
    const calculateStats = (workouts) => {
        if (workouts.length === 0) {
            setStats({
                totalWorkouts: 0,
                totalExercises: 0,
                mostPopularExercise: "",
                thisWeekCount: 0
            });
            return;
        }
        
        // Calculate total workouts
        const totalWorkouts = workouts.length;
        
        // Calculate total exercises
        const exercises = workouts.flatMap(workout => workout.exercises || []);
        const totalExercises = exercises.reduce((sum, ex) => sum + (ex.reps || 1), 0);
        
        // Find most popular exercise
        const exerciseCounts = {};
        exercises.forEach(ex => {
            const exerciseName = ex.exercise || ex.name;
            if (exerciseName) {
                exerciseCounts[exerciseName] = (exerciseCounts[exerciseName] || 0) + 1;
            }
        });
        
        let mostPopular = "";
        let highestCount = 0;
        
        Object.entries(exerciseCounts).forEach(([name, count]) => {
            if (count > highestCount) {
                mostPopular = name;
                highestCount = count;
            }
        });
        
        // Calculate workouts this week
        const today = new Date();
        const oneWeekAgo = new Date(today);
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
        
        const thisWeekWorkouts = workouts.filter(workout => {
            const workoutDate = new Date(workout.date);
            return workoutDate >= oneWeekAgo;
        });
        
        setStats({
            totalWorkouts,
            totalExercises,
            mostPopularExercise: mostPopular,
            thisWeekCount: thisWeekWorkouts.length
        });
    };
    
    // Format date for display
    const formatDate = (dateString) => {
        const options = { weekday: 'short', month: 'short', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };
    
    // Format time for display (convert seconds to minutes:seconds)
    const formatDuration = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    
    // Delete a workout
    const deleteWorkout = (id, e) => {
        e.stopPropagation();
        
        if (window.confirm('Are you sure you want to delete this workout?')) {
            try {
                // Check if this is a RepBot workout
                const isRepBotWorkout = id.startsWith('repbot-');
                
                if (isRepBotWorkout) {
                    // For RepBot workouts, we need to find and remove the individual exercises
                    const exerciseData = JSON.parse(localStorage.getItem('exerciseTrackerData') || '[]');
                    const dateKey = id.replace('repbot-', '');
                    
                    // Filter out exercises from this date
                    const updatedExercises = exerciseData.filter(ex => {
                        const exDate = new Date(ex.date);
                        const exDateKey = exDate.toISOString().split('T')[0];
                        return exDateKey !== dateKey;
                    });
                    
                    // Save updated exercise data
                    localStorage.setItem('exerciseTrackerData', JSON.stringify(updatedExercises));
                } else {
                    // For regular workouts, use the original deletion logic
                    const currentWorkouts = JSON.parse(localStorage.getItem('workout_history') || '[]');
                    const updatedWorkouts = currentWorkouts.filter(workout => workout.id !== id);
                    localStorage.setItem('workout_history', JSON.stringify(updatedWorkouts));
                    localStorage.removeItem(`workout_details_${id}`);
                }
                
                // Update state by removing the deleted workout
                const updatedWorkouts = workouts.filter(workout => workout.id !== id);
                setWorkouts(updatedWorkouts);
                
                // If the deleted workout was selected, select another one
                if (selectedWorkout && selectedWorkout.id === id) {
                    setSelectedWorkout(updatedWorkouts.length > 0 ? updatedWorkouts[0] : null);
                }
                
                // Update stats
                calculateStats(updatedWorkouts);
                
            } catch (error) {
                console.error('Error deleting workout:', error);
            }
        }
    };

    return (
        <div className="flex flex-col gap-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c] text-white">
                        <Dumbbell size={20} />
                    </div>
                    <div>
                        <h1 className="title">Exercise Tracker</h1>
                        <p className="text-slate-600 text-sm">Track your workouts and monitor your progress</p>
                    </div>
                </div>
                <button 
                    onClick={refreshData}
                    className="px-4 py-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors flex items-center gap-2"
                    title="Refresh data from RepBot"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
                        <path d="M21 3v5h-5" />
                        <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
                        <path d="M8 16H3v5" />
                    </svg>
                    <span>Refresh</span>
                </button>
            </div>
            
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                            <Dumbbell size={16} className="text-blue-600" />
                        </div>
                        <span className="text-slate-600 font-medium">Total Workouts</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalWorkouts}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                            <BarChart size={16} className="text-green-600" />
                        </div>
                        <span className="text-slate-600 font-medium">Total Exercises</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.totalExercises}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                            <Calendar size={16} className="text-purple-600" />
                        </div>
                        <span className="text-slate-600 font-medium">This Week</span>
                    </div>
                    <p className="text-2xl font-bold">{stats.thisWeekCount}</p>
                </div>
                
                <div className="bg-white p-4 rounded-lg shadow border border-slate-200">
                    <div className="flex items-center gap-3 mb-2">
                        <div className="h-8 w-8 rounded-full bg-orange-100 flex items-center justify-center">
                            <Dumbbell size={16} className="text-orange-600" />
                        </div>
                        <span className="text-slate-600 font-medium">Favorite Exercise</span>
                    </div>
                    <p className="text-lg font-bold truncate">{stats.mostPopularExercise || "None"}</p>
                </div>
            </div>
            
            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Workout History List */}
                <div className="lg:col-span-1 bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-[#1e628c] text-white font-medium flex justify-between items-center">
                        <h2>Workout History</h2>
                        <Link to="/repbot" className="flex items-center gap-1 text-white bg-opacity-30 bg-white px-2 py-1 rounded text-sm">
                            <Plus size={16} />
                            <span>New</span>
                        </Link>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="w-8 h-8 border-4 border-t-[#1e628c] border-slate-200 rounded-full animate-spin"></div>
                        </div>
                    ) : workouts.length === 0 ? (
                        <div className="p-6 text-center">
                            <p className="text-slate-600 mb-4">No workouts recorded yet</p>
                            <Link to="/repbot" className="bg-[#1e628c] text-white px-4 py-2 rounded-lg inline-flex items-center gap-2">
                                <Plus size={16} />
                                <span>Start a Workout</span>
                            </Link>
                        </div>
                    ) : (
                        <div className="max-h-[500px] overflow-y-auto">
                            {workouts.map(workout => (
                                <div 
                                    key={workout.id}
                                    className={cn(
                                        "p-4 border-b border-slate-200 cursor-pointer hover:bg-slate-50 flex justify-between",
                                        selectedWorkout?.id === workout.id && "bg-slate-100"
                                    )}
                                    onClick={() => setSelectedWorkout(workout)}
                                >
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <Calendar size={14} className="text-slate-500" />
                                            <p className="font-medium">{formatDate(workout.date)}</p>
                                            {workout.source === "RepBot" && (
                                                <span className="bg-blue-100 text-blue-600 text-xs px-2 py-0.5 rounded">RepBot</span>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-1 text-slate-600 text-sm">
                                            <Clock size={14} />
                                            <span>{formatDuration(workout.duration || 0)}</span>
                                            <span>•</span>
                                            <span>{workout.exercises?.length || 0} exercises</span>
                                        </div>
                                    </div>
                                    <div className="flex items-center">
                                        <button 
                                            className="text-red-500 hover:bg-red-50 p-1 rounded-full"
                                            onClick={(e) => deleteWorkout(workout.id, e)}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                        <ChevronRight size={18} className="text-slate-400" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                
                {/* Workout Details */}
                <div className="lg:col-span-2 bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
                    <div className="p-4 bg-[#1e628c] text-white font-medium">
                        <h2>Workout Details</h2>
                    </div>
                    
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                            <div className="w-8 h-8 border-4 border-t-[#1e628c] border-slate-200 rounded-full animate-spin"></div>
                        </div>
                    ) : !selectedWorkout ? (
                        <div className="p-6 text-center">
                            <p className="text-slate-600">Select a workout to view details</p>
                        </div>
                    ) : (
                        <div className="p-4">
                            <div className="mb-6">
                                <div className="flex justify-between items-center mb-2">
                                    <h3 className="text-lg font-medium">
                                        {selectedWorkout.source === "RepBot" ? "RepBot Session" : "Workout"} on {formatDate(selectedWorkout.date)}
                                    </h3>
                                    <div className="flex items-center gap-2 text-slate-600 text-sm">
                                        <Clock size={16} />
                                        <span>{formatDuration(selectedWorkout.duration || 0)}</span>
                                    </div>
                                </div>
                                <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                    <div 
                                        className="h-full bg-green-500 rounded-full"
                                        style={{ width: `${Math.min(100, (selectedWorkout.exercises?.length || 0) * 20)}%` }}
                                    ></div>
                                </div>
                            </div>
                            
                            {selectedWorkout.exercises?.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {selectedWorkout.exercises.map((exercise, index) => (
                                        <div key={index} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                                            <div className="flex justify-between items-center">
                                                <div>
                                                    <h4 className="font-medium">{exercise.exercise || exercise.name}</h4>
                                                    <p className="text-slate-600 text-sm">{exercise.reps || 1} reps completed</p>
                                                </div>
                                                <div className="h-10 w-10 flex items-center justify-center bg-[#1e628c] text-white rounded-full font-bold">
                                                    {exercise.reps || 1}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-slate-600">No exercises recorded in this workout</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ExerciseTrackerPage;
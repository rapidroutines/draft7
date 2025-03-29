import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Footer } from "@/layouts/footer";
import { BookOpen, Clock, Flame, Target, Award, ArrowLeft, Printer, Share } from "lucide-react";
import { cn } from "@/utils/cn";

const SavedWorkoutsPage = () => {
    const [savedWorkouts, setSavedWorkouts] = useState([]);
    const [selectedWorkout, setSelectedWorkout] = useState(null);
    const navigate = useNavigate();
    
    // Load saved workouts from localStorage on component mount
    useEffect(() => {
        const workouts = localStorage.getItem('savedWorkouts');
        if (workouts) {
            try {
                setSavedWorkouts(JSON.parse(workouts));
            } catch (err) {
                console.error('Error loading saved workouts:', err);
            }
        }
    }, []);
    
    // Save to localStorage when workouts change
    useEffect(() => {
        if (savedWorkouts.length > 0) {
            localStorage.setItem('savedWorkouts', JSON.stringify(savedWorkouts));
        }
    }, [savedWorkouts]);
    
    // Handle deleting a workout
    const deleteWorkout = (id) => {
        const updatedWorkouts = savedWorkouts.filter(workout => workout.id !== id);
        setSavedWorkouts(updatedWorkouts);
        
        if (selectedWorkout && selectedWorkout.id === id) {
            setSelectedWorkout(null);
        }
    };
    
    // Function to print workout
    const printWorkout = () => {
        window.print();
    };
    
    // If no workouts are saved yet
    if (savedWorkouts.length === 0) {
        return (
            <div className="flex flex-col gap-y-6">
                <div className="flex items-center mb-2">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c] text-white">
                            <BookOpen size={20} />
                        </div>
                        <div>
                            <h1 className="title">My Saved Workouts</h1>
                            <p className="text-slate-600 text-sm">View and manage your personalized workout plans</p>
                        </div>
                    </div>
                </div>
                
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
                    <BookOpen className="h-16 w-16 text-slate-300 mb-4" />
                    <h2 className="text-xl font-semibold text-slate-800 mb-2">No Saved Workouts Yet</h2>
                    <p className="text-slate-600 mb-6 max-w-md text-center">
                        Generate a personalized workout with the AI Workout Generator and save it to see it here.
                    </p>
                    <button 
                        onClick={() => navigate('/ai-workout')}
                        className="px-4 py-2 bg-[#1e628c] text-white rounded-md hover:bg-[#174e70] flex items-center gap-2"
                    >
                        <ArrowLeft size={16} />
                        Go to AI Workout Generator
                    </button>
                </div>
                
                <Footer />
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-y-6">
            <div className="flex items-center mb-2">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1e628c] text-white">
                        <BookOpen size={20} />
                    </div>
                    <div>
                        <h1 className="title">My Saved Workouts</h1>
                        <p className="text-slate-600 text-sm">View and manage your personalized workout plans</p>
                    </div>
                </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Left Column: Workout List */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <div className="border-b border-slate-200 p-4">
                            <h2 className="font-medium text-slate-800">Your Saved Workouts</h2>
                        </div>
                        <div className="divide-y divide-slate-200 max-h-[600px] overflow-y-auto">
                            {savedWorkouts.map((workout) => (
                                <div 
                                    key={workout.id}
                                    className={cn(
                                        "p-4 cursor-pointer hover:bg-slate-50",
                                        selectedWorkout?.id === workout.id && "bg-slate-50"
                                    )}
                                    onClick={() => setSelectedWorkout(workout)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-medium text-slate-900">{workout.title}</h3>
                                            <div className="flex items-center gap-1 mt-1 text-xs text-slate-500">
                                                <Clock size={12} />
                                                <span>{workout.duration} min</span>
                                                <span className="mx-1">•</span>
                                                <span>{new Date(workout.date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-x-1">
                                            <button 
                                                className="p-1 text-slate-400 hover:text-red-500"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (window.confirm('Are you sure you want to delete this workout?')) {
                                                        deleteWorkout(workout.id);
                                                    }
                                                }}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                                    <path d="M3 6h18"></path>
                                                    <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                                                    <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        <span className={`px-2 py-0.5 rounded-full text-xs 
                                            ${workout.focusArea === 'strength' ? 'bg-blue-100 text-blue-700' : 
                                            workout.focusArea === 'cardio' ? 'bg-orange-100 text-orange-700' : 
                                            'bg-green-100 text-green-700'}`}>
                                            {workout.focusArea.charAt(0).toUpperCase() + workout.focusArea.slice(1)}
                                        </span>
                                        <span className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 text-xs">
                                            {workout.difficulty.charAt(0).toUpperCase() + workout.difficulty.slice(1)}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Right Column: Workout Details */}
                <div className="lg:col-span-3">
                    {selectedWorkout ? (
                        <div className="bg-white rounded-lg shadow-sm">
                            {/* Header */}
                            <div className="border-b border-slate-200 bg-slate-50 p-5">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-slate-900">{selectedWorkout.title}</h2>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={printWorkout}
                                            className="p-2 text-slate-600 hover:text-slate-900 bg-white rounded-md border border-slate-200"
                                            title="Print workout"
                                        >
                                            <Printer size={16} />
                                        </button>
                                        <button 
                                            onClick={() => {
                                                if (navigator.share) {
                                                    navigator.share({
                                                        title: selectedWorkout.title,
                                                        text: `Check out my workout: ${selectedWorkout.title}`
                                                    }).catch(err => console.error('Error sharing:', err));
                                                } else {
                                                    alert('Web Share API not supported on this device');
                                                }
                                            }}
                                            className="p-2 text-slate-600 hover:text-slate-900 bg-white rounded-md border border-slate-200"
                                            title="Share workout"
                                        >
                                            <Share size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    <div className="bg-white p-3 rounded-md border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">Duration</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">{selectedWorkout.duration} min</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-md border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Flame className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">Calories</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">~{selectedWorkout.estimatedCalories}</p>
                                    </div>
                                    <div className="bg-white p-3 rounded-md border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Target className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">Focus</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">
                                            {selectedWorkout.focusArea.charAt(0).toUpperCase() + selectedWorkout.focusArea.slice(1)}
                                        </p>
                                    </div>
                                    <div className="bg-white p-3 rounded-md border border-slate-200">
                                        <div className="flex items-center gap-2">
                                            <Award className="h-4 w-4 text-slate-400" />
                                            <span className="text-sm font-medium text-slate-700">Level</span>
                                        </div>
                                        <p className="mt-1 text-lg font-semibold text-slate-900">
                                            {selectedWorkout.difficulty.charAt(0).toUpperCase() + selectedWorkout.difficulty.slice(1)}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Workout Exercises */}
                            <div className="p-5">
                                <h3 className="text-lg font-semibold text-slate-800 mb-4">Exercise Plan</h3>
                                
                                <div className="space-y-4">
                                    {selectedWorkout.workout.map((exercise, index) => (
                                        <div key={index} className="rounded-lg border border-slate-200 overflow-hidden">
                                            <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                                <div className="flex justify-between items-center">
                                                    <h4 className="font-medium text-slate-900">{exercise.name}</h4>
                                                    <div className="bg-[#1e628c] text-white text-xs font-medium rounded-full w-6 h-6 flex items-center justify-center">
                                                        {index + 1}
                                                    </div>
                                                </div>
                                                {exercise.note && (
                                                    <p className="mt-1 text-xs text-slate-500">{exercise.note}</p>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-3 divide-x divide-slate-200">
                                                <div className="p-3 text-center">
                                                    <p className="text-xs text-slate-500 mb-1">Sets</p>
                                                    <p className="font-semibold text-slate-900">{exercise.sets}</p>
                                                </div>
                                                <div className="p-3 text-center">
                                                    <p className="text-xs text-slate-500 mb-1">Reps</p>
                                                    <p className="font-semibold text-slate-900">{exercise.reps}</p>
                                                </div>
                                                <div className="p-3 text-center">
                                                    <p className="text-xs text-slate-500 mb-1">Rest</p>
                                                    <p className="font-semibold text-slate-900">{exercise.rest}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                
                                {/* Workout Tips */}
                                <div className="mt-6 rounded-md bg-blue-50 p-4">
                                    <h4 className="font-medium text-blue-700 mb-2">Workout Tips</h4>
                                    <ul className="space-y-2 text-sm text-blue-600">
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                                            <span>Begin with a 5-minute warm-up to prepare your muscles and joints.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                                            <span>Stay hydrated throughout your workout.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                                            <span>Focus on proper form rather than maximizing weight or speed.</span>
                                        </li>
                                        <li className="flex items-start gap-2">
                                            <div className="mt-1 h-1.5 w-1.5 rounded-full bg-blue-600"></div>
                                            <span>End with a 5-minute cooldown and stretching session.</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm p-8 flex flex-col items-center justify-center h-full">
                            <div className="bg-slate-100 rounded-full p-4 mb-4">
                                <ArrowLeft className="h-6 w-6 text-slate-400" />
                            </div>
                            <h3 className="text-lg font-medium text-slate-800 mb-2">Select a Workout</h3>
                            <p className="text-slate-500 text-center">
                                Choose a workout from the list to view detailed information
                            </p>
                        </div>
                    )}
                </div>
            </div>
            
            <Footer />
        </div>
    );
};

export default SavedWorkoutsPage;
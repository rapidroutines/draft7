import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";
import pushUpsImage from "@/assets/pseudo-planche-push-ups.png";
import declinepushUpsImage from "@/assets/decline-push-ups.png";
import pistolSquatsImage from "@/assets/pistol-squats.png";
import hollowbodyHoldImage from "@/assets/hollow-body-hold.png";
import straddlePlancheImage from "@/assets/straddle-planche.png";
import dragonFlagImage from "@/assets/dragon-flag.png";
import cossackSquatHoldImage from "@/assets/cossack-squat-hold.png";
import deadHangImage from "@/assets/dead-hang.png";
import lsitImage from "@/assets/l-sit.png";
import chestsStretchImage from "@/assets/chest-stretch.png";
import straightarmBackwardsStretchImage from "@/assets/straight-arm-backwards-stretch.png";
import supinatedPushUpsImage from "@/assets/supinated-push-ups.png";
import benchDipsImage from "@/assets/bench-dips.png";
import frontLeverImage from "@/assets/front-lever.png";
import plancheLeanImage from "@/assets/planche-lean.png";
import frogPoseImage from "@/assets/frog-pose.png";

// Exercise data
const exercises = [
    {
        id: 1,
        title: "Pseudo Planche Push-up",
        category: "calisthenics",
        description: "A compound exercise that works the chest, shoulders, triceps, and core muscles.",
        difficulty: 2,
        image: pushUpsImage  
    },
    {
        id: 2,
        title: "Decline Push-up",
        category: "calisthenics",
        description: "An upper body exercise that targets the chest and triceps.",
        difficulty: 1,
        image: declinepushUpsImage
    },
    {
        id: 3,
        title: "Pistol Squats",
        category: "calisthenics",
        description: "A lower body exercise focusing on the quadriceps, hamstrings, and glutes.",
        difficulty: 2,
        image: pistolSquatsImage
    },
    {
        id: 4,
        title: "Hollow Body Hold",
        category: "core",
        description: "A core exercise that targets the mid and low abdominals.",
        difficulty: 1,
        image: hollowbodyHoldImage
    },
    {
        id: 5,
        title: "Straddle Planche",
        category: "calisthenics",
        description: "An isometric planche progression that requires tremendous strength ",
        difficulty: 3,
        image: straddlePlancheImage
    },
    {
        id: 6,
        title: "Dragon Flag",
        category: "core",
        description: "A core exercise that targets the rectus abdominis, obliques, and transverse abdominis.",
        difficulty: 3,
        image: dragonFlagImage
    },
    {
        id: 7,
        title: "Cossack Squat Hold",
        category: "mobility",
        description: "A deep lateral squat shifting weight from one leg to the other.",
        difficulty: 1,
        image: cossackSquatHoldImage
    },
    {
        id: 8,
        title: "Dead Hangs",
        category: "mobility",
        description: "A grip-strength exercise where you hang from a bar with arms fully extended.",
        difficulty: 1,
        image: deadHangImage
    },
    {
        id: 9,
        title: "L sit",
        category: "calisthenics",
        description: "A core-intensive hold where you support yourself on parallel bars or the floor with legs extended straight in front",
        difficulty: 2,
        image: lsitImage
    },
    {
        id: 10,
        title: "One Arm Chest Stretch",
        category: "mobility",
        description: "A stretch where one arm is extended against a wall or surface to open up the chest and shoulders.",
        difficulty: 1,
        image: chestsStretchImage
    },
    {
        id: 11,
        title: "Straight Arm Backwards Stretch",
        category: "mobility",
        description: "A stretch where you extend your arms straight back to open the chest and shoulders.",
        difficulty: 1,
        image: straightarmBackwardsStretchImage
    },
    {
        id: 12,
        title: "Supinated Push Ups",
        category: "calisthenics",
        description: "A push-up variation where your hands are turned palms-up, engaging the biceps and wrists more.",
        difficulty: 1,
        image: supinatedPushUpsImage
    },
    {
        id: 13,
        title: "Bench Dips",
        category: "calisthenics",
        description: "A triceps-focused exercise where you lower and raise your body using a bench for support.",
        difficulty: 1,
        image: benchDipsImage
    },
    {
        id: 14,
        title: "Front Lever",
        category: "calisthenics",
        description: "A full-body strength hold where you hang from a bar and keep your body straight and horizontal.",
        difficulty: 3,
        image: frontLeverImage
    },
    {
        id: 15,
        title: "Planche Lean",
        category: "calisthenics",
        description: "A strength exercise where you lean forward in a push-up position, shifting weight onto your hands to build planche strength.",
        difficulty: 1,
        image: plancheLeanImage
    },
     {
        id: 16,
        title: "Frog Pose",
        category: "calisthenics",
        description: "A deep hip-opening stretch where you rest on your hands or forearms with knees wide apart.",
        difficulty: 1,
        image: frogPoseImage
    }
];

// Custom color variable for the requested blue shade
const customBlue = "#1e628c";

const LibraryPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredExercises, setFilteredExercises] = useState(exercises);
    
    // Update document title for better SEO and user experience
    useEffect(() => {
        document.title = "RapidRoutines - Exercise Library";
    }, []);
    
    useEffect(() => {
        // Filter exercises based on active category
        if (activeCategory === 'all') {
            setFilteredExercises(exercises);
        } else {
            setFilteredExercises(exercises.filter(exercise => exercise.category === activeCategory));
        }
    }, [activeCategory]);

    return (
        <div className="flex flex-col gap-y-4">
            <div className="flex items-center justify-between">
                <h1 className="title">Exercise Library</h1>
            </div>

            <div className="flex justify-center flex-wrap gap-4 mb-4">
                <button 
                    onClick={() => setActiveCategory('all')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'all' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'all' ? customBlue : '' }}
                >
                    All Exercises
                </button>
                <button 
                    onClick={() => setActiveCategory('calisthenics')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'calisthenics' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'calisthenics' ? customBlue : '' }}
                >
                    Calisthenics
                </button>
                <button 
                    onClick={() => setActiveCategory('mobility')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'mobility' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'mobility' ? customBlue : '' }}
                >
                    Mobility
                </button>
                <button 
                    onClick={() => setActiveCategory('core')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'core' 
                            ? "bg-[#1e628c] text-white" 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'core' ? customBlue : '' }}
                >
                    Core
                </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredExercises.map((exercise) => (
                    <div key={exercise.id} className="card">
                        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                            <img 
                                src={exercise.image} 
                                alt={exercise.title}
                                className="w-full h-full object-cover"
                            />
                            <div 
                                className="absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold text-white"
                                style={{
                                    backgroundColor: 
                                        exercise.category === 'calisthenics' ? customBlue : 
                                        exercise.category === 'mobility' ? "#10b981" : "#f97316"
                                }}
                            >
                                {exercise.category}
                            </div>
                        </div>
                        
                        <div className="p-4">
                            <h3 className="card-title text-lg">{exercise.title}</h3>
                            <p className="text-slate-600 text-sm mt-2">{exercise.description}</p>
                            
                            <div className="flex items-center mt-4">
                                <div className="flex items-center gap-1 mr-3">
                                    {[1, 2, 3].map((level) => (
                                        <span 
                                            key={level}
                                            className={cn(
                                                "w-2 h-2 rounded-full",
                                                level <= exercise.difficulty 
                                                    ? "bg-slate-500" 
                                                    : "bg-slate-200"
                                            )}
                                            style={{
                                                backgroundColor: level <= exercise.difficulty 
                                                    ? customBlue 
                                                    : "#e2e8f0"
                                            }}
                                        />
                                    ))}
                                </div>
                                <span className="text-xs text-slate-500">
                                    {exercise.difficulty === 1 ? 'Beginner' : 
                                     exercise.difficulty === 2 ? 'Intermediate' : 'Advanced'}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* No results message when filters return empty */}
            {filteredExercises.length === 0 && (
                <div className="py-8 text-center">
                    <p className="text-slate-600">No exercises found in this category.</p>
                    <button
                        onClick={() => setActiveCategory('all')}
                        className="mt-4 text-[#1e628c] hover:underline"
                    >
                        View all exercises
                    </button>
                </div>
            )}

            <Footer />
        </div>
    );
};

export default LibraryPage;

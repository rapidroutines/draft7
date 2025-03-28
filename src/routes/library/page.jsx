import { useState, useEffect } from "react";
import { Footer } from "@/layouts/footer";
import { cn } from "@/utils/cn";

// Exercise data
const exercises = [
    {
        id: 1,
        title: "Push-ups",
        category: "calisthenics",
        description: "A compound exercise that works the chest, shoulders, triceps, and core muscles.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Push-ups"
    },
    {
        id: 2,
        title: "Pull-ups",
        category: "calisthenics",
        description: "An upper body exercise that targets the back, biceps, and shoulders for building strength.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Pull-ups"
    },
    {
        id: 3,
        title: "Bodyweight Squats",
        category: "calisthenics",
        description: "A lower body exercise focusing on the quadriceps, hamstrings, and glutes.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Bodyweight+Squats"
    },
    {
        id: 4,
        title: "Dips",
        category: "calisthenics",
        description: "Targets the triceps, chest, and shoulders while improving upper body strength.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Dips"
    },
    {
        id: 5,
        title: "Plank",
        category: "calisthenics",
        description: "An isometric core strength exercise that involves maintaining a position similar to a push-up.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Plank"
    },
    {
        id: 6,
        title: "Hip Flexor Stretch",
        category: "mobility",
        description: "Improves hip flexibility and helps alleviate lower back pain caused by tight hip flexors.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Hip+Flexor+Stretch"
    },
    {
        id: 7,
        title: "Shoulder Dislocates",
        category: "mobility",
        description: "Enhances shoulder mobility and stability using a resistance band or stick.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Shoulder+Dislocates"
    },
    {
        id: 8,
        title: "Deep Squat Hold",
        category: "mobility",
        description: "Improves ankle, knee, and hip mobility while strengthening the lower body.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Deep+Squat+Hold"
    },
    {
        id: 9,
        title: "Thoracic Bridge",
        category: "mobility",
        description: "Enhances thoracic spine mobility and opens up the chest for better posture.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Thoracic+Bridge"
    },
    {
        id: 10,
        title: "Wrist Circles",
        category: "mobility",
        description: "Improves wrist mobility and circulation, helping to prevent wrist pain during exercises.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Wrist+Circles"
    },
    {
        id: 11,
        title: "Jumping Jacks",
        category: "cardio",
        description: "A full-body exercise that raises heart rate and improves coordination.",
        difficulty: 1,
        image: "https://via.placeholder.com/300x180?text=Jumping+Jacks"
    },
    {
        id: 12,
        title: "Mountain Climbers",
        category: "cardio",
        description: "A dynamic exercise that works the core, arms, and legs while elevating heart rate.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Mountain+Climbers"
    },
    {
        id: 13,
        title: "Burpees",
        category: "cardio",
        description: "A challenging full-body exercise that boosts cardiovascular fitness and burns calories.",
        difficulty: 3,
        image: "https://via.placeholder.com/300x180?text=Burpees"
    },
    {
        id: 14,
        title: "High Knees",
        category: "cardio",
        description: "A running-in-place exercise that increases heart rate and works the core and legs.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=High+Knees"
    },
    {
        id: 15,
        title: "Jump Rope",
        category: "cardio",
        description: "An effective cardio exercise that improves coordination, rhythm, and endurance.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Jump+Rope"
    },
     {
        id: 16,
        title: "pseudo push up",
        category: "calisthenics",
        description: "An effective cardio exercise that improves coordination, rhythm, and endurance.",
        difficulty: 2,
        image: "https://via.placeholder.com/300x180?text=Jump+Rope"
    }
];

// Custom color variable for the requested blue shade
const customBlue = "#1e628c";

const LibraryPage = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [filteredExercises, setFilteredExercises] = useState(exercises);
    
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
                            ? `bg-[${customBlue}] text-white` 
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
                            ? `bg-[${customBlue}] text-white` 
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
                            ? `bg-[${customBlue}] text-white` 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'mobility' ? customBlue : '' }}
                >
                    Mobility
                </button>
                <button 
                    onClick={() => setActiveCategory('cardio')}
                    className={cn(
                        "px-4 py-2 rounded-full text-sm font-semibold transition-colors",
                        activeCategory === 'cardio' 
                            ? `bg-[${customBlue}] text-white` 
                            : "bg-white text-slate-700 hover:bg-slate-100"
                    )}
                    style={{ backgroundColor: activeCategory === 'cardio' ? customBlue : '' }}
                >
                    Cardio
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

            <Footer />
        </div>
    );
};

export default LibraryPage;

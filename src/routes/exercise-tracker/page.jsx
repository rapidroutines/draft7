import { Dumbbell, Info } from "lucide-react";
import { Footer } from "@/layouts/footer";

const ExerciseTrackerPage = () => {
    return (
        <div className="flex flex-col space-y-6">
            {/* Information Boxes */}
            <div className="grid md:grid-cols-2 gap-6">
                {/* About Section */}
                <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-slate-800">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e628c] text-white">
                            <Info size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">About Exercise Tracker</h2>
                    </div>
                    <p className="text-sm text-slate-700 dark:text-slate-300">
                        A powerful tool designed to help you monitor and improve your fitness journey. 
                        Log your workouts, track progress, and gain insights into your physical performance.
                    </p>
                </div>

                {/* Quick Tips Section */}
                <div className="bg-white rounded-2xl shadow-md p-6 dark:bg-slate-800">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1e628c] text-white">
                            <Dumbbell size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-slate-900 dark:text-white">How to Use</h2>
                    </div>
                    <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                        {[
                            "Log workouts immediately",
                            "Include exercise details",
                            "Track progress over time",
                            "Set fitness goals",
                            "Review performance"
                        ].map((tip, index) => (
                            <li key={index} className="flex items-center gap-2">
                                <span className="h-1.5 w-1.5 bg-[#1e628c] rounded-full"></span>
                                {tip}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Embedded Tracker */}
            <div className="rounded-2xl bg-white shadow-md overflow-hidden dark:bg-slate-800">
                <div className="bg-[#1e628c] text-white p-4 flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
                        <Dumbbell size={20} />
                    </div>
                    <h2 className="text-lg font-semibold">Exercise Tracking Dashboard</h2>
                </div>
                
                <div className="w-full aspect-video">
                    <iframe 
                        src="https://exercise-tracker-tau.vercel.app" 
                        className="w-full h-full border-0"
                        title="Exercise Tracker Interface"
                        allow="fullscreen"
                    ></iframe>
                </div>
            </div>

            <Footer />
        </div>
    );
};

export default ExerciseTrackerPage;